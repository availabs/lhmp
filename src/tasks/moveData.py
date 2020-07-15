import numpy as np
import pandas
import psycopg2

import uploadCsvToDb.database_config as database_config


def move_data(args):
    return '''
        INSERT INTO forms.forms_data(type,plan_id, attributes)
    
        select type, {}, attributes from forms.forms_data
                    where type in {}
                    and plan_id = {}'''.format(args['to_plan'], tuple(args['forms']), args['from_plan'])


def createTable(cursor, sql):
    print("MOVING DATA...")
    print sql
    cursor.execute(sql)


def main(args):
    print('Connecting to the PostgreSQL database...')
    connection = psycopg2.connect(host=database_config.DATABASE_CONFIG['host'],
                                  database=database_config.DATABASE_CONFIG['dbname'],
                                  user=database_config.DATABASE_CONFIG['user'],
                                  port=database_config.DATABASE_CONFIG['port'],
                                  password=database_config.DATABASE_CONFIG['password'])
    cursor = connection.cursor()

    createTable(cursor, move_data(args))
    connection.commit()

    cursor.close()
    connection.close()


# END main

if __name__ == "__main__":
    main({'from_plan': 32, 'to_plan': 65, 'forms': ['capabilities', 'actions', 'zones']})
