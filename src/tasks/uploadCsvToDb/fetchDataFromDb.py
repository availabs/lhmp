import numpy as np
import pandas
import psycopg2

import database_config

get_geo_names = '''with 
                places as (
                    SELECT county_geoid, a.geoid, upper(name || ', Village of') as name
                        FROM geo.tl_2017_36_place b
                        JOIN geo.places_in_counties a
                        ON b.geoid = a.geoid
                         ),
                cousubs as (
                    SELECT statefp || countyfp as county_geo, geoid, 
                    case
                        when namelsad like '%city%' then upper(name || ', City of')
                        else upper(name || ', Town of') 
                    end as name
                        FROM geo.tl_2017_36_cousub a),
		        counties as (
                    SELECT statefp || countyfp as county_geo, geoid, upper(namelsad) as name
                        FROM geo.tl_2017_us_county a
                        WHERE statefp = '36')
            SELECT * FROM cousubs 
            UNION 
            SELECT * FROM places 
            UNION 
            SELECT * from counties
            ORDER BY county_geo, name'''

get_plans = '''select id, fips from plans.county'''
def createTable(cursor, sql, header, filename):
    print("FETCHING DATA...")

    cursor.execute(sql)
    # results = pandas.read_sql_query(sql, connection)
    results = pandas.DataFrame(np.array(cursor.fetchall()))
    results.to_csv(filename, index=False, header=header)
    print ("TABLE FETCHED AND CSV CREATED")


def main():
    print('Connecting to the PostgreSQL database...')
    connection = psycopg2.connect(host=database_config.DATABASE_CONFIG['host'],
                                  database=database_config.DATABASE_CONFIG['dbname'],
                                  user=database_config.DATABASE_CONFIG['user'],
                                  port=database_config.DATABASE_CONFIG['port'],
                                  password=database_config.DATABASE_CONFIG['password'])
    cursor = connection.cursor()

    # createTable(cursor, get_geo_names, ['county_geo', 'geoid', 'name'], "geo_names.csv")
    createTable(cursor, get_plans, ['plan', 'county'], "plans.csv")
    connection.commit()

    cursor.close()
    connection.close()


# END main

if __name__ == "__main__":
    main()
