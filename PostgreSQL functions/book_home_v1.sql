-- FUNCTION: public.book_home(character varying, character varying, character varying, character varying, integer)

-- DROP FUNCTION IF EXISTS public.book_home(character varying, character varying, character varying, character varying, integer);

CREATE OR REPLACE FUNCTION public.book_home(
	home_id_str character varying,
	from_date_str character varying,
	to_date_str character varying,
	user_id_str character varying,
	guests integer)
    RETURNS TABLE(booking_id character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL SAFE 
    ROWS 1000

AS $BODY$
DECLARE
	home_id uuid;
	user_id uuid;
    home_row public.home;
	selected_cabin public.cabin;
    booking_row public.booking;
    book_from date;
    book_to date;
    nights integer;
    base_price numeric;
    total_price numeric;
BEGIN
	
	home_id := home_id_str::uuid;
	user_id := user_id_str::uuid;
	
    SELECT * INTO home_row
    FROM public.home
    WHERE id = home_id
	AND verification_status = 'approved'
    FOR UPDATE;

    -- Throw an error if home not found
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No home with id: %', home_id_str;
    END IF;
	
	IF guests > home_row.cabin_capacity THEN
        RAISE EXCEPTION 'Max capacity is %', home_row.cabin_capacity;
    END IF;

	book_from := from_date_str::date;
	book_to := to_date_str::date;
	
    -- Select only available cabins in the given date range
    WITH available_cabin_list AS (
		SELECT *
		FROM public.cabin c
		WHERE c.home_id = home_row.id
			AND NOT EXISTS (
				SELECT 1
				FROM public.booking b
				WHERE b.cabin_id = c.id
					AND (b.from_date < book_to AND b.to_date > book_from)
			)
		ORDER BY c.number
	)
	SELECT *
	INTO selected_cabin
	FROM available_cabin_list
	LEFT JOIN LATERAL (
		SELECT
			(book_from - booking.to_date) AS prev_diff
		FROM
			booking
		WHERE
			booking.cabin_id = available_cabin_list.id
			AND booking.to_date > (CURRENT_TIMESTAMP AT TIME ZONE home_row.time_zone)::date
			AND booking.to_date <= book_from
		ORDER BY booking.to_date DESC
		LIMIT 1
	) prev_booking ON true
	LEFT JOIN LATERAL (
		SELECT
			(booking.from_date - book_to) AS next_diff
		FROM
			booking
		WHERE
			booking.cabin_id = available_cabin_list.id
			AND booking.from_date >= book_to
		ORDER BY booking.from_date ASC
		LIMIT 1
	) next_booking ON true
	ORDER BY
		LEAST(COALESCE(prev_diff, 'infinity'::numeric), COALESCE(next_diff, 'infinity'::numeric)) ASC,
		GREATEST(COALESCE(prev_diff, 'infinity'::numeric), COALESCE(next_diff, 'infinity'::numeric)) ASC,
		number ASC
	LIMIT 1;
	
	-- Throw an error if cabins list is empty
    IF selected_cabin IS NULL THEN
        RAISE EXCEPTION 'Home is unavailable for the specified date range';
    END IF;
	
	nights := book_to - book_from;

    -- Calculate base price per night
    base_price := CASE
        WHEN guests <= 2 THEN home_row.price
        ELSE home_row.price + (guests - 2) * home_row.price_per_guest
    END;

    -- Calculate total price with tax (10%)
    total_price := base_price * nights * 1.10;

    -- Create a booking for the selected cabin
    INSERT INTO public.booking (home_id, user_id, cabin_id, from_date, to_date, paid, guests)
    VALUES (home_row.id, user_id, selected_cabin.id, book_from, book_to, total_price, guests)
    RETURNING id INTO booking_row.id;
	
	

    -- Return the booking_id
    RETURN QUERY
    SELECT booking_row.id AS booking_id;
	
END;
$BODY$;

ALTER FUNCTION public.book_home(character varying, character varying, character varying, character varying, integer)
    OWNER TO anand;
