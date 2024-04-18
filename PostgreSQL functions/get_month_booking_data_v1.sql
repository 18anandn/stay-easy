-- FUNCTION: public.get_month_booking_data(uuid, uuid, date, date)

CREATE OR REPLACE FUNCTION public.get_month_booking_data(
	home_id uuid,
	user_id uuid,
	start_date date,
	end_date date)
    RETURNS TABLE(id uuid, name character varying, number_of_cabins smallint, number_of_bookings bigint, month_data json, by_month_stats json, by_booking_stats json) 
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
			INNER JOIN
				booking ON booking.home_id = home_table.id AND (booking.from_date <= end_date AND booking.to_date > start_date)
		),
		month_table AS (
			SELECT
				start_of_month::date AS start,
				(start_of_month + INTERVAL '1 month' - INTERVAL '1 day')::date AS end
			FROM generate_series(
				date_trunc('month', start_date),
				date_trunc('month', end_date),
				INTERVAL '1 month'
			) start_of_month
		),
		by_month_data AS (
			SELECT 
				month_table.start AS month,
				COALESCE(
					SUM(
						CASE
							WHEN booking_table.from_date IS NULL THEN NULL
							ELSE LEAST(booking_table.to_date, (month_table.start + INTERVAL '1 month')::date) - GREATEST(booking_table.from_date, month_table.start)
						END
					),
					0
				) AS occupancy,
				COALESCE(
					SUM(
						CASE
							WHEN booking_table.from_date IS NULL THEN NULL
							ELSE (LEAST(booking_table.to_date, (month_table.start + INTERVAL '1 month')::date) - GREATEST(booking_table.from_date, month_table.start))::numeric * booking_table.paid / (booking_table.to_date - booking_table.from_date)
						END
					),
					0
				) AS revenue,
				COALESCE(SUM(booking_table.guests), 0) AS guests
			FROM
				month_table
			LEFT JOIN booking_table ON booking_table.from_date <= month_table.end AND booking_table.to_date > month_table.start
			GROUP BY month_table.start
		),
		occupancy_by_month AS (
			SELECT
				COALESCE(MIN(by_month_data.occupancy), 0) AS min,
				COALESCE(AVG(by_month_data.occupancy), 0) AS avg,
				COALESCE(MAX(by_month_data.occupancy), 0) AS max
			FROM
				by_month_data
		),
		revenue_by_month AS (
			SELECT
				COALESCE(MIN(by_month_data.revenue), 0) AS min,
				COALESCE(AVG(by_month_data.revenue), 0) AS avg,
				COALESCE(MAX(by_month_data.revenue), 0) AS max
			FROM
				by_month_data
		),
		guests_by_month AS (
			SELECT
				COALESCE(MIN(by_month_data.guests), 0) AS min,
				COALESCE(AVG(by_month_data.guests), 0) AS avg,
				COALESCE(MAX(by_month_data.guests), 0) AS max
			FROM
				by_month_data
		),
		occupancy_by_booking AS (
			SELECT
				COALESCE(MIN(LEAST(booking_table.to_date, end_date) - GREATEST(booking_table.from_date, start_date)), 0) AS min,
				COALESCE(AVG(LEAST(booking_table.to_date, end_date) - GREATEST(booking_table.from_date, start_date)), 0) AS avg,
				COALESCE(MAX(LEAST(booking_table.to_date, end_date) - GREATEST(booking_table.from_date, start_date)), 0) AS max,
				COALESCE(SUM(LEAST(booking_table.to_date, end_date) - GREATEST(booking_table.from_date, start_date)), 0) AS total
			FROM
				booking_table
		),
		revenue_by_booking AS (
			SELECT
				COALESCE(MIN((LEAST(booking_table.to_date, end_date) - GREATEST(booking_table.from_date, start_date))::numeric * booking_table.paid / (booking_table.to_date - booking_table.from_date)), 0) AS min,
				COALESCE(AVG((LEAST(booking_table.to_date, end_date) - GREATEST(booking_table.from_date, start_date))::numeric * booking_table.paid / (booking_table.to_date - booking_table.from_date)), 0) AS avg,
				COALESCE(MAX((LEAST(booking_table.to_date, end_date) - GREATEST(booking_table.from_date, start_date))::numeric * booking_table.paid / (booking_table.to_date - booking_table.from_date)), 0) AS max,
				COALESCE(SUM((LEAST(booking_table.to_date, end_date) - GREATEST(booking_table.from_date, start_date))::numeric * booking_table.paid / (booking_table.to_date - booking_table.from_date)), 0) AS total
			FROM
				booking_table
		),
		guests_by_booking AS (
			SELECT
				COALESCE(MIN(booking_table.guests), 0) AS min,
				COALESCE(AVG(booking_table.guests), 0) AS avg,
				COALESCE(MAX(booking_table.guests), 0) AS max,
				COALESCE(SUM(booking_table.guests), 0) AS total
			FROM
				booking_table
		),
		count_table AS (
			SELECT
				COALESCE(COUNT(*), 0) AS count
			FROM
				booking_table
		)
		SELECT
			home_table.*,
			count_table.count AS number_of_bookings,
			by_month_data.data,
			json_build_object(
				'occupancy', to_json(occupancy_by_month),
				'revenue', to_json(revenue_by_month),
				'guests', to_json(guests_by_month)
			) AS by_month_stats,
			json_build_object(
				'occupancy', to_json(occupancy_by_booking),
				'revenue', to_json(revenue_by_booking),
				'guests', to_json(guests_by_booking)
			) AS by_booking_stats
		FROM
			home_table
		JOIN (
			SELECT
				json_agg(by_month_data ORDER BY month) AS data
			FROM
				by_month_data
		) by_month_data ON true
		JOIN occupancy_by_month ON true
		JOIN revenue_by_month ON true
		JOIN guests_by_month ON true
		JOIN occupancy_by_booking ON true
		JOIN revenue_by_booking ON true
		JOIN guests_by_booking ON true
		JOIN count_table ON true;
END;
$BODY$;
