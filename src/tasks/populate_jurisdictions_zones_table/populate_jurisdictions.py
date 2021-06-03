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
		select t2.id,t2.county,t2.fips
            from plans.county t2
            where t2.id not in (select DISTINCT plan_id from forms.forms_data where type = 'jurisdictions')
            and t2.fips not IN ('36')
            ORDER BY t2.id
	"""
    cursor.execute(sql)
    fips_data = [{'plan_id': t[0], 'county': t[1], 'fips': t[2]} for t in cursor.fetchall()]
    print('FETCHED PLANS FOR LHMP TO GET THE COUNTIES')
    return fips_data


def fetch_plans_NY_for_LHMP(cursor):
    """
    Only for NY plan id = '63'
    """
    print('IN FETCH PLANS FOR LHMP TO GET THE WHOLE NY')
    sql = """
		select t2.id,t2.county,t2.fips
            from plans.county t2
            where t2.id not in (select DISTINCT plan_id from forms.forms_data where type = 'jurisdictions')
            and t2.fips IN ('36')
	"""
    cursor.execute(sql)
    fips_data = [{'plan_id': t[0], 'county': t[1], 'fips': t[2]} for t in cursor.fetchall()]
    print('FETCHED PLANS FOR LHMP TO TO GET THE WHOLE NY')
    return fips_data


def insert_jurisdictions_for_cousubs_in_zones_table(cursor,conn,fips, plan_id):
    sql = """
    INSERT INTO zones.zones (name,geoid,building_id,geom,plan_id,geojson)
        WITH t AS
    (SELECT geoid as cousub_geoid,
    substring(geoid,1,5) as geoid,
                            name ,geom
    FROM geo.tl_2017_36_cousub
    WHERE substring(geoid,1,5)::INT = """ + str(fips) + """)

    
    SELECT t.name as name,
    t.cousub_geoid as geoid,
    array_agg(a.building_id),t.geom,""" + str(plan_id) + """,
    ST_AsGeoJSON(t.geom)
    FROM irvs.enhanced_building_risk as a
    RIGHT OUTER JOIN t on substring(a.cousub_geoid,1,LENGTH(a.cousub_geoid)) = t.cousub_geoid
    GROUP BY t.cousub_geoid,t.name,t.geom
    """

    cursor.execute(sql)
    conn.commit()

def insert_jurisdictions_for_counties_in_zones_table(cursor,conn,fips,plan_id,county):
    sql = """  
    INSERT INTO zones.zones (name,geoid,building_id,geom,plan_id,geojson) 
            WITH t AS 
        (SELECT geoid as geoid,
         name ,geom
         FROM geo.tl_2017_us_county
         WHERE geoid::INT =""" + str(fips) + """)
	
	SELECT DISTINCT""" + "'" + county + "'" + """,t.geoid,
    array_agg(a.building_id),t.geom,""" + str(plan_id) + """,
    ST_AsGeoJSON(t.geom)
    FROM irvs.enhanced_building_risk as a
    RIGHT OUTER JOIN t on substring(a.geoid,1,5) = t.geoid
    GROUP BY t.geoid,t.geom
    """
    cursor.execute(sql)
    conn.commit()

def insert_jurisdictions_for_NY(cursor,conn,fips, plan_id,county):
    sql = """
                INSERT INTO zones.zones (name,geoid,building_id,geom,plan_id,geojson)
                WITH t AS 
                (SELECT geoid as cousub_geoid,
                 substring(geoid,1,2) as geoid,
                 name ,geom
                 FROM geo.tl_2017_36_cousub 
                 WHERE substring(geoid,1,2)::INT = """ + str(fips) + """)
                
                SELECT t.name as name,
                substring(a.cousub_geoid,1,LENGTH(a.cousub_geoid)) as geoid,
                array_agg(a.building_id),t.geom,""" + str(plan_id) + """,
                ST_AsGeoJSON(t.geom)
                FROM irvs.enhanced_building_risk as a
                JOIN t on substring(a.cousub_geoid,1,LENGTH(a.cousub_geoid)) = t.cousub_geoid
                GROUP BY substring(a.cousub_geoid,1,LENGTH(a.cousub_geoid)),t.name,t.geom
                UNION
                SELECT DISTINCT """ + "'" + county + "'" + """,substring(a.geoid,1,2) as geoid,
                array_agg(a.building_id),b.geom,""" + str(plan_id) + """,
                ST_AsGeoJSON(t.geom)
                FROM irvs.enhanced_building_risk as a
                JOIN t on substring(a.geoid,1,2) = t.geoid
                JOIN geo.tl_2017_us_county as b on b.geoid = substring(a.geoid,1,2)
                GROUP BY substring(a.geoid,1,2),b.geom,t.geom
            """

    cursor.execute(sql)
    conn.commit()


def insert_jurisdictions_into_forms(cursor,conn,plan_id):

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
        FROM zones.zones
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
    fips_data_except_NY = fetch_plans_for_lhmp(cursor)


    for item in fips_data_except_NY:
        print("INSERTING COUSUBS INTO ZONES TABLE FOR", item)
        insert_jurisdictions_for_cousubs_in_zones_table(cursor,conn,item['fips'], item['plan_id'])
        print("INSERTED COUSUBS INTO ZONES TABLE FOR", item)
        print("INSERTING COUNTY INTO ZONES TABLE FOR",item)
        insert_jurisdictions_for_counties_in_zones_table(cursor,conn,item['fips'], item['plan_id'],item['county'])
        print("INSERTED COUNTY INTO ZONES TABLE FOR", item)
        print("NOW INSERT INTO FORMS TABLE", item)
        insert_jurisdictions_into_forms(cursor,conn,item['plan_id'])
        print("INSERTED INTO FORMS TABLE")

    print('LETS DO IT FOR NY NOW')
    fips_data_NY = fetch_plans_NY_for_LHMP(cursor)

    for item in fips_data_NY:
        print("INSERTING INTO ZONES TABLE FOR", item)
        insert_jurisdictions_for_NY(cursor,conn,item['fips'],item['plan_id'],item['county'])
        print("INSERTED INTO ZONES TABLE FOR", item)
        print("NOW INSERT INTO FORMS TABLE", item)
        insert_jurisdictions_into_forms(cursor,conn,item['plan_id'])
        print("INSERTED INTO FORMS TABLE")

    conn.commit()
    cursor.close()
    conn.close()


# END main

if __name__ == "__main__":
    main()
