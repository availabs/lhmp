STEPS TO CALCULATE BUILDING RISK DATA (RISK_VALUE,HAZARD_LOSS_PERCENT,HAZARD_LOSS_DOLLARS)

1) Polygonize the adf file to sh file

    # Convert shp file to geojson to upload in the mapbox

    ogr2ogr -f GeoJSON -t_srs crs:84 /home/nayanika/Downloads/ANDES/59_riverine_500_26.geojson /home/nayanika/Downloads/ANDES/500_Andes.shp


2) upload in Hazard_mitigation database, hazard_risk_geography

    shp2pgsql -s 32618:4326 -d /home/nayanika/HazardData/Delaware_Depth/500.shp hazard_risk_geography.59_riverine_500 > /home/nayanika/HazardData/Delaware_Depth/59_riverine_500.sql                                                                                                                                                 #insert into the database
    psql -h mars.availabs.org -d hazard_mitigation -U postgres -f /home/nayanika/HazardData/Delaware_Depth/59_riverine_100.sql

    # Mapbox
    tippecanoe -zg --generate-ids -o riverine_risk.mbtiles --coalesce-densest-as-needed --extend-zooms-if-still-dropping

3) Insert the respective data in hazard_risk_geography.risk_zones
5) Create column depth_feet in hazard_risk_geography.(plan_id_risk_year) and Convert the depth_meters to depth_feet
4) Run fetch_building_id_depth_feet.py with the respective table and the geoid a arguments

   SELECT DISTINCT a.id as buildings_2018_id,c.building_id as ebr_id,max(depth_m) as depth
           FROM hazard_risk_geography."59_riverine_500" as b
           join irvs.buildings_2018 as a on st_intersects(a.footprint, b.geom)
   		join irvs.enhanced_building_risk as c on a.id = c.building_id
           WHERE substring(a.geoid,1,5) = '36025'
           GROUP BY a.id,c.building_id

5) Run fetch_occupancy_types_create_json.py if not done before --> gives out a json with all the values
6) Run insert_building_risk_table to insert the new data with the respective table and geoid as arguments
7) Run fetch_building_risk_data.py with risk_zone_id as argument
8) Run calculate_hazard_loss_percent.py
9) Run update_building_risk_table.py

STEPS TO INSERT/CREATE DFIRM TABLES

1) QUERY to fetch the data from the dfirm schema

    Flood_100:

    INSERT INTO hazard_risk_geography."59_dfirm_100"
    (depth_m, geom)
    SELECT "DEPTH",geom
    FROM "flood_DFIRM"."nys_flood_DFIRM_4326"
    WHERE "DFIRM_ID" LIKE '36025%'
    AND "FLD_ZONE" IN ('AE','A','AH','VE','AO')

    Flood_500:

    INSERT INTO hazard_risk_geography."59_dfirm_500"
    (depth_m, geom)
    SELECT "DEPTH",geom,"FLD_ZONE","ZONE_SUBTY"
            FROM "flood_DFIRM"."nys_flood_DFIRM_4326" as a
            WHERE "DFIRM_ID" LIKE '36025%'
            AND ("FLD_ZONE" IN ('AE','A','AH','VE','AO')
        		 OR ("FLD_ZONE" IN ('X') AND
        		 "ZONE_SUBTY" = '0.2 PCT ANNUAL CHANCE FLOOD HAZARD'))




 ------------------------------------------------------- To insert dfirm data for all counties in NYS ----------------------------------------------------------------------

counties having dfirm data : 3,4,5,8,11,12,14,15,16,17,19,20,
21,22,23,24,26,27,28,29,30,
31,32,34,35,37,38,39,40,
41,43,46,47
50,54,55,57,58,59,60,61,62
list of the counties which do not have dfirm 100 and 500 data:
plan_id - County - geoid
1 - Steuben County - 36101 - no data
2 - Allegany County - 36003 - no data
3 - Saratoga County - 36091 - no data for st_intersects(footprint,geom) with irvs.buildings_2018 and dfirm table
6 - Schuyler County - 36097 - no data
7 - St. Lawrence County- 36089 - no data
9 - Suffolk County - 36103 - no data for st_intersects(footprint,geom) with irvs.buildings_2018 and dfirm table
10 - Hamilton County - 36041 - no data
13 - Tompkins County - 36109 - no data for st_intersects(footprint,geom) with irvs.buildings_2018 and dfirm table
18 - Warren County - 36113 - no data
25 - Lewis County - 36049 - no data for st_intersects(footprint,geom) with irvs.buildings_2018 and dfirm table
33 - Orleans County - 36073 - no data for st_intersects(footprint,geom) with irvs.buildings_2018 and dfirm table
36 - Yates County - 36123 - no data
42 - Seneca County - 36099 - no data for st_intersects(footprint,geom) with irvs.buildings_2018 and dfirm table
44 - Genesse County - 36037 - no data for st_intersects(footprint,geom) with irvs.buildings_2018 and dfirm table
45 - Wayne County - 36117 - no data for st_intersects(footprint,geom) with irvs.buildings_2018 and dfirm table
48 - Chemung County - 36015 - no data for st_intersects(footprint,geom) with irvs.buildings_2018 and dfirm table
49 - Wyoming County - 36121 - no data for st_intersects(footprint,geom) with irvs.buildings_2018 and dfirm table
51 - Columbia County - 36021 - no data for st_intersects(footprint,geom) with irvs.buildings_2018 and dfirm table
53 - Franklin County - 36033 - no data for st_intersects(footprint,geom) with irvs.buildings_2018 and dfirm table
56 - Fulton County - 36035 - no data for st_intersects(footprint,geom) with irvs.buildings_2018 and dfirm table


