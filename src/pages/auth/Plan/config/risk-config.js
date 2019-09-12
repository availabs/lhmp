const config = {
    'Elevated Risk Profiles' : [
        {
            title: 'Elevated Risk Profiles',
            requirement: 'Req-B-1D',
            type: 'unknown',
            prompt: 'Identify which hazard risks are most significant and which jurisdictions or locations are most' +
                ' adversely affected.',
            intent: 'For participating jurisdictions in a multi‐jurisdictional plan, the plan must describe any hazards' +
                ' that are unique and/or varied from those affecting the overall planning area to understand the hazards' +
                ' affecting the planning area in order to identify which hazard risks are most significant/which' +
                ' jurisdictions or locations are most adversely affected.'
        },
        {
            title: 'Hazard Impact Narrative (based on Hazard Risk Data/Visualizations)',
            requirement: 'Req-B-3A',
            type: 'content',
            prompt: 'Narrative to Contextualize Hazard Data (related to visualizations in previous sub-element)',
            intent: 'For each participating jurisdiction, the plan must describe the potential impacts of each of the' +
                ' identified hazards on the community. Impact means the consequence or effect of the hazard on the' +
                ' community and its assets.  Assets are determined by the community and include, for example, people,' +
                ' structures, facilities, systems, capabilities, and/or activities that have value to the community.' +
                ' For example, impacts could be described by referencing historical disaster impacts and/or an estimate' +
                ' of potential future losses (such as percent damage of total exposure).'
        },
        {
            title: 'Jurisdictional Vulnerability Narrative (based on Hazard Risk and Capabilities Data/Visualizations)',
            requirement: 'Req-B-3B-1',
            type: 'content',
            prompt: 'Provide an overall summary of each jurisdiction’s vulnerability to the identified hazards.',
            intent: 'The plan must provide an overall summary of each jurisdiction’s vulnerability to the identified' +
                ' hazards. The overall summary of vulnerability identifies structures, systems, populations or other' +
                ' community assets as defined by the community that are susceptible to damage and loss from hazard events.' +
                ' a. *Vulnerable assets and potential losses is more than a list of the total exposure of population,' +
                ' structures, and critical facilities in the planning area. An example of an overall summary is a list' +
                ' of key issues or problem statements that clearly describes the community’s greatest vulnerabilities' +
                ' and that will be addressed in the mitigation strategy.'
        },
        {
            title: 'Jurisdictional Vulnerability Inventory',
            requirement: 'Req-B-3B-2',
            type: 'table',
            prompt: 'structures, systems, populations, or other community assets that are susceptible to damage or hazard events.',
            intent: 'The plan must provide an overall summary of each jurisdiction’s vulnerability to the identified hazards.' +
                ' The overall summary of vulnerability identifies structures, systems, populations or other community assets' +
                ' as defined by the community that are susceptible to damage and loss from hazard events. ' +
                'a. *Vulnerable assets and potential losses is more than a list of the total exposure of population, ' +
                'structures, and critical facilities in the planning area. An example of an overall summary is a list of' +
                ' key issues or problem statements that clearly describes the community’s greatest vulnerabilities and that' +
                ' will be addressed in the mitigation strategy.'
        }
        ],
    Assets: [
        {
            title: 'Critical Facilities 500 year flood event',
            requirement: 'Req-NYS-F-2',
            type: 'table',
            prompt: '',
            intent: ''
        },
        {
            title: 'Potential Sites for Temporary Housing Units',
            requirement: 'Req-NYS-F-3A',
            type: '',
            prompt: '',
            intent: ''
        },
        {
            title: 'Potential Relocation Zones',
            requirement: 'Req-NYS-F-3B',
            type: '',
            prompt: '',
            intent: ''
        },
        {
            title: 'Evacuation Routes and Procedures',
            requirement: 'Req-NYS-F-4A',
            type: '',
            prompt: '',
            intent: ''
        },
        {
            title: 'Shelters for evacuated citizens with a range of medical needs, plan for pets, and compliance with ADA',
            requirement: 'Req-NYS-F-4B',
            type: '',
            prompt: '',
            intent: ''
        }
    ],
    'Changes in Development' : [
        {
            title: 'Changes in Development A',
            requirement: 'Req-D-1A',
            type: 'content',
            prompt: 'The plan must describe changes in development that have occurred in hazard prone areas and increased' +
                ' or decreased the vulnerability of each jurisdiction since the last plan was approved.  If no changes in' +
                ' development impacted the jurisdiction’s overall vulnerability, plan updates may validate the information' +
                ' in the previously approved plan. Was the plan revised to reflect changes in development?',
            intent: 'To ensure that the mitigation strategy continues to address the risk and vulnerabilities to existing' +
                ' and potential development, and takes into consideration possible future conditions that can impact the' +
                ' vulnerability of the community.'
        },
        {
            title: 'Changes in Development B',
            requirement: 'Req-D-1B',
            type: 'form',
            prompt: '',
            intent: ''
        },
        {
            title: 'Changes in Development C',
            requirement: 'Req-D-1C',
            type: 'map?',
            prompt: '',
            intent: ''
        }
    ]
}

export default config