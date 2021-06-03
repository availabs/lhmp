import psycopg2
import database_config
import pandas
import csv
import numpy as np
import json
def createTable(cursor):
    print ('UPDATING TABLE')
    building_risk_data = pandas.read_csv('/home/nayanika/IdeaProjects/mitigate-api/tasks/risk_zone_loss_calculations/riverine/output_building_risk_data.csv')
    updates = []
    # should also check for risk_value
    for row in building_risk_data.index:
        updates.append({
            'building_id':building_risk_data.at[row,'building_id'],
            'risk_value':building_risk_data.at[row,'risk_value'],
            'hazard_loss_percent' : building_risk_data.at[row,'hazard_loss_percent'],
            'hazard_loss_dollars' : building_risk_data.at[row,'hazard_loss_dollars']
        })

    qStr = "UPDATE irvs.building_risk SET hazard_loss_percent = col1_new,hazard_loss_dollars = col2_new FROM (VALUES "
    qParams = []
    for r in updates:
        qStr += "(%s,%s,%s,%s),"
        qParams.extend([r["building_id"],r["risk_value"],r["hazard_loss_percent"],r["hazard_loss_dollars"]])
    qStr = qStr[:-1]
    qStr += " ) AS tmp(building_id,risk_value,col1_new, col2_new) WHERE tmp.building_id = irvs.building_risk.building_id AND tmp.risk_value=irvs.building_risk.risk_value"
    cursor.execute(qStr,qParams)
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
