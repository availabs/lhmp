import psycopg2
import database_config
import pandas
import csv
import numpy as np
import sys
def createTable(cursor):
    table = "hazard_risk_geography" +"."+ '"'+str(sys.argv[1])+'"'
    print("FETCHING DATA...")
    sql_1 = '''
    DO $$
       BEGIN
           BEGIN
               ALTER TABLE ''' + table + ''' ADD COLUMN depth_feet integer;
           EXCEPTION
               WHEN duplicate_column THEN RAISE NOTICE 'column <column_name> already exists in <table_name>.';
           END;
       END;
    $$
    '''
    print ("UPDATED TABLE FOR DEPTH_FEET")
    cursor.execute(sql_1)
    sql_2 = '''
	UPDATE ''' + table + ''' SET
        depth_feet = round(depth_m * 3.2808)
	'''
    cursor.execute(sql_2)
    print("ADDED DEPTH FEET AND TABLE UPDATED")
    geoid = str(sys.argv[2])
    sql = '''
		SELECT DISTINCT a.id,max(depth_feet) as depth_feet
        FROM ''' + table + ''' as b
        join irvs.buildings_2018 as a on st_intersects(a.footprint, b.geom)
        WHERE substring(a.geoid,1,5) = ''' + "'"+geoid + "'"+ '''
        GROUP BY a.id
        '''
    print(sql)
    cursor.execute(sql,(geoid,))
    connection = psycopg2.connect(host=database_config.DATABASE_CONFIG['host'], database=database_config.DATABASE_CONFIG['dbname'], user=database_config.DATABASE_CONFIG['user'], password=database_config.DATABASE_CONFIG['password'])
    results = pandas.DataFrame(cursor.fetchall())
    results.to_csv("/home/nayanika/IdeaProjects/mitigate-api/tasks/risk_zone_loss_calculations/riverine/building_id_depth_feet.csv", index=False,header= ['building_id','risk_value'])
    print("TABLE FETCHED AND CSV CREATED")

def main():
    print('Connecting to the PostgreSQL database...')
    connection = psycopg2.connect(host=database_config.DATABASE_CONFIG['host'], database=database_config.DATABASE_CONFIG['dbname'], user=database_config.DATABASE_CONFIG['user'], password=database_config.DATABASE_CONFIG['password'])
    cursor = connection.cursor()

    createTable(cursor)
    connection.commit()

    cursor.close()
    connection.close()
# END main

if __name__ == "__main__":
    main()


