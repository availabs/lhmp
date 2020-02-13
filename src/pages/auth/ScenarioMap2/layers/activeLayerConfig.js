import {ScenarioLayer, ScenarioOptions} from "./scenarioLayer.js"
import {ZoneLayer,ZoneOptions} from "./zoneLayer";
import {ProjectLayer,ProjectOptions} from "./projectLayer";


export default{
    activeLayers : [
        {
            scenario : new ScenarioLayer('scenario',ScenarioOptions())
        },
        {
            zone: new ZoneLayer('zone',ZoneOptions())
        },
        {
            projects: new ProjectLayer('projects',ProjectOptions())
        }
        ]

}



