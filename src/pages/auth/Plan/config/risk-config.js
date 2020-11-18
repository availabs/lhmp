const config = {
    'Risk Image': [{
        title: 'Risk Image',
        requirement: `risk-image`,
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
        title: 'Risk Quote',
        requirement: 'risk-quote',
        type: 'content',
        prompt: '',
        intent: '',
        callout: '',
        icon: 'os-icon-arrow-right7',
        onlyAdmin: true,
        pullCounty: true
    }],
    'Purpose' : [
        {
            title: 'About Risk and Vulnerability',
            requirement: 'Req-B-3B-7',
            type: 'content',
            prompt: 'Provide an overall summary of each jurisdiction’s vulnerability to the identified hazards.',
            intent: 'The plan must provide an overall summary of each jurisdiction’s vulnerability to the identified' +
                ' hazards. The overall summary of vulnerability identifies structures, systems, populations or other' +
                ' community assets as defined by the community that are susceptible to damage and loss from hazard events.' +
                ' a. *Vulnerable assets and potential losses is more than a list of the total exposure of population,' +
                ' structures, and critical facilities in the planning area. An example of an overall summary is a list' +
                ' of key issues or problem statements that clearly describes the community’s greatest vulnerabilities' +
                ' and that will be addressed in the mitigation strategy.',
            icon: 'os-icon-globe',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            // nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        {
            title: 'Local Orientation',
            requirement: 'Req-B-3B',
            type: 'content',
            prompt: 'Provide an overall summary of each jurisdiction’s vulnerability to the identified hazards.',
            intent: 'The plan must provide an overall summary of each jurisdiction’s vulnerability to the identified' +
                ' hazards. The overall summary of vulnerability identifies structures, systems, populations or other' +
                ' community assets as defined by the community that are susceptible to damage and loss from hazard events.' +
                ' a. *Vulnerable assets and potential losses is more than a list of the total exposure of population,' +
                ' structures, and critical facilities in the planning area. An example of an overall summary is a list' +
                ' of key issues or problem statements that clearly describes the community’s greatest vulnerabilities' +
                ' and that will be addressed in the mitigation strategy.',
            icon: 'os-icon-globe',
            // hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
    ],
    'Vulnerability' : [
        {
            title: 'Social Vulnerability',
            requirement: 'Req-B-3B-3',
            type: 'content',
            prompt: 'Identify vulnerable populations within the community to highlight groups of people that will need additional considerations when establishing mitigation plans and actions.' +
                    'Vulnerable populations are people identified as being at higher risk to natural hazards and include social and physical vulnerabilities: the economically disadvantaged, racial and ethnic minorities, the uninsured, low-income individuals and families, the elderly, the homeless, those in high population density areas, those with chronic health conditions, including severe mental illness.',
            intent: 'For each jurisdiction to consider their community as a whole and analyze the potential impacts of future hazard events and the vulnerabilities that could be reduced through hazard mitigation actions.',
            icon: 'os-icon-grid-squares-2',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        // {
        //     title: 'Social Vulnerability Map',
        //     requirement: 'Req-B-3B-3B',
        //     //hideNav: true,
        //     type: 'content',
        //     prompt: 'Identify vulnerable populations within the community to highlight groups of people that will need additional considerations when establishing mitigation plans and actions.' +
        //             'Vulnerable populations are people identified as being at higher risk to natural hazards and include social and physical vulnerabilities: the economically disadvantaged, racial and ethnic minorities, the uninsured, low-income individuals and families, the elderly, the homeless, those in high population density areas, those with chronic health conditions, including severe mental illness.',
        //     intent: 'For each jurisdiction to consider their community as a whole and analyze the potential impacts of future hazard events and the vulnerabilities that could be reduced through hazard mitigation actions.',
        //     icon: 'os-icon-grid-squares-2',
        //     // hideNav: true // hides key from public nav. Displays on page.
        //     /*2-non-county*/ pullCounty: true,
        //     ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        //     ///*2-non-delete*/ hideIfNull: true 
        // },      
        {
            title: '',
            requirement: 'Req-B-3B-4',
            type: 'sociallyVulnerableDemographicsMap',
            hideNav: true,
            prompt: '',
            intent: '',
            icon: 'os-icon-grid-squares-2'
        },
        // {
        //     title: '',
        //     requirement: 'Req-B-3B-3C',
        //     hideNav: true,
        //     type: 'content',
        //     prompt: 'Identify vulnerable populations within the community to highlight groups of people that will need additional considerations when establishing mitigation plans and actions.' +
        //             'Vulnerable populations are people identified as being at higher risk to natural hazards and include social and physical vulnerabilities: the economically disadvantaged, racial and ethnic minorities, the uninsured, low-income individuals and families, the elderly, the homeless, those in high population density areas, those with chronic health conditions, including severe mental illness.',
        //     intent: 'For each jurisdiction to consider their community as a whole and analyze the potential impacts of future hazard events and the vulnerabilities that could be reduced through hazard mitigation actions.',
        //     icon: 'os-icon-grid-squares-2',
        //     // hideNav: true // hides key from public nav. Displays on page.
        //     /*2-non-county*/ pullCounty: true,
        //     ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        //     ///*2-non-delete*/ hideIfNull: true
        // },

        // {
        //     title: 'Vulnerable Populations Zones',
        //     requirement: 'Req-B-3B-3D',
        //     type: 'developementZonesFilteredMap',
        //     filterBy: {zone_type: ['Vulnerable Population']},
        //     prompt: '',
        //     intent: 'To ensure that the mitigation strategy continues to address the risk and vulnerabilities to existing and potential development, and takes into consideration possible future conditions that can impact the vulnerability of the community.',
        //     icon: 'os-icon-globe'
        // },
        // {
        //     title: 'Vulnerable Population Zones',
        //     requirement: 'Req-B-3B-3E',
        //     type: 'developementZonesFilteredTable',
        //     filterBy: {zone_type: ['Vulnerable Population']},
        //     prompt: '',
        //     intent: 'To ensure that the mitigation strategy continues to address the risk and vulnerabilities to existing and potential development, and takes into consideration possible future conditions that can impact the vulnerability of the community.',
        //     defaultSortCol: 'name',
        //     activeGeoFilter: 'true',
        //     minHeight: '80vh',
        //     icon: 'os-icon-grid-squares-2'
        // },

        {
            title: 'Built Environment',
            requirement: 'Req-B-3B-1', 
            type: 'content',
            prompt: 'Although all built assets may be affected by hazards, certain buildings or concentrations of buildings may be more vulnerable because of their location, age, construction type, condition, or use. Provide an overview of general land use and specific, vulnerable assets or areas in your community.' +
                    'Include description of Historic properties or districts if appropriate.',
            intent: 'For each jurisdiction to consider their community as a whole and analyze the potential impacts of future hazard events and the vulnerabilities that could be reduced through hazard mitigation actions.',
            icon: 'os-icon-image',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        }, 
        {
            title:`Built-Environment-image`,
            requirement:'Req-B-3B-6',
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
            hideNav: true,
            hideIfNull: true
        },  
        {
            title: 'Built Environment Table',
            requirement: 'Req-B-3B-2',
            type: 'inventoryTable',
            hideNav: true,
            //align: '',
            intent: 'Overview of loss by asset type by scenario',
            icon: 'os-icon-alert-circle'
        },

        {
            title: 'Critical Infrastructure',
            requirement: 'Req-NYS-F-2',
            type: 'content',
            prompt: 'Describe local vulnerability in terms of existing critical infrastructure and facilities in identified hazard areas/areas with known hazard risk.' +
                    'Critical Infrastructure systems are depended upon for life safety and economic viability and include transportation, power, communication, and water and wastewater systems. Many critical facilities depend on infrastructure to function.',
            intent: 'Jurisdictions must identify all critical facilities, assess vulnerabilities and ensure protection to a 500-year flood event. Critical facilities located in an SFHA, or having ever sustained previous flooding, must be protected to the 500-year flood event, or worst case scenario.' +
                    '- The plan must document the name of facility, type of facility, jurisdictional location, and exposure to a 100- and 500-year event.' +
                    '- The plan must document that critical facilities are protected to the 500-year flood event, or worst damage scenario. For those that do not meet this level of protection, the plan must include an action to meet this criteria, or explain why it is not feasible to do so',
            icon: 'os-icon-loader',
            // hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            /*2-non-delete*/ hideIfNull: true 
        },
        // {
        //     title: 'Critical Infrastructure Table',
        //     requirement: 'Req-NYS-F-2B',
        //     type: 'content',
        //     prompt: 'Describe local vulnerability in terms of existing critical infrastructure and facilities in identified hazard areas/areas with known hazard risk.' +
        //             'Critical Infrastructure systems are depended upon for life safety and economic viability and include transportation, power, communication, and water and wastewater systems. Many critical facilities depend on infrastructure to function.',
        //     intent: 'Jurisdictions must identify all critical facilities, assess vulnerabilities and ensure protection to a 500-year flood event. Critical facilities located in an SFHA, or having ever sustained previous flooding, must be protected to the 500-year flood event, or worst case scenario.' +
        //             '- The plan must document the name of facility, type of facility, jurisdictional location, and exposure to a 100- and 500-year event.' +
        //             '- The plan must document that critical facilities are protected to the 500-year flood event, or worst damage scenario. For those that do not meet this level of protection, the plan must include an action to meet this criteria, or explain why it is not feasible to do so',
        //     icon: 'os-icon-loader',
        //     // hideNav: true // hides key from public nav. Displays on page.
        //     /*2-non-county*/ pullCounty: true,
        //     ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        //     ///*2-non-delete*/ hideIfNull: true 
        // },
        
        {
            title: '',
            requirement: 'Req-NYS-F-3',
            type: 'criticalFacilitiesTable',
            prompt: '',
            intent: '',
            defaultSortCol: 'critical',
            icon: 'os-icon-loader',
            hideNav: true
        },
        {
            title: 'Natural Environment',
            requirement: 'Req-B-3B-5',
            type: 'content',
            prompt: 'Identify critical natural areas and other environmental features that are vulnerable to hazard impact and are important to your communitys identity and quality of life and support the economy through agriculture, tourism and recreation, and a variety of other critical ecosystem services, such as clean air and water and vulnerable species and habitats and discussion of green infrastructure.',
            intent: 'Environmental assets and natural resources are important to community identity and quality of life and support the economy through agriculture, tourism and recreation, and a variety of other ecosystem services, such as clean air and water.' +
                    'The natural environment also provides protective functions that reduce hazard impacts and increase resiliency: conservation of environmental assets may present opportunities to meet mitigation and other community objectives, such as protecting sensitive habitat, developing parks and trails, or contributing to the economy.',
            icon: 'os-icon-edit-3',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true         
        },
        {
            title: 'Problem Areas',
            requirement: 'Req-B-3B-8',
            type: 'content',
            prompt: '',
            intent: 'The table below includes a list of problem areas identified during the Jurisdictional Interview Process',
            icon: 'os-icon-globe', 
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        {
            title: '',
            requirement: 'Req-B-4A-1',
            type: 'problemStatementTable',
            prompt: '',
            intent: '',
            activeGeoFilter: 'true',
            defaultSortCol: 'action_jurisdiction',
            minHeight: '80vh',
            icon: 'os-icon-alert-circle',
            hideNav: true,
            renameCols: {'action_jurisdiction':'jurisdiction', 'description_of_problem_being_mitigated':'problem statement',}, // new name should match colOrder names.
        
        },
    ],
    
    'Changes in Risk' : [
        {
            title: 'What Changed',
            requirement: 'Req-D-1A',
            type: 'content',
            prompt: 'Areas of recent and future growth and development are an important component when assessing the building environment.' +
                    'Identify recent (since the last plan) or planned (future) changes in development located in hazard prone areas. Describe whether this development increases, decreases, or has no impact on the vulnerability of your community.' +
                    'If no changes in development impact the overall vulnerability, state this. Document how, if at all, the plan was revised to reflect changes in development.' +  
                    'Changes in development means recent development (for example, construction completed since the last plan was approved), potential development (for example, development planned or under consideration by the jurisdiction), or conditions that may affect the risks and vulnerabilities of the jurisdictions (for example, climate variability, declining populations or projected increases in population, or foreclosures). Not all development will affect a jurisdiction’s vulnerability.',
            intent: 'To ensure that the mitigation strategy continues to address the risk and vulnerabilities to existing' +
                ' and potential development, and takes into consideration possible future conditions that can impact the' +
                ' vulnerability of the community.',
            icon: 'os-icon-repeat',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
       
        {
            title: 'Development Zones',
            requirement: 'Req-D-1B',
            type: 'developementZonesFilteredTable',
            filterBy: {zone_type: ['Future Development Zone', 'Recent Development Zone']},
            prompt: '',
            intent: 'To ensure that the mitigation strategy continues to address the risk and vulnerabilities to existing and potential development, and takes into consideration possible future conditions that can impact the vulnerability of the community.',
            defaultSortCol: 'name',
            activeGeoFilter: 'true',
            minHeight: '80vh',
            icon: 'os-icon-grid-squares-2'
        },
        {
            title: 'Development Map',
            requirement: 'Req-D-1C',
            type: 'developementZonesFilteredMap',
            filterBy: {zone_type: ['Future Development Zone', 'Recent Development Zone']},
            prompt: '',
            intent: 'To ensure that the mitigation strategy continues to address the risk and vulnerabilities to existing and potential development, and takes into consideration possible future conditions that can impact the vulnerability of the community.',
            icon: 'os-icon-globe'
        }, 
        {
            title: 'Open Space',
            requirement: 'Req-E-1A',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-globe',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        {
            title: 'Open Space Statistics',
            requirement: 'Req-E-1B',
            type: 'openSpaceTable',
            prompt: '',
            intent: '',
            defaultSortCol: 'Land Type',
            // defaultSortOrder: 'desc',
            colOrder: ['Land Type', '# of parcels', 'Total Area (Acres)', 'Total Value'],
            icon: 'os-icon-globe'
        },
        {
            title: 'Previous Action Status',
            requirement: 'Req-D-1F',
            type: 'content',
            prompt: 'Describe the status of hazard mitigation actions in the previous plan as well as mitigation efforts and accomplishments not documented in the last plan. For actions that have not been completed, the plan must either describe whether the action is no longer relevant or be included as part of the updated action plan.',
            intent: 'To evaluate and demonstrate progress made in the past five years in achieving goals and implementing actions and to to provide a context for the jurisdictions’ projects, act as a source of ideas for mitigation projects and evaluate the accuracy of assumptions and engineering solutions to inform future projects, and to support future mitigation planning and its coordination with other planning, zoning and environmental procedures within the jurisdiction.',
            icon: 'os-icon-tasks-checked',
            // hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        {
            title: 'Previous Actions',
            requirement: 'Req-D-1G',
            type: 'actionsFilteredListTable',
            filterBy: [ 'In-progress', 'Completed', 'Discontinued'],
            align: 'full',
            prompt: 'Describe the status of hazard mitigation actions in the previous plan by identifying those that have' +
                ' been completed or not completed. For actions that have not been completed, the plan must either describe' +
                ' whether the action is no longer relevant or be included as part of the updated action plan.',
            intent: 'To evaluate and demonstrate progress made in the past five years in achieving goals and implementing' +
                ' actions outlined in their mitigation strategy.',
            activeGeoFilter: 'true',
            defaultSortCol: 'action_jurisdiction',
            // defaultSortOrder: 'desc',
            //exclude: ['action_name'],
            colOrder: ['action_jurisdiction', 'action_name', 'associated_hazards', 'priority_score', 'estimated_timeframe_for_action_implementation', 'estimated_cost_range', 'lead_agency_name_text', 'action_status_update', 'action_description', 'description_of_problem_being_mitigated'],
            minHeight: '80vh',
            icon: 'os-icon-tasks-checked',
            hideNav: true
        },
    ],
        'Floodplain Management' : [
        {
            title: 'NFIP Compliance',
            requirement: 'Req-B-4B',
            type: 'content',
            prompt: 'Address each jurisdiction’s participation in the NFIP and continued compliance with NFIP requirements, as appropriate.' +
                ' a. Describe FPMP for continued compliance, Adoption and enforcement of floodplain management requirements, including regulating new construction in Special Flood Hazard Areas (SFHAs);\n' +
                '   i.Floodplain identification and mapping, including any local requests for map updates; or' +
                '   ii.Description of community assistance and monitoring activities.' +
                ' b. If jurisdiction is not taking part in NFIP describe why' +
                ' Describe Floodplain Management (include/use current FIRMS, DFIRMS or best available data)' +
                ' Review, describe and discuss NFIP Participation, Program and Repetitive Loss Properties' +
                ' CAV Dates from DEC Received' + 
                ' Policy Information from DEC/FEMA Received' +
                ' Claims Information from DEC/FEMA Received' + 
                ' Repetitive/Severe Repetitive Loss Properties from FEMA Received' + 
                ' Describe commitment to maintaining NFIP compliance',
            intent: 'To demonstrate flood hazard mitigation efforts by the community through NFIP activities. Where FEMA' +
                ' is the official administering Federal agency of the NFIP, participation in the program is a basic community' +
                ' capability and resource for flood hazard mitigation activities.',
            icon: 'os-icon-bar-chart-up',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        {
            title: 'NFIP Statistics',
            requirement: 'Req-B-4',
            type: 'nfipStatistics',
            prompt: '',
            intent: 'The plan must describe the types (residential, commercial, institutional, etc.) and estimate the' +
                ' numbers of repetitive loss properties located in identified flood hazard areas.',
            icon: 'os-icon-home',
            defaultSortCol: 'Jurisdiction'
        },
        {
            title: 'NFIP Problem Areas',
            requirement: 'Req-B-4A',
            type: 'content',
            prompt: 'Using data visualizations and local knowledge add narrative content about the stock of properties' +
                ' that have suffered repetitive damage due to flooding, particularly problem areas that may not be apparent' +
                ' on floodplain maps. How does this relate to mitigation actions/the overall mitigation strategy?',
            intent: 'The plan must describe the types (residential, commercial, institutional, etc.) and estimate the' +
                ' numbers of repetitive loss properties located in identified flood hazard areas. Information on repetitive' +
                ' loss properties helps inform FEMA hazard  mitigation assistance programs under the National Flood Insurance Act.',
            icon: 'os-icon-alert-circle',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },

    ],
        'Dam Safety' : [
        {
            title: 'High Hazard Dams',
            requirement: 'Req-S-3A',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-alert-circle', 
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        {
         title:``,
         requirement:'Req-S-3B',
         type: 'image',
         prompt: '',
         intent: '',
         callout: '',
         label:'Image', // Which you would like to see on the form
         height: 150,
         width: 350,
         border: 1,
         icon: 'os-icon-arrow-right7',
         // onlyAdmin: true,
         hideNav: true,
         pullCounty: true,
        },
    ],
        'Process Assessment'  : [
        {
            title: 'Strengths',
            requirement: 'Req-R-2A',
            type: 'content',
            prompt: 'Describe Risk Assessment strengths.',
            intent: 'The purpose of hazard mitigation is to reduce potential losses from future disasters.' +
                    'The intent of mitigation planning, therefore, is to maintain a process that leads to hazard mitigation actions.'+
                    'Identifying process strengths provides helpful context for understanding how the hazard mitigation strategy and actions were developed.',
            icon: 'os-icon-trending-up',
            // hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            /*2-non-delete*/ hideIfNull: true        
        },
        {
            title: 'Opportunities',
            requirement: 'Req-R-2B',
            type: 'content',
            prompt: 'Describe the challenges associated with assessing risk.  Include limitations related to access to data, information, costs, technical expertise, mapping, etc.'+
                    'Identify ways your community can improve upon the process during the 5-year life cycle of the plan and in preparation for the next update. Consider inclusion of significant Opportunities for Improvement identified by DHSES and FEMA reviewers.',
            intent: 'The purpose of hazard mitigation is to reduce potential losses from future disasters. The intent of mitigation planning, therefore, is to maintain a process that leads to hazard mitigation actions.'+
                    'Identifying process strengths provides helpful context for understanding how the hazard mitigation strategy and actions were developed.',
            icon: 'os-icon-bar-chart-up',
            // hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            /*2-non-delete*/ hideIfNull: true                
        }    
    ]
}

export default config