-- FUNCTION: public.is_valid_timezone(character varying)

-- DROP FUNCTION IF EXISTS public.is_valid_timezone(character varying);

CREATE OR REPLACE FUNCTION public.is_valid_timezone(
	timezone_name character varying)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL SAFE 
AS $BODY$
BEGIN
    RETURN EXISTS (SELECT 1 FROM pg_timezone_names WHERE LOWER(name) = LOWER(timezone_name));
END;
$BODY$;

ALTER FUNCTION public.is_valid_timezone(character varying)
    OWNER TO anand;
