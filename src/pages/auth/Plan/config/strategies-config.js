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
        onlyAdmin: true,
        pullCounty: true
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
    Purpose: [
        {
            title: 'About Strategies',
            requirement: 'R-S-4A',
            type: 'content',
            prompt: 'Provide an overview of the Strategy Development Process.  Briefly describe the process by which your community used existing resources and risk assessments to identify problem statements.' +
                    'Then, describe how your community developed strategies to solve for those problems and how they were documented. Who was involved? Did you conduct site visits? Did you attend a Mitigation Strategy Workshop? Etc.',
            intent: 'To ensure the hazard mitigation actions are based on the identified hazard vulnerabilities, are within the capability of each jurisdiction, and reduce or avoid future losses.' +  
                    'This is the heart of the mitigation plan, and is essential to leading communities to reduce their risk.  Communities, not FEMA, “own” the hazard mitigation actions in the strategy.' +
                    'Each jurisdiction participating in the plan must have mitigation actions specific to that jurisdiction that are based on the community’s risk and  vulnerabilities, as well as community priorities.',
            icon: 'os-icon-globe',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true
            // showOnlyOnCounty: true
         },
         {
            title: 'Local Orientation',
            requirement: 'R-C-3',
            type: 'content',
            prompt: 'Provide an overview of the Strategy Development Process.  Briefly describe the process by which your community used existing resources and risk assessments to identify problem statements.' +
                    'Then, describe how your community developed strategies to solve for those problems and how they were documented. Who was involved? Did you conduct site visits? Did you attend a Mitigation Strategy Workshop? Etc.',
            intent: 'To ensure the hazard mitigation actions are based on the identified hazard vulnerabilities, are within the capability of each jurisdiction, and reduce or avoid future losses.' +  
                    'This is the heart of the mitigation plan, and is essential to leading communities to reduce their risk.  Communities, not FEMA, “own” the hazard mitigation actions in the strategy.' +
                    'Each jurisdiction participating in the plan must have mitigation actions specific to that jurisdiction that are based on the community’s risk and  vulnerabilities, as well as community priorities.',
            icon: 'os-icon-globe',
            // hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            /*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true
         },
    ],
    Objectives: [
        
         {   
            title: 'Goals & Objectives',
            requirement: 'Req-C-3-A',
            type: 'content',
            prompt: 'Include goals to reduce/avoid long-term vulnerabilities to the identified hazards. These goals are' +
                ' broad policy statements that explain what is to be achieved through mitigation plan implementation.',
            intent: 'To guide the development and implementation of hazard mitigation actions for the community(ies).' +
                '  Goals are statements of the community’s visions for the future.',
            icon: 'os-icon-target',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            // /*2-non-delete*/ hideIfNull: true
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
            icon: 'os-icon-mail-19',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete hideIfNull: true 
        },
    ],

    Capabilities : [
        {
            title: 'Overview',
            requirement: 'Req-C-6A',
            type: 'content',
            prompt: 'Document each jurisdiction’s existing authorities, policies, programs and resources and its ability' +
                ' to expand on and improve these existing policies and programs ' +
                ' a. Examples: Staff involved local planning activities, public works/emergency management, funding through' +
                ' taxing authority and annual budgets, regulatory authorities for comp. Planning building codes and ordinances',
            intent: 'To ensure that each jurisdiction evaluates its capabilities to accomplish hazard mitigation actions,' +
                ' through existing mechanisms. This is especially useful for multi‐jurisdictional plans where local' +
                ' capability varies widely.',
            icon: 'os-icon-globe',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        {
            title: 'Capabilities Table',
            requirement: 'Req-C-1A',
            type: 'formTable',
            fontSize: '0.70em',
            height: '600px',
            align: 'full',
            config: {
                type: 'capabilities',
                description: 'Capabilities are the tools and resources used by a community to minimize hazard impacts. Capabilities are categorized as: Planning and Regulatory, Administrative and Technical, Education and Outreach, and Financial assets. The information displayed in the table below includes the selected jurisdiction’s hazard mitigation capabilities. When the county is selected, the table includes capabilities for all jurisdictions in the plan, otherwise the table filters to the selected jurisdiction.', 
                //filters:[{column:'capability_category',value:'planning and regulatory'}],
                columns : [
                    {
                        Header: 'Jurisdiction',
                        accessor: 'municipality',
                        sort: true,
                        filter: 'default'
                    },
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

                    /*  {
                          Header: 'adopting authority',
                          accessor: 'adopting_authority',
                          sort: true,
                          filter: 'default'
                      },*/
                    {
                        Header: 'responsible authority',
                        accessor: 'responsible_authority',
                        sort: true,
                        filter: 'default'
                    },
                    {
                        Header: 'Link',
                        accessor: 'upload',
                        width: 50,
                        expandable: 'true',
                        expandableHeader: true
                    },
                    {
                        Header: 'jurisdiction_utilization',
                        accessor: 'jurisdiction_utilization',
                        width: 50,
                        expandable: 'true',
                        expandableHeader: true
                    },
                    {
                        Header: 'capability_description',
                        accessor: 'capability_description',
                        width: 50,
                        expandable: 'true',
                        expandableHeader: true
                    },
                    {
                        Header: 'viewLink',
                        accessor: 'viewLink',
                        width: 50,
                        expandable: 'true',
                        expandableHeader: true
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
            viewLink: true,
            activeGeoFilter: 'true',
            defaultSortCol: 'adopting_authority',
            // defaultSortOrder: 'desc',
            colOrder: ['Jurisdiction','Name', 'category', 'type', 'Link', 'responsible authority', 'jurisdiction_utilization', 'capability_description', 'viewLink'],
            minHeight: '80vh',
            icon: 'os-icon-tasks-checked'
        },
        {
            title: 'Integration',
            requirement: 'Req-C-6',
            type: 'content',
            prompt: 'Describe the community’s process to integrate the data, information, and hazard mitigation goals and actions into other planning mechanisms',
            intent: '',
            icon: 'os-icon-home',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        {
            title: 'Capacity To Address Risk',
            requirement: 'Req-C-1B-1B',
            type: 'content',
            prompt: 'Document each jurisdiction’s existing authorities, policies, programs and resources and its ability to expand on and improve these existing policies and programs',
            intent: 'To ensure that each jurisdiction evaluates its capabilities to accomplish hazard mitigation actions, through existing mechanisms. This is especially useful for multi‐jurisdictional plans where local capability varies widely.',
            icon: 'os-icon-pie-chart-3',
            // hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        // {
        //     title: 'Capacity Assessment Table',
        //     requirement: 'Req-C-1B-1C',
        //     type: 'content',
        //     prompt: 'Document each jurisdiction’s existing authorities, policies, programs and resources and its ability to expand on and improve these existing policies and programs',
        //     intent: 'To ensure that each jurisdiction evaluates its capabilities to accomplish hazard mitigation actions, through existing mechanisms. This is especially useful for multi‐jurisdictional plans where local capability varies widely.',
        //     icon: 'os-icon-pie-chart-3',
        //     // hideNav: true // hides key from public nav. Displays on page.
        //     /*2-non-county*/ pullCounty: true,
        //     ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        //     ///*2-non-delete*/ hideIfNull: true 
        // },
        // {
        //     title: '',
        //     requirement: 'Req-C-1B-1',
        //     type: 'capabilityEvaluationTable',
        //     prompt: '',
        //     intent: '',
        //     activeGeoFilter: 'true',
        //     defaultSortCol: 'Capability Region',
        //     // defaultSortOrder: 'desc',
        //     //colOrder: ['Agency', 'Name', 'Role'],
        //     minHeight: '80vh',
        //     flex: 'false',
        //     icon: 'os-icon-pie-chart-3',
        //     hideNav: true // hides key from public nav. Displays on page.
        //     ///*2-non-county*/ pullCounty: true,
        //     ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        //     ///*2-non-delete*/ hideIfNull: true
        // },
        
        {
            title: 'Environmental and Historic Preservation',
            requirement: 'Req-B-3A',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-home',
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
    ],
    
        Implementation: [
        {
            title: 'Statement',
            requirement: 'Req-NYS-F-7B',
            type: 'content',
            prompt: 'Describe how the risk and vulnerabilities assessment, as well as the communities priorities, guided the mitigation strategy development, including' +
                    '1) actions and/or projects that the jurisdiction considered to reduce the impacts of hazards identified in the risk assessment, and' +
                    '2) actions and/or projects that the jurisdiction intends to implement.',
            intent: 'To ensure the hazard mitigation actions are based on the identified hazard vulnerabilities, are within the capability of each jurisdiction, and reduce or avoid future losses.' +
                    'This is the heart of the mitigation plan, and is essential to leading communities to reduce their risk.  Communities, not FEMA, “own” the hazard mitigation actions in the strategy.' +
                    'Projects that are well developed and documented in one place are more quickly identifiable for selection when grants become available, making implementation that much more likely.',
            icon: 'os-icon-globe',
            hideNav: true,
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        {
            title: 'Actions',
            requirement: 'Req-NYS-F-7',
            type: 'content',
            prompt: 'Describe how the risk and vulnerabilities assessment, as well as the communities priorities, guided the mitigation strategy development, including' +
                    '1) actions and/or projects that the jurisdiction considered to reduce the impacts of hazards identified in the risk assessment, and' +
                    '2) actions and/or projects that the jurisdiction intends to implement.',
            intent: 'To ensure the hazard mitigation actions are based on the identified hazard vulnerabilities, are within the capability of each jurisdiction, and reduce or avoid future losses.' +
                    'This is the heart of the mitigation plan, and is essential to leading communities to reduce their risk.  Communities, not FEMA, “own” the hazard mitigation actions in the strategy.' +
                    'Projects that are well developed and documented in one place are more quickly identifiable for selection when grants become available, making implementation that much more likely.',
            icon: 'os-icon-globe',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            // /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        {
            title: 'Proposed Actions',
            requirement: 'Req-C-4',
            type: 'actionsFilteredListTable',
            description: 'The table below includes the Mitigation Actions that were identified during the strategy development process by the jurisdictional representatives. The jurisdictions completed the DHSES Action worksheet as part of the strategy development process for select prioritized actions listed below. The actions prioritized for the Plan update are labeled with the status ‘Proposed - HMP’. In order to view the action status update, description, and problem being mitigated; click the row being reviewed and a drop down will appear. Additionally, you can click on the arrow underneath ‘viewLink’ to view the action in depth.',
            filterCol: ['action_status_update'],
            filterBy: ['Proposed-HMP'],
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
            viewLink: true,
            activeGeoFilter: 'true',
            defaultSortCol: 'action_jurisdiction',
            // defaultSortOrder: 'desc',
            renameCols: {'action_jurisdiction':'jurisdiction', 'viewLink': 'view', 'estimated_timeframe_for_action_implementation': 'timeframe', 'description_of_problem_being_mitigated':'problem statement', 'estimated_cost_range':'estimated cost', 'lead_agency_name_text':'lead agency', 'action_status_update':'status','action_description':'description' }, // new name should match colOrder names.
            colOrder: ['view','jurisdiction', 'action_name', 'associated_hazards', 'priority_score', 'timeframe', 'estimated cost', 'lead agency', 'status', 'description', 'problem statement'],
            minHeight: '80vh',
            icon: 'os-icon-activity',

        },
        {
            title: 'Additional Actions Inventory',
            requirement: 'Req-C-4',
            type: 'actionsFilteredListTable',
            description: 'The table below includes additional identified actions that are inventoried for further development in the future. In order to view the action status update, description, and problem being mitigated; click the row being reviewed and a drop down will appear. Additionally, you can click on the arrow underneath ‘viewLink’ to view the action in depth.',
            filterCol: ['action_status_update'],
            filterBy: ['Proposed-New','Proposed-Carryover', 'Carryover-In-Development', 'New-In-Development'],
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
            viewLink: true,
            activeGeoFilter: 'true',
            defaultSortCol: 'action_jurisdiction',
            // defaultSortOrder: 'desc',
            colOrder: ['action_jurisdiction', 'action_name', 'associated_hazards', 'action_status_update', 'action_description', 'description_of_problem_being_mitigated'],
            generalCols: ['action_jurisdiction', 'action_name', 'associated_hazards', 'priority_score', 'estimated_timeframe_for_action_implementation', 'estimated_cost_range', 'lead_agency_name_text', 'action_status_update', 'description_of_problem_being_mitigated'],
            expandableCols: ['action_description', 'description_of_problem_being_mitigated'],
            exclude: ['priority_score', 'estimated_timeframe_for_action_implementation', 'estimated_cost_range', 'lead_agency_name_text'],
            minHeight: '80vh',
            icon: 'os-icon-activity',
            hideNav: true,

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
            icon: 'os-icon-edit-1',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true    
        },  
        {
            title: 'NFIP Continued Compliance & Repetitive Loss Strategy',
            requirement:'Req-C-2A',
            type: 'content',
            prompt: 'Address each jurisdiction’s participation in the NFIP and continued compliance with NFIP requirements, as appropriate, describe how and why. Describe FPMP for continued compliance, Adoption and enforcement of floodplain management requirements, including regulating new construction in Special Flood Hazard Areas (SFHAs); Floodplain identification and mapping, including any local requests for map updates; or Description of community assistance and monitoring activities. If jurisdiction is not taking part in NFIP describe why.',
            intent:'To demonstrate flood hazard mitigation efforts by the community through NFIP activities. Where FEMA is the official administering Federal agency of the NFIP, participation in the program is a basic community capability and resource for flood hazard mitigation activities',
            icon:'os-icon-cloud-drizzle',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        {
            title: 'NFIP Compliance Table',
            requirement: 'Req-C-2B',
            type: 'formTable',
            fontSize: '0.70em',
            height: '600px',
            hideNav: true,
            align: 'full',
            config: {
                type: 'municipalities',
                description: 'The information in the table below was compiled for MitigateNY using the Community Status Book Report provided by FEMA which includes map dates and Community Identification (CID) numbers for communities participating in the national flood program, NYSDEC Community Assistance Visits (CAVs), and jurisdictional input from the Hazard Mitigation Plan interview process.', 
                //filters:[{column:'capability_category',value:'planning and regulatory'}],
                columns : [
                    {
                        Header: 'Jurisdiction',
                        accessor: 'community_name',
                        sort: true,
                        filter: 'default'
                    },
                    {
                        Header: 'CID Number',
                        accessor: 'cid',
                        sort: true,
                        filter: 'default'
                    },
                    {
                        Header: 'Initial Flood Insurance Rate Map',
                        accessor: 'initial_firm_date',
                        sort: true,
                        filter: 'multi'
                    },
                    {
                        Header: 'Current Effective FIRM',
                        accessor: 'current_map_date',
                        sort: true,
                        filter: 'multi'
                    },

                    /*  {
                          Header: 'adopting authority',
                          accessor: 'adopting_authority',
                          sort: true,
                          filter: 'default'
                      },*/
                    {
                        Header: 'NFIP Standing',
                        accessor: 'nfip_standing',
                        sort: true,
                        filter: 'default'
                    },
                    {
                        Header: 'CAV Date',
                        accessor: 'community_assistance_visit',
                        // expandable: 'true',
                        // expandableHeader: true
                    },
                    {
                        Header: 'NFIP Administrator',
                        accessor: 'nfip_administrator_name',
                        // expandable: 'true',
                        // expandableHeader: true
                    },
                    {
                        Header: 'viewLink',
                        accessor: 'viewLink',
                        width: 50,
                        expandable: 'true',
                        expandableHeader: true
                    },
                ]
            },
            prompt: '',
            intent: '',
            viewLink: true,
            activeGeoFilter: 'true',
            defaultSortCol: 'community_name',
            // defaultSortOrder: 'desc',
            colOrder: ['Jurisdiction', 'CID Number','Initial Flood Insurance Rate Map','Current Effective FIRM','NFIP Standing','CAV Date','NFIP Administrator','viewLink'],
            minHeight: '80vh',
            icon: 'os-icon-tasks-checked'
        },

        {
            title:'Implementation Resources',
            requirement:'Req-NYS-F-8',
            type:'content',
            prompt:'Document a complete list of funding opportunities, resources and programs available for implementation.',
            intent:'To identify resources to be used for implementation of the hazard mitigation actions including, but not limited to, funding sources, existing publications, or training opportunities.. States may add state and local resources, if available. Identifying strategic funding sources is integral to successful coordination and implementation of mitigation actions.' +
                    'The plan must include a list of potential local, State and Federal funding sources.',
            icon:'os-icon-folder',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true         
        },
        // {
        //     title:'Resources',
        //     requirement:'Req-NYS-F-8B',
        //     type:'',
        //     prompt:'Document a complete list of funding opportunities, resources and programs available for implementation.',
        //     intent:'To identify resources to be used for implementation of the hazard mitigation actions including, but not limited to, funding sources, existing publications, or training opportunities.. States may add state and local resources, if available. Identifying strategic funding sources is integral to successful coordination and implementation of mitigation actions.' +
        //             'The plan must include a list of potential local, State and Federal funding sources.',
        //     icon:'os-icon-folder',
        //     hideNav: true,
        //      // hideNav: true // hides key from public nav. Displays on page.
        //     ///*2-non-county*/ pullCounty: true,
        //     ///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        //     ///*2-non-delete*/ hideIfNull: true  
        // },
    ],
     
     Response : [
       {
        title:'Displaced Residents',
        requirement:'Req-NYS-F-4B',
        type: 'content',
        prompt:'Identify sites for the placement of temporary housing units to house residents displaced by disaster. While sites can be coordinated county wide, it is critical that each jurisdiction identify a site. Residents may be accommodated by a temporary housing location that is outside of the jurisdiction in which they live as long as mutual aid agreements between municipalities are in place.',
        intent:'Jurisdictions containing an SFHA must identify potential sites that are compliant with the NYS Uniform Fire Prevention and Building Code (with first flood elevation placed no less than 2’ above the Base Flood Elevation) for the placement of temporary housing units for residents displaced by disaster; and potential sites within the jurisdiction suitable for relocating houses out of the floodplain, or building new houses once properties in the floodplain are razed.' +
                'The plan must document the location of viable sites, and include a letter from the local floodplain administrator certifying viability or listing any actions required to ensure conformance.' + 'Evacuation and sheltering measures must be in place and available for public awareness to protect residents and mitigate risk, stress and personal hardships during hazard events.' +
                'Jurisdictions must identify routes and procedures to evacuate citizens prior to and during an event, and identify shelters for evacuated citizens. Provisions must be included for a range of medical needs, accommodation for pets, and compliance with the Americans with Disabilities Act (ada.gov).'+ ' The plan must document (or refer back to such components in existing valid plan): Evacuation routes and procedures;' +
                'Location of shelters (outside of the SFHA); Specific information about how these plans are accessible and available to the public, or include the related narrative from those plans in an appendix.',
        icon:'os-icon-ui-90',
        // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true         
        },
        {
            title: 'Temporary Housing and Relocation',
            requirement: 'Req-NYS-F-3A',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-email-forward',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        // {
        //     title: 'Relocation Zones',
        //     requirement: 'Req-NYS-F-3B',
        //     type: 'content',
        //     prompt: 'Tell us about your relocation zones...',
        //     intent: '',
        //     icon: 'os-icon-documents-07',
        //     // hideNav: true // hides key from public nav. Displays on page.
        //     /*2-non-county*/ pullCounty: true,
        //     ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        //     ///*2-non-delete*/ hideIfNull: true 
            
        // },
        {
            title: 'Relocation Zone Map',
            requirement: 'Req-NYS-F-3B-1',
            type: 'developementZonesFilteredMap',
            description: 'The following map depicts the geographic location of potential Relocation Zones identified during the jurisdictional interviews. Clicking the blue pins on the map will display a tooltip identifying the name of the zone and any comments associated with it.',
            filterBy: {zone_type: ['Relocation Zone']},
            prompt: '',
            intent: '',
            icon: 'os-icon-documents-07',
            hideNav: true
        },
        {
            title: 'Evacuation Procedures',
            requirement: 'Req-NYS-F-4A-1',
            type: 'content',
            prompt: 'Identify evacuation routes and how this information is accessible to the public. Identify plans, policies or procedures that outline evacuation routes and procedures to remove citizens from a vulnerable location prior to and during an incident. If plans for evacuation and sheltering are already in place, the mitigation planning jurisdiction should analyze and update these materials as needed. If such plans do not exist, they must be developed (see NYS Mitigation Plannging Standards Guide).',
            intent: 'Evacuation and sheltering measures must be in place and available for public awareness to protect residents and mitigate risk, stress and personal hardships during hazard events.',
            icon: 'os-icon-alert-triangle',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },    
        {
            title: 'Evacuation Routes',
            requirement: 'Req-NYS-F-4A',
            type: 'evacuationRoutes',
            description: 'The map below depicts all of the evacuation routes identified by jurisdictional representatives and during the hazard mitigation planning process. Jurisdictional boundaries are displayed in green and evacuation routes are displayed in pink. A list of all routes is displayed in a collapsable table in the top right corner of the map. Clicking the “View” button next to a route will zoom the map to that route’s location. Clicking “View All” will zoom the map out so that every recorded evacuation route will be visible on the map. Clicking “Hide All” will remove all of the evacuation routes so that the underlying road maps are more visible.',
            prompt: '',
            intent: 'Evacuation and sheltering measures must be in place and available for public awareness to protect residents and mitigate risk, stress and personal hardships during hazard events.',
            icon: 'os-icon-alert-octagon',
            hideNav: true 
        },
        {
            title: 'Shelters',
            requirement: 'Req-NYS-F-4B-2',
            type: 'content',
            prompt: 'Identify shelters for evacuated citizens and how this information is accessible to the public leading up to and during an incident; explain provisions available to address medical needs, access and functional needs, accommodation for pets, and compliance with the Americans with Disabilities Act (see www.ada.gov); Outline pre-disaster actions required to make evacuation and shelter plans viable; Document evidence of coordination with adjoining jurisdictions (if applicable).',
            intent: 'Evacuation and sheltering measures must be in place and available for public awareness to protect residents and mitigate risk, stress and personal hardships during hazard events.',
            icon: 'os-icon-share-2',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        {
            title: 'Shelter Table',
            requirement: 'Req-NYS-F-4D',
            type: 'shelterListTable',
            description: 'The table below lists all of the shelters with the community and their approximate evacuation capacity, the post-impact capacity, if the site is ADA compliant,  wheelchair accessible, and has a generator on site or is self-sufficient for providing electricity. Evacuation Capacity refers to how many people could fit in the shelter when displaced from a hazard for three (3) days or less while the post-impact capacity is how many people can stay at the shelter for longer than three (3) days.',
            align: 'full',
            prompt: '',
            intent: 'Evacuation and sheltering measures must be in place and available for public awareness to protect residents and mitigate risk, stress and personal hardships during hazard events.',
            defaultSortCol: 'evacuation_capacity',
            // defaultSortOrder: 'desc',
            colOrder: ['shelter_name', 'evacuation_capacity', 'post_impact_capacity', 'ada_compliant', 'wheelchair_accessible', 'generator_onsite', 'self_suffienct_electricty',],
            minHeight: '80vh',
            icon: 'os-icon-share-2',
            hideNav: true
        },
    ],
     
     'Process Assessment' : [
        {
            title: 'Strengths',
            requirement:'Req-R-3A',
            type:'content',
            prompt:'Describe strengths of the process to develop a mitigation strategy and specific actions.',
            intent:'',
            icon:'os-icon-trending-up',
            // hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            /*2-non-delete*/ hideIfNull: true
        },
        {
            title:'Opportunities',
            requirement:'Req-R-3B',
            type:'content',
            prompt:'Describe the challenges associated with developing the mitigation strategy and actions. Identify ways your community can improve upon the process during the 5-year life cycle of the plan and in preparation for the next update. Consider inclusion of significant Opportunities for Improvement identified by DHSES and FEMA reviewers.',
            intent:'',
            icon:'os-icon-bar-chart-up',
            // hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            /*2-non-delete*/ hideIfNull: true
        },
    ]
    
}

export default config