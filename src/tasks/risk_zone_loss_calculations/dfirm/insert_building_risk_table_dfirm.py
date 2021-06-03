import psycopg2
import database_config
import pandas
import csv
import sys
import numpy as np
from psycopg2 import sql
def createTable(cursor):

    print("INSERTING  DATA...")
    inserts = []
    table_name = "'"+str(sys.argv[1])+"'"
    geoid = "'" + str(sys.argv[2]) +"'"
    with open('/home/nayanika/IdeaProjects/mitigate-api/tasks/risk_zone_loss_calculations/dfirm/building_id_depth_feet.csv', 'r') as f:
        for line in f.readlines()[1:]:
            line =  line.split(',')
            #print(line)
            inserts.append({
                'building_id':int(line[0]),
                'risk_value':line[1].strip('\n')
            })
    sql_1 = '''
    SELECT risk_zone_id FROM hazard_risk_geography.risk_zones WHERE table_name = ''' + table_name
    '''SELECT DISTINCT a.id as buildings_2018_id,c.building_id as ebr_id,max(depth_m) as depth
        FROM ''' +"hazard_risk_geography." +table_name + ''' as b
        join irvs.buildings_2018 as a on st_intersects(a.footprint, b.geom)
		join irvs.enhanced_building_risk as c on a.id = c.building_id
        WHERE substring(a.geoid,1,5) = ''' + geoid + '''
        GROUP BY a.id,c.building_id
    '''
    cursor.execute(sql_1)
    risk_zone_id = np.array(cursor.fetchall())
    for insert in inserts:
        print(insert.values())
        list = insert.values()
        list.append(risk_zone_id[0][0])
        g = tuple(list)
        postgres_insert_query = """ INSERT INTO irvs.building_risk(
                building_id,risk_value,risk_zone_id)
                VALUES (%s,%s,%s)
                """
        record_to_insert = g
        cursor.execute(postgres_insert_query, record_to_insert)
    cursor.close()
    print ("TABLE INSERTED")
def main():
    print('Connecting to the PostgreSQL database...')
    connection = psycopg2.connect(
    host=database_config.DATABASE_CONFIG['host'],
    database=database_config.DATABASE_CONFIG['dbname'],
    user=database_config.DATABASE_CONFIG['user'],
    port=database_config.DATABASE_CONFIG['port'],
    password=database_config.DATABASE_CONFIG['password'])
    cursor = connection.cursor()

    createTable(cursor)
    connection.commit()
    cursor.close()
    connection.close()
# END main

if __name__ == "__main__":
    main()
