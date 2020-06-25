const config = {
    'Strategies Image': [{
        title: 'Strategies Image',
        requirement: `strategies-image`,
        type: 'image',
        prompt: '',
        intent: '',
        callout: '',
        label:'Image', // Which you would like to see on the form
        height: 250,
        width: 500,
        border: 1,
        icon: 'os-icon-arrow-right7',
    }],
    'Header' : [{
        title: 'Strategies Quote',
        requirement: 'strategies-quote',
        type: 'content',
        prompt: '',
        intent: '',
        callout: '',
        icon: 'os-icon-arrow-right7',
        onlyAdmin: true
    }],

    Objectives: [
        {
            title: 'Goals',
            requirement: 'Req-C-3-A',
            type: 'content',
            prompt: 'Include goals to reduce/avoid long-term vulnerabilities to the identified hazards. These goals are' +
                ' broad policy statements that explain what is to be achieved through mitigation plan implementation.',
            intent: 'To guide the development and implementation of hazard mitigation actions for the community(ies).' +
                '  Goals are statements of the community’s visions for the future.',
            icon: 'os-icon-target'
        },
        // {
        //     title: 'Goals 3A-1',
        //     requirement: 'Req-C-3-A-1',
        //     type: 'form',
        //     prompt: 'Include goals to reduce/avoid long-term vulnerabilities to the identified hazards. These goals are' +
        //         ' broad policy statements that explain what is to be achieved through mitigation plan implementation.',
        //     intent: 'To guide the development and implementation of hazard mitigation actions for the community(ies).' +
        //         '  Goals are statements of the community’s visions',
        //     icon: 'os-icon-arrow-right2'
        // },
        {
            title: 'Changes in Priorities',
            requirement: 'Req-D-3',
            type: 'content',
            prompt: ' If applicable, describe changes to goals and objectives.',
            intent: 'To ensure the plan reflects current conditions, including financial, legal, and political realities' +
                ' as well as post‐disaster conditions.',
            icon: 'os-icon-mail-19'
        },
    ],

    Capabilities : [
        {
            title: 'Overview',
            requirement: 'Req-C-1A',
            type: 'content',
            prompt: 'Document each jurisdiction’s existing authorities, policies, programs and resources and its ability' +
                ' to expand on and improve these existing policies and programs ' +
                ' a. Examples: Staff involved local planning activities, public works/emergency management, funding through' +
                ' taxing authority and annual budgets, regulatory authorities for comp. Planning building codes and ordinances',
            intent: 'To ensure that each jurisdiction evaluates its capabilities to accomplish hazard mitigation actions,' +
                ' through existing mechanisms. This is especially useful for multi‐jurisdictional plans where local' +
                ' capability varies widely.',
            icon: 'os-icon-globe'
        },
        {
            title: 'Capabilities Table',
            requirement: 'Req-C-1A-1',
            type: 'formTable',
            fontSize: '0.70em',
            height: '600px',
            align: 'full',
            config: {
                type: 'capabilities',
                //filters:[{column:'capability_category',value:'planning and regulatory'}],
                columns : [
                    {
                        Header: 'Name',
                        accessor: 'capability_name',
                        sort: true,
                        filter: 'default'
                    },
                    {
                        Header: 'category',
                        accessor: 'capability_category',
                        sort: true,
                        filter: 'multi'
                    },
                    {
                        Header: 'type',
                        accessor: 'capability_type',
                        sort: true,
                        filter: 'multi'
                    },
                    
                    {
                        Header: 'adopting authority',
                        accessor: 'adopting_authority',
                        sort: true,
                        filter: 'default'
                    },
                    {
                        Header: 'responsible authority',
                        accessor: 'responsible_authority',
                        sort: true,
                        filter: 'default'
                    },
                    {
                        Header: 'Link',
                        accessor: 'upload',
                        width: 50
                    },
                    {
                        Header: 'jurisdiction_utilization',
                        accessor: 'jurisdiction_utilization',
                        width: 50,
                        expandable: 'true'
                    },
                    
                ]
            },
            prompt: 'Document each jurisdiction’s existing authorities, policies, programs and resources and its ability' +
                ' to expand on and improve these existing policies and program ' +
                ' a. Examples: Staff involved local planning activities,' +
                ' public works/emergency management, funding through taxing authority and annual budgets, regulatory authorities' +
                ' for comp. Planning building codes and ordinances',
            intent: 'To ensure that each jurisdiction evaluates its capabilities to accomplish hazard mitigation actions,' +
                ' through existing mechanisms. This is especially useful for multi‐jurisdictional plans where local' +
                ' capability varies widely.',
            icon: 'os-icon-tasks-checked'
        },
        {
            title: 'Evaluation',
            requirement: 'Req-C-1B',
            type: 'capabilityEvaluationTable',
            prompt: '',
            intent: '',
            icon: 'os-icon-pie-chart-3'
        },
        
        {
            title: 'Environmental and Historic Preservation',
            requirement: 'Req-B-4A',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-home'
        },
    ],
     'Response' : [
        {
            title: 'Temporary Housing',
            requirement: 'Req-NYS-F-3A',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-email-forward'
        },
        {
            title: 'Relocation Zones',
            requirement: 'Req-NYS-F-3B',
            type: 'content',
            prompt: 'Tell us about your relocation zones...',
            intent: '',
            icon: 'os-icon-documents-07',
            
        },
        {
            title: '',
            requirement: 'Req-NYS-F-3B-1',
            type: 'developementZonesFilteredMap',
            filterBy: {zone_type: ['Relocation Zone']},
            prompt: '',
            intent: '',
            icon: 'os-icon-documents-07',
            hideNav: true
        },
        {
            title: 'Evacuation Routes',
            requirement: 'Req-NYS-F-4A',
            type: 'evacuationRoutes',
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
            requirement: 'Req-NYS-F-4B-2',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-share-2'
        },
        {
            title: '',
            requirement: 'Req-NYS-F-4B',
            type: 'shelterListTable',
            align: 'full',
            prompt: '',
            intent: '',
            icon: 'os-icon-share-2',
            hideNav: true
        }
        

    ],
    Actions: [
        {
            title: 'Proposed Actions',
            requirement: 'Req-C-4',
            type: 'actionsFilteredListTable',
            filterBy: ['Proposed-New'],
            align: 'full',
            prompt: 'Action form to be designed later. The plan must include a mitigation strategy that 1) analyzes actions' +
                ' and/or projects that the jurisdiction considered to reduce the impacts of hazards identified in the risk' +
                ' assessment, and 2) identifies the actions and/or projects that the jurisdiction intends to implement.' +
                ' a. Each jurisdiction participating in the plan must have mitigation actions specific to that jurisdiction' +
                ' that are based on the community’s risk and  vulnerabilities, as well as community priorities.' +
                ' b. The plan must identify the position, office, department, or agency responsible for implementing and' +
                ' administering the action (for each jurisdiction), and identify potential funding sources and expected' +
                ' timeframes for completion. ',
            intent: 'To ensure the hazard mitigation actions are based on the identified hazard vulnerabilities, are within' +
                ' the capability of each jurisdiction, and reduce or avoid future losses.  This is the heart of the' +
                ' mitigation plan, and is essential to leading communities to reduce their risk.  Communities, not FEMA,' +
                ' “own” the hazard mitigation actions in the strategy.' +
                ' a. Mitigation actions and projects means a hazard mitigation action, activity or process (for example,' +
                '  adopting a building code) or it can be a physical project (for example, elevating structures or retrofitting' +
                ' critical  infrastructure) designed to reduce or eliminate the long term risks from hazards.' +
                ' b. Integrate elements of Req-C-5 and Req-C-6',
            icon: 'os-icon-activity'
        },
        {
            title: 'Updated Actions',
            requirement: 'Req-D-2',
            type: 'actionsFilteredListTable',
            filterBy: [ 'In-progress', 'Completed', 'Discontinued'],
            align: 'full',
            prompt: 'Describe the status of hazard mitigation actions in the previous plan by identifying those that have' +
                ' been completed or not completed. For actions that have not been completed, the plan must either describe' +
                ' whether the action is no longer relevant or be included as part of the updated action plan.',
            intent: 'To evaluate and demonstrate progress made in the past five years in achieving goals and implementing' +
                ' actions outlined in their mitigation strategy.',
            icon: 'os-icon-tasks-checked'
        },
        {
            title: 'Prioritization Criteria',
            requirement: 'Req-C-5A',
            type: 'content',
            prompt: 'Describe the criteria used for prioritizing implementation of the actions.' +
                ' a. The plan must demonstrate when prioritizing hazard mitigation actions that the local jurisdictions' +
                ' considered the benefits that would result from the hazard mitigation actions versus the cost of those' +
                ' actions.  The requirement is met as long as the economic considerations are summarized in the plan as' +
                ' part of the community’s analysis.  A complete benefit‐cost analysis is not required.  Qualitative benefits' +
                ' (for example, quality of life, natural and beneficial values, or other “benefits”) can also be included' +
                ' in how actions will be prioritized.',
            intent: 'To identify how the plan will directly lead to implementation of the hazard mitigation actions.' +
                '  As opportunities arise for actions or projects to be  implemented, the responsible entity will be able' +
                ' to take action towards completion of the activities.',
            icon: 'os-icon-edit-1'
        },
    ]
    
}

export default config