start from 49

-- -- -----------Flood_500_100-----------------------------------------------------------------------------
-- INSERT INTO hazard_risk_geography."20_dfirm_500_100"
--     (depth_m, geom)
-- SELECT "DEPTH",a.geom
-- FROM "flood_DFIRM"."nys_flood_DFIRM_4326" as a
-- JOIN geo.tl_2017_us_county_4326 as b on ST_INTERSECTS(a.geom,b.geom)
-- WHERE b.geoid IN ('36019')
-- AND ("FLD_ZONE" IN ('AE','A','AH','VE','AO')
-- 	 OR ("FLD_ZONE" IN ('X') AND
-- 	 "ZONE_SUBTY" = '0.2 PCT ANNUAL CHANCE FLOOD HAZARD'))

-- -- -----------Flood_100-----------------------------------------------------------------------------
INSERT INTO hazard_risk_geography."20_dfirm_100"
    (depth_m, geom)
SELECT "DEPTH",a.geom
    FROM "flood_DFIRM"."nys_flood_DFIRM_4326" as a
JOIN geo.tl_2017_us_county_4326 as b on ST_INTERSECTS(a.geom,b.geom)
WHERE b.geoid IN ('36019')
AND "FLD_ZONE" IN ('AE','A','AH','VE','AO')
--------------------------------------------------------------------------------------------------------------------------
--DELETE FROM hazard_risk_geography."20_dfirm_100"

SELECT * from plans.county
ORDER BY(id) asc

-- CREATE TABLE hazard_risk_geography."17_dfirm_100"
-- (
-- 	gid integer,
-- 	geom geometry,
-- 	depth_m integer,
-- 	PRIMARY KEY(gid)
-- )
--nextval('hazard_risk_geography."59_dfirm_500_100_gid_seq"'::regclass)
--nextval('hazard_risk_geography."59_dfirm_100_gid_seq"'::regclass)
--2147483647
-- SELECT * FROM irvs.building_risk
-- WHERE risk_zone_id = '41'
------------------------------------------------------------
-- INSERT INTO hazard_risk_geography.risk_zones(
-- 	hazard_zone, annual_occurance, plan_id, table_name,name)
-- 	VALUES ('dfirm',1,21,'21_dfirm_100','Annual 1%')
-- 	RETURNING *

SELECT * FROM hazard_risk_geography.risk_zones
------------------------------------------------------------
SELECT id, name, plan_id
	FROM hazard_risk_geography.risk_scenarios;

-- INSERT INTO hazard_risk_geography.risk_scenarios(name,plan_id)
-- VALUES('FEMA DFIRM',21)

-- DELETE FROM hazard_risk_geography.risk_scenarios
-- WHERE plan_id = '9'
----------------------------------------------------------------
INSERT INTO hazard_risk_geography.risk_scenarios_zones(
	risk_scenario_id, risk_zone_id)
	VALUES (19,'49');

-- SELECT * from hazard_risk_geography.risk_scenarios_zones

-- DELETE FROM hazard_risk_geography.risk_scenarios_zones
-- WHERE risk_scenario_id = '11'

-----------------------------------------------------------------
SELECT "DEPTH",a.id,a.geom
FROM "flood_DFIRM"."nys_flood_DFIRM_4326" as a
JOIN geo.tl_2017_us_county_4326 as b on ST_INTERSECTS(a.geom,b.geom)
WHERE b.geoid IN ('36019')
AND ("FLD_ZONE" IN ('AE','A','AH','VE','AO')
	 OR ("FLD_ZONE" IN ('X') AND
	 "ZONE_SUBTY" = '0.2 PCT ANNUAL CHANCE FLOOD HAZARD'))

SELECT "DEPTH",a.geom,a.id
     FROM "flood_DFIRM"."nys_flood_DFIRM_4326" as a
 JOIN geo.tl_2017_us_county_4326 as b on ST_INTERSECTS(a.geom,b.geom)
 WHERE b.geoid IN ('36019')
 AND "FLD_ZONE" IN ('AE','A','AH','VE','AO')

------------------------------------------------------------------------------
SELECT risk_zone_id,plan_id,table_name FROM hazard_risk_geography.risk_zones
WHERE plan_id IN (4,5,9,11,12,14,15,16,19,20,21,24,27,29,30,31,34,37,38,39,41,46,54,55,57,60,61)
ORDER BY(plan_id)
-----------------------------------------------------------------
DELETE FROM irvs.building_risk
	WHERE risk_zone_id IN (
		'28','29','30','31','33','32','34'
		'35','37','36','38','39','41','40','42','43',
'45',
'44',
'46',
'47',
'49',
'48',
'50',
'51',
'55',
'54',
'56',
'57',
'58',
'59',
'61',
'60',
'62',
'63',
'64',
'65',
'67',
'66',
'68',
'69',
'71',
'70',
'72',
'73',
'75',
'74',
'76',
'77',
'78',
'79',
'81',
'80',
'82',
'83'
	)
