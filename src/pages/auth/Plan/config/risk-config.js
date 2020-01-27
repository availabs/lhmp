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
                ' jurisdictions or locations are most adversely affected.',
            icon: 'os-icon-arrow-right2'
        },
        {
            title: 'Hazard Impact',
            requirement: 'Req-B-3A',
            type: 'content',
            prompt: 'Narrative to Contextualize Hazard Data (related to visualizations in previous sub-element)',
            intent: 'For each participating jurisdiction, the plan must describe the potential impacts of each of the' +
                ' identified hazards on the community. Impact means the consequence or effect of the hazard on the' +
                ' community and its assets.  Assets are determined by the community and include, for example, people,' +
                ' structures, facilities, systems, capabilities, and/or activities that have value to the community.' +
                ' For example, impacts could be described by referencing historical disaster impacts and/or an estimate' +
                ' of potential future losses (such as percent damage of total exposure).',
            icon: 'os-icon-arrow-right2'
        },
        {
            title: 'Jurisdictional Vulnerability',
            requirement: 'Req-B-3B-1',
            type: 'content',
            prompt: 'Provide an overall summary of each jurisdiction’s vulnerability to the identified hazards.',
            intent: 'The plan must provide an overall summary of each jurisdiction’s vulnerability to the identified' +
                ' hazards. The overall summary of vulnerability identifies structures, systems, populations or other' +
                ' community assets as defined by the community that are susceptible to damage and loss from hazard events.' +
                ' a. *Vulnerable assets and potential losses is more than a list of the total exposure of population,' +
                ' structures, and critical facilities in the planning area. An example of an overall summary is a list' +
                ' of key issues or problem statements that clearly describes the community’s greatest vulnerabilities' +
                ' and that will be addressed in the mitigation strategy.',
            icon: 'os-icon-arrow-right2'
        },
        {
            title: 'Vulnerability Inventory',
            requirement: 'Req-B-3B-2',
            type: 'table',
            prompt: 'structures, systems, populations, or other community assets that are susceptible to damage or hazard events.',
            intent: 'The plan must provide an overall summary of each jurisdiction’s vulnerability to the identified hazards.' +
                ' The overall summary of vulnerability identifies structures, systems, populations or other community assets' +
                ' as defined by the community that are susceptible to damage and loss from hazard events. ' +
                'a. *Vulnerable assets and potential losses is more than a list of the total exposure of population, ' +
                'structures, and critical facilities in the planning area. An example of an overall summary is a list of' +
                ' key issues or problem statements that clearly describes the community’s greatest vulnerabilities and that' +
                ' will be addressed in the mitigation strategy.',
            icon: 'os-icon-arrow-right2'
        }
        ],
    Assets: [
        {
            title: 'Critical Facilities',
            requirement: 'Req-NYS-F-2',
            type: 'table',
            prompt: '',
            intent: '',
            icon: 'os-icon-arrow-right2'
        },
        {
            title: 'Temporary Housing Units',
            requirement: 'Req-NYS-F-3A',
            type: '',
            prompt: '',
            intent: '',
            icon: 'os-icon-arrow-right2'
        },
        {
            title: 'Relocation Zones',
            requirement: 'Req-NYS-F-3B',
            type: '',
            prompt: '',
            intent: '',
            icon: 'os-icon-arrow-right2'
        },
        {
            title: 'Evacuation',
            requirement: 'Req-NYS-F-4A',
            type: '',
            prompt: '',
            intent: '',
            icon: 'os-icon-arrow-right2'
        },
        {
            title: 'Shelters',
            requirement: 'Req-NYS-F-4B',
            type: '',
            prompt: '',
            intent: '',
            icon: 'os-icon-arrow-right2'
        }
    ],
    'Changes in Development' : [
        {
            title: 'Changes in Development',
            requirement: 'Req-D-1A',
            type: 'content',
            prompt: 'The plan must describe changes in development that have occurred in hazard prone areas and increased' +
                ' or decreased the vulnerability of each jurisdiction since the last plan was approved.  If no changes in' +
                ' development impacted the jurisdiction’s overall vulnerability, plan updates may validate the information' +
                ' in the previously approved plan. Was the plan revised to reflect changes in development?',
            intent: 'To ensure that the mitigation strategy continues to address the risk and vulnerabilities to existing' +
                ' and potential development, and takes into consideration possible future conditions that can impact the' +
                ' vulnerability of the community.',
            icon: 'os-icon-arrow-right2'
        },
        {
            title: 'Changes in Development Table',
            requirement: 'Req-D-1B',
            type: 'form',
            prompt: '',
            intent: '',
            icon: 'os-icon-arrow-right2'
        },
        {
            title: 'Changes in Development C',
            requirement: 'Req-D-1C',
            type: 'map?',
            prompt: '',
            intent: '',
            icon: 'os-icon-arrow-right2'
        }
    ]
}

export default config