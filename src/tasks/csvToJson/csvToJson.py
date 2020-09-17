import pandas as pd


def print_csv():
    data = pd.read_csv('critical_facility_meta.csv')
    data.Code.astype('int32')
    print data.set_index('Code').to_dict()

if __name__ == '__main__':
    print_csv()
