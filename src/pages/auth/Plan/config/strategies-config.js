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
        onlyAdmin: true
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
            title: 'Local Orientation',
            requirement: '',
            type: 'content',
            prompt: 'Provide an overview of the Strategy Development Process.  Briefly describe the process by which your community used existing resources and risk assessments to identify problem statements.' +
                    'Then, describe how your community developed strategies to solve for those problems and how they were documented. Who was involved? Did you conduct site visits? Did you attend a Mitigation Strategy Workshop? Etc.',
            intent: 'To ensure the hazard mitigation actions are based on the identified hazard vulnerabilities, are within the capability of each jurisdiction, and reduce or avoid future losses.' +  
                    'This is the heart of the mitigation plan, and is essential to leading communities to reduce their risk.  Communities, not FEMA, “own” the hazard mitigation actions in the strategy.' +
                    'Each jurisdiction participating in the plan must have mitigation actions specific to that jurisdiction that are based on the community’s risk and  vulnerabilities, as well as community priorities.',
            icon: 'os-icon-globe'
         },
         {   
            title: 'Goals & Objectives',
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
            activeGeoFilter: 'true',
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
            title: 'Capacity to Assess Risk',
            requirement: 'Req-C-1A' + 'Req-C-1B.1' + 'Req-C-2',
            type: 'content',
            hideNav: true,
            prompt: ''
        },
        {
            title: 'Integration',
            requirement: 'Req-A-4F',
            type: 'content',
            prompt: 'Review Existing Resources from Jurisdictions & outside stakeholders.' +
                    'Identify opportunities for integration of existing resources into HMP and mitigation strategies.' + 
                    'Review plans identified in existing resources for consistency and/or conflicts.' + 
                    'Describe ability to expand capabilities, including floodplain management (identify specific steps to be taken)',
            intent: '',
            icon: 'os-icon-home'
        },

        {
            title: 'Capacity To Address Risk',
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
    
        Implementation: [
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
            icon: 'os-icon-globe'
        },
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
        {
            title: 'NFIP Continued Compliance & Repetative Loss Strategy',
            requirement:'Req-C-2A',
            type: 'content',
            prompt: 'Address each jurisdiction’s participation in the NFIP and continued compliance with NFIP requirements, as appropriate, describe how and why. Describe FPMP for continued compliance, Adoption and enforcement of floodplain management requirements, including regulating new construction in Special Flood Hazard Areas (SFHAs); Floodplain identification and mapping, including any local requests for map updates; or Description of community assistance and monitoring activities. If jurisdiction is not taking part in NFIP describe why.',
            intent:'To demonstrate flood hazard mitigation efforts by the community through NFIP activities. Where FEMA is the official administering Federal agency of the NFIP, participation in the program is a basic community capability and resource for flood hazard mitigation activities',
            icon:'os-icon-cloud-drizzle',
        },
        {
            title:'Resources',
            requirement:'Req-NYS-F-8',
            type:'',
            prompt:'Document a complete list of funding opportunities, resources and programs available for implementation.',
            intent:'To identify resources to be used for implementation of the hazard mitigation actions including, but not limited to, funding sources, existing publications, or training opportunities.. States may add state and local resources, if available. Identifying strategic funding sources is integral to successful coordination and implementation of mitigation actions.' +
                    'The plan must include a list of potential local, State and Federal funding sources.',
            icon:'os-icon-folder',        
        },
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
        },
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
            title: 'Relocation Zone Table',
            requirement: 'Req-NYS-F-3B-1',
            type: 'developementZonesFilteredMap',
            filterBy: {zone_type: ['Relocation Zone']},
            prompt: '',
            intent: '',
            icon: 'os-icon-documents-07',
            hideNav: true
        },
        {
            title: 'Evacuation Procedues',
            requirement: 'Req-NYS-F-4A-1',
            type: 'content',
            prompt: 'Identify evacuation routes and how this information is accessible to the public. Identify plans, policies or procedures that outline evacuation routes and procedures to remove citizens from a vulnerable location prior to and during an incident. If plans for evacuation and sheltering are already in place, the mitigation planning jurisdiction should analyze and update these materials as needed. If such plans do not exist, they must be developed (see NYS Mitigation Plannging Standards Guide).',
            intent: 'Evacuation and sheltering measures must be in place and available for public awareness to protect residents and mitigate risk, stress and personal hardships during hazard events.',
            icon: 'os-icon-alert-triangle'
        },    
        {
            title: 'Evacuation Routes',
            requirement: 'Req-NYS-F-4A',
            type: 'evacuationRoutes',
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
            icon: 'os-icon-share-2'
        },
        {
            title: 'Shelter Table',
            requirement: 'Req-NYS-F-4B',
            type: 'shelterListTable',
            align: 'full',
            prompt: '',
            intent: 'Evacuation and sheltering measures must be in place and available for public awareness to protect residents and mitigate risk, stress and personal hardships during hazard events.',
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
            icon:'os-icon-trending-up'
        },
        {
            title:'Opportunities',
            requirement:'Req-R-3B',
            type:'content',
            prompt:'Describe the challenges associated with developing the mitigation strategy and actions. Identify ways your community can improve upon the process during the 5-year life cycle of the plan and in preparation for the next update. Consider inclusion of significant Opportunities for Improvement identified by DHSES and FEMA reviewers.',
            intent:'',
            icon:'os-icon-bar-chart-up'
        },
    ]
    
}

export default config