import pandas
import simplejson
import json
import math

building_risk_data = pandas.read_csv('/home/nayanika/IdeaProjects/mitigate-api/tasks/risk_zone_loss_calculations/dfirm/building_risk_data.csv')

for row in building_risk_data.index:
    building_risk_data.at[row,'hazard_loss_dollars'] = building_risk_data.at[row,'replacement_value']
building_risk_data.to_csv('/home/nayanika/IdeaProjects/mitigate-api/tasks/risk_zone_loss_calculations/dfirm/output_building_risk_data.csv',index=None)