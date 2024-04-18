
DROP FUNCTION get_verified_home_data(uuid,uuid);

CREATE OR REPLACE FUNCTION public.get_verified_home_data(
	home_id uuid,
	user_id uuid)
    RETURNS TABLE(id uuid, name character varying, location json, city character varying, state character varying, country character varying, address text, number_of_cabins smallint, cabin_capacity smallint, main_image character varying, extra_images character varying[], amenities character varying[], revenue numeric, total_bookings bigint)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL SAFE 
    ROWS 1
AS $BODY$
BEGIN
	RETURN QUERY
	WITH home_table AS (
		SELECT
			home.id AS id,
			home.name AS name,
			ST_AsGeoJSON(home.location)::json AS location,
			home.city AS city,
			home.state AS state,
			home.country AS country,
			home.address AS address,
			home.number_of_cabins AS number_of_cabins,
			home.cabin_capacity AS cabin_capacity,
			s3file.object_key AS main_image
		FROM
			home
		LEFT JOIN
			s3file ON s3file.id = home.main_image_id
		WHERE
			home.id = get_verified_home_data.home_id AND home.verification_status = 'approved' AND home.owner_id = get_verified_home_data.user_id
	),
	extra_images_table AS (
		SELECT
			ARRAY_AGG(s3file.object_key) AS extra_images
		FROM
			home_table
		LEFT JOIN
			home_images ON home_images.home = home_table.id
		LEFT JOIN
			s3file ON s3file.id = home_images.image
	),
	amenities_table AS (
		SELECT
			COALESCE(ARRAY_AGG(amenity.name), '{}'::character varying[]) AS amenities
		FROM
			home_table
		LEFT JOIN
			home_amenities ON home_amenities.home = home_table.id
		LEFT JOIN
			amenity ON amenity.id = home_amenities.amenity
	),
	stats_table AS (
		SELECT
			COALESCE(SUM(booking.paid), 0) AS revenue,
			COALESCE(COUNT(booking.id), 0) AS total_bookings
		FROM
			home_table
		LEFT JOIN
			booking ON booking.home_id = home_table.id
	)
	SELECT
		home_table.*,
		extra_images_table.extra_images,
		amenities_table.amenities,
		stats_table.revenue,
		stats_table.total_bookings
	FROM 
		home_table
	JOIN
		extra_images_table ON true
	JOIN
		stats_table ON true
	JOIN
		amenities_table ON true;
END;
$BODY$;
