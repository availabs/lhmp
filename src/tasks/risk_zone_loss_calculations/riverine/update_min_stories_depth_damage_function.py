import psycopg2
import database_config
import pandas
import csv
import numpy as np
import json
def createTable(cursor):
    print ('UPDATING TABLE')
    sql_2 = '''
    UPDATE irvs.depth_damage_function
       SET min_stories=
    	CASE stories
    		WHEN '5Plus Stories' THEN 5
    		WHEN 'High Rise' THEN 5
    		WHEN 'Mid Rise' THEN 3
    		WHEN '2 Story' THEN 2
    		WHEN '3to4 Stories' THEN 3
    		WHEN 'Low Rise' THEN 1
    		WHEN '1to2 Stories' THEN 1
    		WHEN '3 Story' THEN 3
    		WHEN '1 Story' THEN 1
    		WHEN 'Split Level' THEN null
    		ELSE 0
    	END
    '''
    cursor.execute(sql_2)
    print ('TABLE UPDATED')

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

'''

'''