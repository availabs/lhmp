import os, psycopg2
from os import environ


def fetch_plans_for_lhmp(cursor):
    """
    Already done for the following :
    Fulton County(36035) - 56
    Hamilton County(36041) - 10
    Schenectady County(36093) - 61
    Sullivan County(36105) - 32,65
    Delaware County(36025) - 59,64
    """
    print('IN FETCH PLANS FOR LHMP TO GET THE COUNTIES')
    sql = """
		WITH RECURSIVE
          t1 AS (select plan_id,unnest(array_agg(attributes->>'geoid')) as geoid
                        from forms.forms_data 
                        WHERE type = 'jurisdictions'
                        GROUP BY 1)
        , t2 AS (SELECT t2.id as plan_id,t2.county as county,t2.fips as fips
                     from plans.county t2
                     JOIN t1 on t1.plan_id = t2.id 
                     WHERE length (t1.geoid) = '7'
                    GROUP BY 1,2,3
                    ORDER BY t2.id) 
        , t3 AS (SELECT id,county,fips
                FROM plans.county
                WHERE id NOT IN (SELECT t2.plan_id FROM t2)
                and fips != '36'
                ORDER BY id
                )
        SELECT * FROM t3
	"""
    cursor.execute(sql)
    fips_data = [{'plan_id': t[0], 'county': t[1], 'fips': t[2]} for t in cursor.fetchall()]
    print('FETCHED PLANS FOR LHMP TO GET THE COUNTIES')
    return fips_data


# def fetch_plans_NY_for_LHMP(cursor):
#     """
#     Only for NY plan id = '63'
#     """
#     print('IN FETCH PLANS FOR LHMP TO GET THE WHOLE NY')
#     sql = """
# 		select t2.id,t2.county,t2.fips
#             from plans.county t2
#             where t2.id not in (select DISTINCT plan_id from forms.forms_data where type = 'jurisdictions')
#             and t2.fips IN ('36')
# 	"""
#     cursor.execute(sql)
#     fips_data = [{'plan_id': t[0], 'county': t[1], 'fips': t[2]} for t in cursor.fetchall()]
#     print('FETCHED PLANS FOR LHMP TO TO GET THE WHOLE NY')
#     return fips_data


def update_building_ids_in_irvs(cursor,conn,fips):
    sql = """
            with t as (
            SELECT a.id,b.geoid as place_geoid
            from
            irvs.buildings_2018 as a
            join geo.tl_2017_36_place as b on ST_CONTAINS(b.geom,a.footprint)
            WHERE substring(a.geoid,1,5)::INT = """ + str(fips) + """
            )
            update irvs.buildings_2018 as a 
            set place_geoid = t.place_geoid
            from t
            where a.id = t.id
        
        """
    cursor.execute(sql)
    conn.commit()

def insert_places_in_places_table(cursor,conn,plan_id,fips):
    sql = """
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
                    """ + str(plan_id) + """ as plan_id,
                    ST_AsGeoJSON(geom) as geojson
                    FROM irvs.buildings_2018 as a
                    JOIN t on ST_CONTAINS(t.geom,a.footprint)
                    WHERE  substring(geoid,1,5)::INT = """ + str(fips) + """
                    GROUP BY t.place_geoid,t.name,t.geom
    """
    cursor.execute(sql)
    conn.commit()

# def update_places_irvs_for_NY(cursor,conn,fips):
#     sql = """
#     with t as (
#             SELECT a.id,b.geoid as place_geoid
#             from
#             irvs.buildings_2018 as a
#             join geo.tl_2017_36_place as b on ST_CONTAINS(b.geom,a.footprint)
#             WHERE substring(geoid,1,2)::INT = """ + str(fips) + """
#             )
#             update irvs.buildings_2018
#             from t
#             set place_geoid = t.place_geoid
#             where id = t.id
#     """
#
#     cursor.execute(sql)
#     conn.commit()

def insert_places_for_NY(cursor,conn,fips,plan_id):

    sql = """
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
            """ + str(plan_id) + """ as plan_id,
            ST_AsGeoJSON(geom) as geojson
            FROM irvs.buildings_2018 as a
            JOIN t on ST_CONTAINS(t.geom,a.footprint)
            WHERE  substring(geoid,1,2)::INT = """ + str(fips) + """
            GROUP BY t.place_geoid,t.name,t.geom
        """
    cursor.execute(sql)
    conn.commit()

def insert_places_into_forms(cursor,conn,plan_id):
    sql = """
        INSERT INTO forms.forms_data(
        type,plan_id, attributes)
        
        SELECT 'jurisdictions',""" + str(plan_id) + """,
            row_to_json((
                SELECT t
        FROM (
            SELECT name, geoid, geom, plan_id, building_id, boundary_box,ST_AsGeoJSON(geom)
        ) t
        
        ))
        FROM zones.places
        where plan_id = """ + str(plan_id) + """
    """
    cursor.execute(sql)
    conn.commit()


def main():
    with open('../../config/postgres.env') as f:
        os.environ.update(
            line.replace('export ', '', 1).strip().split('=', 1) for line in f
            if 'export' in line
        )

    conn = psycopg2.connect(host=environ.get('PGHOST'),
                            database=environ.get('PGDATABASE'),
                            user=environ.get('PGUSER'),
                            port=environ.get('PGPORT'),
                            password=environ.get('PGPASSWORD'))
    cursor = conn.cursor()

    # fips_data_except_NY = fetch_plans_for_lhmp(cursor)
    #
    # for item in fips_data_except_NY:
    #     print("UPDATING IRVS FOR PLACES GEOID", item)
    #     update_building_ids_in_irvs(cursor,conn,item['fips'])
    #     print("UPDATED IRVS FOR PLACES GEOID", item)
    #     print("INSERTING INTO ZONES PLACES TABLE FOR", item)
    #     insert_places_in_places_table(cursor,conn,item['plan_id'],item['fips'])
    #     print("INSERTED INTO ZONES PLACES TABLE FOR", item)
    #     print("NOW INSERT INTO FORMS TABLE", item)
    #     insert_places_into_forms(cursor,conn,item['plan_id'])
    #     print("INSERTED INTO FORMS TABLE")

    fips_data_NY = [{'plan_id':63,'county':'NY','fips':36}]

    print('LETS DO IT FOR NY NOW')

    for item in fips_data_NY:
        print("INSERTING INTO ZONES PLACES TABLE FOR", item)
        insert_places_for_NY(cursor,conn,item['fips'],item['plan_id'])
        print("INSERTED INTO ZONES PLACES TABLE FOR", item)
        print("NOW INSERT INTO FORMS TABLE", item)
        insert_places_into_forms(cursor,conn,item['plan_id'])
        print("INSERTED INTO FORMS TABLE")

    conn.commit()
    cursor.close()
    conn.close()


# END main

if __name__ == "__main__":
    main()
