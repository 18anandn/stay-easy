
CREATE OR REPLACE FUNCTION public.get_any_home_data(
	home_id uuid,
	user_id uuid)
    RETURNS TABLE(id uuid, name character varying, verification_status home_verification_status_enum, message text, location json, address text, number_of_cabins smallint, cabin_capacity smallint, main_image character varying, extra_images character varying[], amenities character varying[]) 
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
			home.verification_status AS verification_status,
			home.message AS message,
			ST_AsGeoJSON(home.location)::json AS location,
			home.address AS address,
			home.number_of_cabins AS number_of_cabins,
			home.cabin_capacity AS cabin_capacity,
			s3file.object_key AS main_image
		FROM
			home
		LEFT JOIN
			s3file ON s3file.id = home.main_image_id
		WHERE
			home.id = get_any_home_data.home_id AND home.owner_id = get_any_home_data.user_id
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
	)
	SELECT
		home_table.*,
		extra_images_table.extra_images,
		amenities_table.amenities
	FROM 
		home_table
	JOIN
		extra_images_table ON true
	JOIN
		amenities_table ON true;
END;
$BODY$;
