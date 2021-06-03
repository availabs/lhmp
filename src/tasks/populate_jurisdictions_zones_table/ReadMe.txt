INSERT INTO zones.zones (name,geoid,building_id,geom,plan_id)
WITH t AS 
(SELECT geoid as cousub_geoid,
 substring(geoid,1,5) as geoid,
 name ,geom
 FROM geo.tl_2017_36_cousub 
 WHERE substring(geoid,1,5) = '36105')

SELECT t.name as name,
substring(a.cousub_geoid,1,LENGTH(a.cousub_geoid)) as geoid,
array_agg(a.building_id),t.geom,32
FROM irvs.enhanced_building_risk as a
JOIN t on substring(a.cousub_geoid,1,LENGTH(a.cousub_geoid)) = t.cousub_geoid
GROUP BY substring(a.cousub_geoid,1,LENGTH(a.cousub_geoid)),t.name,t.geom
UNION
SELECT DISTINCT 'Sullivan County',substring(a.geoid,1,5) as geoid,
array_agg(a.building_id),b.geom,32
FROM irvs.enhanced_building_risk as a
JOIN t on substring(a.geoid,1,5) = t.geoid
JOIN geo.tl_2017_us_county as b on b.geoid = substring(a.geoid,1,5)
GROUP BY substring(a.geoid,1,5),b.geom

to work on in order to remove duplicate values

SELECT attributes ->> 'geoid',unnest(array_remove(all_ctids, actid))
  FROM (
         SELECT
	  		attributes,
	  type,plan_id,
           max(b.id)     AS actid,
           array_agg(id) AS all_ctids
         FROM forms.forms_data b
         GROUP BY attributes,type,plan_id
         HAVING count(*) > 1) c
WHERE type = 'jurisdictions'
and plan_id = '14'

DELETE FROM forms.forms_data
WHERE ctid IN (
  SELECT unnest(array_remove(all_ctids, actid))
  FROM (
         SELECT
	  	   attributes,
	  	   type,plan_id,
           max(b.ctid)     AS actid,
           array_agg(ctid) AS all_ctids
         FROM forms.forms_data b
         GROUP BY attributes,type,plan_id
         HAVING count(*) > 1) c)
and type = 'jurisdictions'
--and plan_id = '14'

WITH t as (
	SELECT t1.id,
	t1.attributes as attr,
	t1.attributes ->> 'geoid' as geoid,
	t1.attributes ->> 'name' as name,
	t1.type,
	t1.plan_id
FROM forms.forms_data t1
INNER JOIN (SELECT attributes,COUNT(*) AS CountOf
            FROM forms.forms_data
            GROUP BY attributes
            HAVING COUNT(*)>1
            ) t2 ON
               t1.attributes ->> 'geoid'
               =
               t2.attributes ->> 'geoid'

WHERE
t1.plan_id = '10'
and t1.type = 'jurisdictions'
)

SELECT * FROM t
ORDER BY name
