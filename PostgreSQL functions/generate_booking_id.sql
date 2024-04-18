CREATE OR REPLACE FUNCTION public.generate_booking_id(
	)
    RETURNS character varying
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL SAFE 
AS $BODY$
DECLARE
    letters VARCHAR[] := ARRAY['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    shuffled_letters VARCHAR[];
	random_letters VARCHAR;
    random_number INT;
    sequence_part INT;
    booking_id VARCHAR;
BEGIN
    -- Select four different random capital letters excluding 'O'
    SELECT array_agg(letter ORDER BY random()) INTO shuffled_letters
    FROM unnest(letters) AS letter;

    -- Take the first four letters
    shuffled_letters := shuffled_letters[1:4];

    -- Concatenate the selected letters into random_letters
    random_letters := shuffled_letters[1] || shuffled_letters[2] || shuffled_letters[3] || shuffled_letters[4];

    -- Generate a random 4-digit number
    random_number := floor(random() * 9000) + 1000;

    -- Get the next value from the sequence
    SELECT nextval('booking_id_sequence') INTO sequence_part;

    -- Concatenate random letters, random number, sequence, and random letters again to form the booking ID
    booking_id := random_letters || sequence_part::VARCHAR || random_number::VARCHAR;

    RETURN booking_id;
END;
$BODY$;
