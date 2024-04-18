-- FUNCTION: public.get_month_booking_data(uuid, uuid, date, date)

DROP FUNCTION IF EXISTS public.get_month_booking_data(uuid, uuid, date, date);

CREATE OR REPLACE FUNCTION public.get_month_booking_data(
	home_id uuid,
	user_id uuid,
	start_date date,
	end_date date)
    RETURNS TABLE(id uuid, name character varying, guests json, stay json, occupancy json) 
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
			home.number_of_cabins AS number_of_cabins
		FROM
			home
		WHERE
			home.id = get_month_booking_data.home_id AND home.owner_id = get_month_booking_data.user_id
		),
		booking_table AS (
			SELECT
				booking.id AS booking_id,
				booking.from_date AS from_date,
				booking.to_date AS to_date,
				booking.paid AS paid,
				booking.guests AS guests
			FROM
				home_table
			LEFT JOIN
				booking ON booking.home_id = home_table.id AND (booking.from_date <= end_date AND booking.to_date > start_date)
		),
		occupancy_table AS (
			SELECT 
				start_of_month.month AS month,
				COALESCE(
					SUM(
						LEAST(booking_table.to_date, (month + INTERVAL '1 month')::date) - GREATEST(booking_table.from_date, month)
					),
					0
				) AS occupied_days,
				COALESCE(
					SUM(
						(LEAST(booking_table.to_date, (month + INTERVAL '1 month')::date) - GREATEST(booking_table.from_date, month))::numeric
						* booking_table.paid / (booking_table.to_date - booking_table.from_date)
					),
					0
				) AS payment,
				COALESCE(SUM(booking_table.guests),0) AS guests
			FROM
				booking_table,
				LATERAL (
					SELECT
						start_of_month::date AS month
					FROM generate_series(
						date_trunc('month', booking_table.from_date),
						date_trunc('month', booking_table.to_date - INTERVAL '1 day'),
						INTERVAL '1 month'
					) start_of_month
				) start_of_month
			GROUP BY month
		),
		guests_table AS (
			SELECT
				MIN(booking_table.guests) AS min,
				AVG(booking_table.guests) AS avg,
				MAX(booking_table.guests) AS max
			FROM
				booking_table
		),
		stay_table AS (
			SELECT
				MIN(LEAST(booking_table.to_date, end_date) - GREATEST(booking_table.from_date, start_date)) AS min,
				AVG(LEAST(booking_table.to_date, end_date) - GREATEST(booking_table.from_date, start_date)) AS avg,
				MAX(LEAST(booking_table.to_date, end_date) - GREATEST(booking_table.from_date, start_date)) AS max
			FROM
				booking_table
		)
		SELECT
			home_table.*,
			guests.guests,
			stay.stay,
			occupancy.occupancy
		FROM
			home_table
		JOIN (
			SELECT
				json_agg(occupancy_table) AS occupancy
			FROM
				occupancy_table
		) occupancy ON true
		JOIN (
			SELECT
				to_json(guests_table) guests
			FROM
				guests_table
		) guests ON true
		JOIN (
			SELECT
				to_json(stay_table) stay
			FROM
				stay_table
		) stay ON true;
END;
$BODY$;

ALTER FUNCTION public.get_month_booking_data(uuid, uuid, date, date)
    OWNER TO postgres;
