with t as (
SELECT a.id,b.geoid as place_geoid
from
irvs.buildings_2018 as a
join geo.tl_2017_36_place as b on ST_CONTAINS(b.geom,a.footprint)
where substring(a.geoid,1,5) = '36025')
update irvs.buildings_2018
from t
set place_geoid = t.place_geoid
where id = t.id

        INSERT INTO zones.places(name,geoid,building_id,geom,plan_id,geojson)
        WITH t AS
        (
         SELECT geoid as place_geoid,
         name,
         geom
         FROM geo.tl_2017_36_place
        )

        SELECT t.name as name,
        t.place_geoid as geoid,
        array_agg(a.id) as building_id,
        t.geom,
        56 as plan_id,
        ST_AsGeoJSON(geom) as geojson
        FROM irvs.buildings_2018 as a
        JOIN t on ST_CONTAINS(t.geom,a.footprint)
        WHERE substring(a.geoid,1,5) = '36035'
        GROUP BY t.place_geoid,t.name,t.geom