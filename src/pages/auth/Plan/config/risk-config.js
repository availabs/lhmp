const config = {
    'Vulnerability' : [
        {
            title: 'Narrative',
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
            icon: 'os-icon-alert-triangle'
        },
        {
            title: 'Inventory',
            requirement: 'Req-B-3B-1B',
            type: 'table',
            intent: 'Overview of loss by asset type by scenario',
            icon: 'os-icon-alert-circle'
        },
        
        {
            title: 'Critical Facilities',
            requirement: 'Req-NYS-F-2',
            type: 'table',
            prompt: '',
            intent: '',
            icon: 'os-icon-loader'
        }
    ],
    'Response' : [
        {
            title: 'Temporary Housing',
            requirement: 'Req-NYS-F-3A',
            type: '',
            prompt: '',
            intent: '',
            icon: 'os-icon-email-forward'
        },
        {
            title: 'Relocation Zones',
            requirement: 'Req-NYS-F-3B',
            type: '',
            prompt: '',
            intent: '',
            icon: 'os-icon-documents-07'
        },
        {
            title: 'Evacuation',
            requirement: 'Req-NYS-F-4A',
            type: '',
            prompt: '',
            intent: '',
            icon: 'os-icon-alert-octagon'
        },
        {
            title: 'Evacuation Procedues',
            requirement: 'Req-NYS-F-4A-1',
            type: 'content',
            prompt: 'Provide an overall summary of each jurisdiction’s vulnerability to the identified hazards.',
            intent: '',
            icon: 'os-icon-alert-triangle'
        },
        {
            title: 'Shelters',
            requirement: 'Req-NYS-F-4B',
            type: '',
            prompt: '',
            intent: '',
            icon: 'os-icon-share-2'
        }
    ],
    'Changes in Development' : [
        {
            title: 'Overview',
            requirement: 'Req-D-1A',
            type: 'content',
            prompt: 'The plan must describe changes in development that have occurred in hazard prone areas and increased' +
                ' or decreased the vulnerability of each jurisdiction since the last plan was approved.  If no changes in' +
                ' development impacted the jurisdiction’s overall vulnerability, plan updates may validate the information' +
                ' in the previously approved plan. Was the plan revised to reflect changes in development?',
            intent: 'To ensure that the mitigation strategy continues to address the risk and vulnerabilities to existing' +
                ' and potential development, and takes into consideration possible future conditions that can impact the' +
                ' vulnerability of the community.',
            icon: 'os-icon-repeat'
        },
        {
            title: 'Development Zones',
            requirement: 'Req-D-1B',
            type: 'form',
            prompt: '',
            intent: '',
            icon: 'os-icon-grid-squares-2'
        },
        {
            title: 'Development Map',
            requirement: 'Req-D-1C',
            type: 'map?',
            prompt: '',
            intent: '',
            icon: 'os-icon-globe'
        },
        {
            title: 'Open Space ',
            requirement: 'Req-D-1C',
            type: 'map?',
            prompt: '',
            intent: '',
            icon: 'os-icon-globe'
        },
        {
            title: 'Open Space Statistics',
            requirement: 'Req-D-1C',
            type: 'map?',
            prompt: '',
            intent: '',
            icon: 'os-icon-globe'
        }
    ]
}

export default config