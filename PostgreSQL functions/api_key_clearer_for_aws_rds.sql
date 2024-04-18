DO
$do$
DECLARE
    cron_expr TEXT := '00 00 * * *';
	job_name TEXT := 'clear_geocoding_api_records';
	prev_jobid bigint;
	new_jobid bigint;
	command TEXT := $$ 
					 LOCK TABLE geocoding_api_key;
					 UPDATE geocoding_api_key SET calls = 0;
				 	$$;
BEGIN
	SELECT jobid INTO prev_jobid FROM cron.job WHERE cron.job.jobname = job_name;
	IF prev_jobid IS NOT NULL 
	THEN	
		PERFORM cron.unschedule(prev_jobid);
		RAISE NOTICE 'Prev job found and deleted';
	END IF;
	 new_jobid := cron.schedule(job_name, cron_expr, command);
	 UPDATE cron.job SET database = 'stayeasy' WHERE jobid = new_jobid;
END
$do$