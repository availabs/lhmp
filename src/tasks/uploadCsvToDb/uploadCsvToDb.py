import pandas as pd
import psycopg2
from datetime import datetime

import database_config


def replace(val, geo_name_dict):
    if isinstance(val, str):
        if '/' in str(val):
            val = val.split('/')
        else:
            val = [val]
        return [geo_name_dict[name] if name in geo_name_dict else name for name in val]
    else:
        return val


def format_date(date):
    if isinstance(date, str) and date is not '':
        if len(date.split('/')[-1]) is 2:
            return datetime.strptime(date, '%m/%d/%y').strftime('%Y-%m-%d')
        elif len(date.split('/')[-1]) is 4:
            return datetime.strptime(date, '%m/%d/%Y').strftime('%Y-%m-%d')
    else:
        return date


def set_plan(county, plan):
    print county
    condition = ''
    try:
        condition = not pd.isna(county)
    except:
        condition = len(county) > 1
    print county, condition

    if condition:
        r = [plan.loc[plan['county'] == x, 'plan'].iloc[0] for x in county]
        r = ','.join(map(str, r))
        print r
        return r
    else:
        county


def insertData(cursor):
    boolean_cols = ['is_tribal', 'is_csc', 'crs_member', 'nfip_standing']
    geo_cols = ['county', 'community_name']
    data = pd.read_csv('LHMP databases - CID_Municipal.csv')
    geo = pd.read_csv('geo_names.csv')
    plan = pd.read_csv('plans.csv')
    geo_name_dict = geo.set_index('name').to_dict()

    data.drop(0, inplace=True)
    for s in list(data.columns):
        if 'date' in s:  # cleaning date
            data[s].replace(to_replace='\([a-zA-Z]*\)', value='', regex=True, inplace=True)
            data[s] = data[s].apply(lambda x: format_date(x))
        if s in boolean_cols:  # cleaning bool
            data[s].replace(to_replace='\([a-zA-Z ]*\)', value='', regex=True, inplace=True)
            data[s].replace(to_replace='^Yes$', value='yes', regex=True, inplace=True)
            data[s].replace(to_replace='^No$', value='no', regex=True, inplace=True)
        if s in geo_cols:  # name -> geoid
            data[s] = data[s].apply(lambda x: replace(x, geo_name_dict['geoid']))
        # data[s] = data[s].apply(lambda x: "\"" + x + \")

    data['plan'] = data['county'].apply(lambda x: set_plan(x, plan))
    data = data.drop('plan', axis=1) \
        .join(data['plan']
              .str
              .split(',', expand=True)
              .stack()
              .reset_index(level=1, drop=True).rename('plan')) \
        .reset_index(drop=True)
    data['plan'].astype(float)
    data.replace({r'\\r': ''}, regex=True, inplace=True)
    data.replace({r'\\n': ''}, regex=True, inplace=True)

    # print data.head()
    # data.to_csv('cleaned_data.csv', index=False, sep='|', header=False)
    with open('cleaned_data.csv', 'r') as f:
        cursor.copy_from(f, 'lodes_data.municipality_data', sep='|')
    # print('Data Inserted')


def main():
    print('Connecting to the PostgreSQL database...')
    connection = psycopg2.connect(host=database_config.DATABASE_CONFIG['host'],
                                  database=database_config.DATABASE_CONFIG['dbname'],
                                  user=database_config.DATABASE_CONFIG['user'],
                                  password=database_config.DATABASE_CONFIG['password'])
    cursor = connection.cursor()

    insertData(cursor)
    connection.commit()

    cursor.close()
    connection.close()


# END main

if __name__ == "__main__":
    main()
