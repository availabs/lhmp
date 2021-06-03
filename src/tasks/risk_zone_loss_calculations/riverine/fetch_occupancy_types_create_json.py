import psycopg2
import database_config
import pandas
import csv
import numpy as np
import json
def createTable(cursor):
    sql_2 = '''
    SELECT hazard,occupancy,basement,
               stories,type, "_4 ft", "_3 ft",
               "_2 ft", "_1 ft", "0 ft", "1 ft", "2 ft", "3 ft", "4 ft", "5 ft",
               "6 ft", "7 ft", "8 ft", "9 ft", "10 ft", "11 ft", "12 ft", "13 ft",
               "14 ft", "15 ft", "16 ft", "17 ft", "18 ft", "19 ft", "20 ft",
               "21 ft", "22 ft", "23 ft", "24 ft"
          FROM irvs.depth_damage_function
          where hazard = 'riverine'
          and occupancy IN ('GOV1','RES4','IND4','EDU2','COM1','IND1','RES1','RES3C',
                         'COM9','RES3F','COM5','IND5','COM7','RES2','EDU1','COM4','COM8','AGR1','RES3A','RES3D',
                         'COM3','RES3B','RES6','REL1','RES5','COM6','COM10','GOV2','IND2','IND3','IND6','COM2','RES3E')
          and basement = '1' and min_stories <= 1 and type = 'structure'
    '''
    cursor.execute(sql_2)
    columns = ["hazard","occupancy","basement",
                          "stories","type", "_4 ft", "_3 ft",
                          "_2 ft", "_1 ft", "0 ft", "1 ft", "2 ft", "3 ft", "4 ft", "5 ft",
                          "6 ft", "7 ft", "8 ft", "9 ft", "10 ft", "11 ft", "12 ft", "13 ft",
                          "14 ft", "15 ft", "16 ft", "17 ft", "18 ft", "19 ft", "20 ft",
                          "21 ft", "22 ft", "23 ft", "24 ft"]
    data = pandas.DataFrame(np.array(cursor.fetchall()))
    data.columns = columns
    data_dict = {}
    dict = {}
    for item in list(data['occupancy']):
        data_dict.setdefault(item,{})
    for row in data.index:
        data_dict[data.at[row,'occupancy']].update({
            'hazard' : data.at[row,'hazard'],
            'type':data.at[row,'type'],
            'stories':data.at[row,'stories'],
            '_1 ft':data.at[row,'_1 ft'],
            '_2 ft':data.at[row,'_2 ft'],
            '_3 ft':data.at[row,'_3 ft'],
            '_4 ft':data.at[row,'_4 ft'],
            '0 ft':data.at[row,'0 ft'],
            '1 ft':data.at[row,'1 ft'],
            '2 ft':data.at[row,'2 ft'],
            '3 ft':data.at[row,'3 ft'],
            '4 ft':data.at[row,'4 ft'],
            '5 ft':data.at[row,'5 ft'],
            '6 ft':data.at[row,'6 ft'],
            '7 ft':data.at[row,'7 ft'],
            '8 ft':data.at[row,'8 ft'],
            '9 ft':data.at[row,'9 ft'],
            '10 ft':data.at[row,'10 ft'],
            '11 ft':data.at[row,'11 ft'],
            '12 ft':data.at[row,'12 ft'],
            '13 ft':data.at[row,'13 ft'],
            '14 ft':data.at[row,'14 ft'],
            '15 ft':data.at[row,'15 ft'],
            '16 ft':data.at[row,'16 ft'],
            '17 ft':data.at[row,'17 ft'],
            '18 ft':data.at[row,'18 ft'],
            '19 ft':data.at[row,'19 ft'],
            '20 ft':data.at[row,'20 ft'],
            '21 ft':data.at[row,'21 ft'],
            '22 ft':data.at[row,'22 ft'],
            '23 ft':data.at[row,'23 ft'],
            '24 ft':data.at[row,'24 ft']
        })
    with open("/home/nayanika/IdeaProjects/mitigate-api/tasks/risk_zone_loss_calculations/riverine/depth_damage_function.json","w") as f:
        json.dump(data_dict,f)
    print('JSON CREATED')
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