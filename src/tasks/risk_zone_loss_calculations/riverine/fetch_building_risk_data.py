import psycopg2
import database_config
import pandas
import csv
import numpy as np
import sys

def createTable(cursor):
    print "FETCHING DATA..."
    risk_zone_id = sys.argv[1]
    sql = '''
		SELECT a.building_id,risk_value,b.building_type,b.replacement_value,
        hazard_loss_percent,hazard_loss_dollars
        FROM irvs.building_risk as a
        JOIN irvs.enhanced_building_risk as b on b.building_id = a.building_id
        WHERE a.risk_zone_id = ''' + risk_zone_id + '''
        '''
    cursor.execute(sql)
    connection = psycopg2.connect(host=database_config.DATABASE_CONFIG['host'], database=database_config.DATABASE_CONFIG['dbname'], user=database_config.DATABASE_CONFIG['user'], password=database_config.DATABASE_CONFIG['password'])
    #results = pandas.read_sql_query(sql, connection)
    results = pandas.DataFrame(np.array(cursor.fetchall()))
    results.to_csv("/home/nayanika/IdeaProjects/mitigate-api/tasks/risk_zone_loss_calculations/riverine/building_risk_data.csv", index=False,header= ['building_id','risk_value','building_type','replacement_value','hazard_loss_percent','hazard_loss_dollars'])
    print "TABLE FETCHED AND CSV CREATED"

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

