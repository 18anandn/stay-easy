-- FUNCTION: public.find_homes(character varying, character varying, numeric, character varying, character varying, character varying, integer, integer, character varying)

-- DROP FUNCTION IF EXISTS public.find_homes(character varying, character varying, numeric, character varying, character varying, character varying, integer, integer, character varying);

CREATE OR REPLACE FUNCTION public.find_homes(
	bounding_box_str character varying DEFAULT NULL::character varying,
	lng_lat_str character varying DEFAULT NULL::character varying,
	distance_meters numeric DEFAULT NULL::numeric,
	amenities_str character varying DEFAULT NULL::character varying,
	book_from_str character varying DEFAULT NULL::character varying,
	book_to_str character varying DEFAULT NULL::character varying,
	rows integer DEFAULT NULL::integer,
	page integer DEFAULT NULL::integer,
	sort_by character varying DEFAULT NULL::character varying)
    RETURNS TABLE(data json, count bigint) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL SAFE 
    ROWS 1

AS $BODY$
DECLARE
    bounding_box geography(POLYGON);
    lng_lat geography(Point, 4326);
    effective_distance_meters numeric := COALESCE(distance_meters, 5000);
    amenities_arr text[] := string_to_array(amenities_str, ',');
    book_from date;
	book_to date;
BEGIN
    -- Parse bounding box string if provided
    IF bounding_box_str IS NOT NULL THEN
        bounding_box := ST_MakeEnvelope(
            CAST(split_part(bounding_box_str, ',', 1) AS double precision),  -- x_min
            CAST(split_part(bounding_box_str, ',', 2) AS double precision),  -- y_min
            CAST(split_part(bounding_box_str, ',', 3) AS double precision),  -- x_max
            CAST(split_part(bounding_box_str, ',', 4) AS double precision),  -- y_max
            4326
        );
    END IF;

    -- Parse lng_lat string if provided
    IF lng_lat_str IS NOT NULL THEN
        lng_lat := ST_SetSRID(ST_MakePoint(
            CAST(split_part(lng_lat_str, ',', 1) AS double precision),  -- longitude
            CAST(split_part(lng_lat_str, ',', 2) AS double precision)   -- latitude
        ), 4326);
    END IF;

    -- Set default values for "rows" and "page" if they are NULL
    rows := COALESCE(rows, 10);
    page := COALESCE(page, 1);

    -- Limit the maximum value of "rows" to 50
    rows := LEAST(rows, 50);
	
	book_from := book_from_str::date;
	book_to := book_to_str::date;

    -- Calculate the offset based on the "page" and "rows" values
    DECLARE
        offset_value integer := (page - 1) * rows;
    BEGIN
        -- Query homes based on conditions and sort the results
        RETURN QUERY
        WITH home_results_all AS (
			SELECT
				h.id,
				h.name,
				ST_AsGeoJSON(h.location) as location,
				h.city,
				h.state,
				h.country,
				CASE WHEN lng_lat IS NOT NULL THEN ST_DistanceSphere(h.location::geometry, lng_lat::geometry) ELSE NULL END AS distance,
				h.price,
				h.main_image_id
			FROM
				public.home h
			WHERE
				verification_status = 'approved'
				AND (
					CASE
						WHEN lng_lat IS NOT NULL THEN
							ST_DWithin(h.location::geometry, lng_lat::geometry, effective_distance_meters, false)
						WHEN bounding_box IS NOT NULL THEN
							ST_Contains(bounding_box::geometry, h.location::geometry)
						ELSE
							true
					END
				)
				AND (
					amenities_arr IS NULL
					OR (
						SELECT COUNT(DISTINCT a.name)
						FROM public.home_amenities ha
						JOIN public.amenity a ON ha.amenity = a.id
						WHERE ha.home = h.id AND LOWER(a.name) = ANY(amenities_arr)
					) = array_length(amenities_arr, 1)
				)
				AND (
					book_from_str IS NULL
					OR (
						date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE h.time_zone) < book_from
						AND EXISTS (
							SELECT 1
							FROM public.cabin c
							WHERE c.home_id = h.id
								AND NOT EXISTS (
									SELECT 1
									FROM public.booking b
									WHERE b.cabin_id = c.id
										AND (b.from_date < book_to AND b.to_date > book_from)
									LIMIT 1
								)
							LIMIT 1
						)
					)
				)
			GROUP BY
				h.id
			ORDER BY
				CASE WHEN sort_by = 'price_low' THEN h.price END,  -- Sort by price in ascending order
				CASE WHEN sort_by = 'price_high' THEN h.price END DESC,  -- Sort by price in descending order
				CASE
					WHEN sort_by = 'closest' AND lng_lat IS NOT NULL THEN ST_DistanceSphere(h.location::geometry, lng_lat::geometry) -- Sort by distance using ST_DistanceSphere
					ELSE h.number
				END
		),
		count_rows AS (
			SELECT
				COUNT(*) AS count
			FROM
				home_results_all
		),
		temp_homes AS (
			SELECT
				*
			FROM
				home_results_all
			LIMIT rows
			OFFSET offset_value
		),
		homes AS (
			SELECT
				*
			FROM
				home_results_all
			LIMIT rows
			OFFSET offset_value
		),
		data_table AS (
			SELECT
				homes.id,
				homes.name,
				homes.location,
				homes.city,
				homes.state,
				homes.country,
				homes.distance,
				homes.price,
				s1.object_key AS main_image,
				extra_images_table.extra_images
			FROM
				homes
				LEFT JOIN LATERAL (
					SELECT
						himg.home,
						ARRAY_AGG(s2.object_key ORDER BY s2.id) as extra_images
					FROM
						public.home_images himg
					JOIN
						public.s3file s2 ON s2.id = himg.image
					WHERE
						himg.home = homes.id
					GROUP BY himg.home
				) extra_images_table ON true
			LEFT JOIN public.s3file s1 ON homes.main_image_id = s1.id
		)
		SELECT
			data.data AS data,
			count_rows.count AS count
		FROM
			count_rows
		JOIN (
			SELECT
				COALESCE(json_agg(data_table), '[]') data
			FROM
				data_table
		) data ON true;
    END;
END;
$BODY$;
