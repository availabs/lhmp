import psycopg2
from os import environ
import pandas
import os
plans_files = [
      'dfirm_NY_data/4/',
      'dfirm_NY_data/5/',
      'dfirm_NY_data/8/',
      'dfirm_NY_data/11/',
      'dfirm_NY_data/12/',
      'dfirm_NY_data/13/',
      'dfirm_NY_data/14/',
      'dfirm_NY_data/15/',
      'dfirm_NY_data/16/',
      'dfirm_NY_data/17/',
      'dfirm_NY_data/19/',
      'dfirm_NY_data/20/',
      'dfirm_NY_data/21/',
      'dfirm_NY_data/22/',
      'dfirm_NY_data/23/',
      'dfirm_NY_data/24/',
      'dfirm_NY_data/26/',
      'dfirm_NY_data/27/',
      'dfirm_NY_data/28/',
      'dfirm_NY_data/29/',
      'dfirm_NY_data/30/',
      'dfirm_NY_data/31/',
      'dfirm_NY_data/34/',
      'dfirm_NY_data/35/',
      'dfirm_NY_data/37/',
      'dfirm_NY_data/38/',
      'dfirm_NY_data/39/',
      'dfirm_NY_data/40/',
      'dfirm_NY_data/41/',
      'dfirm_NY_data/43/',
      'dfirm_NY_data/46/',
      'dfirm_NY_data/47/',
      'dfirm_NY_data/50/',
      'dfirm_NY_data/52/',
      'dfirm_NY_data/54/',
      'dfirm_NY_data/55/',
      'dfirm_NY_data/57/',
      'dfirm_NY_data/58/',
      'dfirm_NY_data/62/',
      'dfirm_NY_data/60/',
      'dfirm_NY_data/61/',
]

def fetch_county_plans(cursor):
    sql = '''
    SELECT id, county, fips
	FROM plans.county;
    '''
    cursor.execute(sql)
    results = pandas.DataFrame(cursor.fetchall())
    results.to_csv("/home/nayanika/IdeaProjects/mitigate-api/tasks/risk_zone_loss_calculations/conversions_postgresql_shp_geojson/plan_counties.csv", index=False,header= ['plan_id','county','geoid'])

def create_directories():
    base_path = 'dfirm_NY_data'

    for plan in plans_files:

        plan_id = plan.split('/')[1]

        dir_path = '{}/{}'.format(base_path,plan_id)

        for i in ['500','100']:
            file_path = '{}/{}'.format(dir_path,i)
            os.makedirs(file_path)


def convert_postgresql_shp_file_500_year():


    for plan in plans_files:

        plan_id = plan.split('/')[1]

        file = 'dfirm_NY_data/'+plan_id+'/500/'+plan_id+'_dfirm_500_100'
        table = "hazard_risk_geography."+plan_id+'_dfirm_500_100'
        cmd = "pgsql2shp" + ' -f ' + file + ' -u ' +environ.get('PGUSER') + " -h " + environ.get('PGHOST') + ' -P ' + environ.get('PGPASSWORD') + ' -p ' + environ.get('PGPORT') + ' '+environ.get('PGDATABASE') +' '+ table
        print('Doing it for 500 ...',plan_id,cmd)
        os.system(cmd)

def convert_postgresql_shp_file_100_year():


    for plan in plans_files:

        plan_id = plan.split('/')[1]

        file = 'dfirm_NY_data/'+plan_id+'/100/'+plan_id+'_dfirm_100'
        table = "hazard_risk_geography."+plan_id+'_dfirm_100'
        cmd = "pgsql2shp" + ' -f ' + file + ' -u ' +environ.get('PGUSER') + " -h " + environ.get('PGHOST') + ' -P ' + environ.get('PGPASSWORD') + ' -p ' + environ.get('PGPORT') + ' '+environ.get('PGDATABASE') +' '+ table
        print('Doing it for 100 ...',plan_id,cmd)
        os.system(cmd)

def main():
    with open('../../../config/postgres.env') as f:
        os.environ.update(
            line.replace('export ', '', 1).strip().split('=', 1) for line in f
            if 'export' in line
        )

    connection = psycopg2.connect(host=environ.get('PGHOST'),
                            database=environ.get('PGDATABASE'),
                            user=environ.get('PGUSER'),
                            port=environ.get('PGPORT'),
                            password=environ.get('PGPASSWORD'))

    cursor = connection.cursor()

    #fetch_county_plans(cursor)
    #create_directories()
    #convert_postgresql_shp_file_500_year()
    convert_postgresql_shp_file_100_year()

    connection.commit()

    cursor.close()
    connection.close()
# END main

if __name__ == "__main__":
    main()
