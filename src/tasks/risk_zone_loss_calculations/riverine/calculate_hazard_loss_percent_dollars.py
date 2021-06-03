import pandas
import simplejson
import json
import math

building_risk_data = pandas.read_csv('/home/nayanika/IdeaProjects/mitigate-api/tasks/risk_zone_loss_calculations/riverine/building_risk_data.csv')

with open('/home/nayanika/IdeaProjects/mitigate-api/tasks/risk_zone_loss_calculations/riverine/depth_damage_function.json') as f:
    depth_damage_function_json = json.load(f)
    for row in building_risk_data.index:
        if str(building_risk_data.at[row,'building_type']) == 'nan':
            if building_risk_data.at[row,'risk_value'] > 24:
                building_risk_data.at[row,'hazard_loss_percent'] = depth_damage_function_json["RES1"]["24 ft"]
            else:
                if math.isnan(building_risk_data.at[row,'risk_value']) :
                    building_risk_data.at[row,'hazard_loss_percent'] = depth_damage_function_json["RES1"]["0" +" "+"ft"]
                else:
                    building_risk_data.at[row,'hazard_loss_percent'] = depth_damage_function_json["RES1"][str(int(building_risk_data.at[row,'risk_value'])) +" "+"ft"]
        else:
            if building_risk_data.at[row,'risk_value'] > 24:
                building_risk_data.at[row,'hazard_loss_percent'] = depth_damage_function_json[building_risk_data.at[row,'building_type']]["24 ft"]
            else:
                if math.isnan(building_risk_data.at[row,'risk_value']):
                    building_risk_data.at[row,'hazard_loss_percent'] = depth_damage_function_json[building_risk_data.at[row,'building_type']]["0" +" "+"ft"]
                else:
                    building_risk_data.at[row,'hazard_loss_percent'] = depth_damage_function_json[building_risk_data.at[row,'building_type']][str(int(building_risk_data.at[row,'risk_value'])) +" "+"ft"]

for row in building_risk_data.index:
    building_risk_data.at[row,'hazard_loss_dollars'] = building_risk_data.at[row,'replacement_value'] * (float(building_risk_data.at[row,'hazard_loss_percent'])/100)
building_risk_data.to_csv('/home/nayanika/IdeaProjects/mitigate-api/tasks/risk_zone_loss_calculations/riverine/output_building_risk_data.csv',index=None)