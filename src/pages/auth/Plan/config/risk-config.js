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
            description:'The table below lists the inventory of structures for the Towns in the county and how many are located within the 100 and 500 year flood plains. In New York State, Villages are included within Town boundaries. Villages are not included in this table so as to not double count buildings. Clicking on each number will navigate to a new page with a list view of that category’s  structures containing their addresses, property classes, and the owner types. These lists can be downloaded as spreadsheets using the “Download CSV” button in the top right of the new window.',
            hideNav: true,
            //align: '',
            intent: 'Overview of loss by asset type by scenario',
            icon: 'os-icon-alert-circle',
            hideFloodValue: true,
            hideFloodCount: true
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
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            // 2-non-delete hideIfNull: true 
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
            title: 'Critical Facilities Table',
            requirement: 'Req-NYS-F-3',
            type: 'criticalFacilitiesTable',
            description:'Clicking on each number will navigate to a new page with a list view of that category’s  structures containing their addresses, property classes, and the owner types. These lists can be downloaded as spreadsheets using the “Download CSV” button in the top right of the new window.',
            prompt: '',
            intent: '',
            defaultSortCol: 'critical',
            icon: 'os-icon-loader',
            hideNav: true,
            hideFloodValue: true,
            hideFloodCount: true
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
            title: 'Problem Statements Table',
            requirement: 'Req-B-4A-1',
            type: 'problemStatementTable',
            description:'The table below is a list of each jurisdictions’ problem statements gathered and developed through the hazard mitigation planning process. Each problem statement is accompanied by a list of hazards that may be associated with the problem. The list can be sorted alphabetically by clicking the column titles or narrowed by entering text in the search bars beneath the column titles.',
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
            description:'The following table lists all of the Recent or Future Development Zones that were created as a result of the jurisdictional interviews and any additional comments that were noted during the zone creation. The list can be sorted alphabetically by clicking the column titles.',
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
            description:'The following map depicts the geographic location of the Recent and Future Development Zones identified during the jurisdictional interviews. Clicking the blue pins on the map will display a tooltip identifying the name of the zone and any comments associated with it.',
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
            description:'The table below lists the different types of open space, the quantity of parcels that are classified as each, the total area in acres of each type, and the recorded value of that open space type. The open space classifications in this table were pulled from New York State’s Parcel Code and these figures were generated using parcel data.',
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
            /*2-non-county*/ pullCounty: true,
            //*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
        },
        {
            title: 'Previous Actions',
            requirement: 'Req-D-1G',
            type: 'actionsFilteredListTable',
            description:'The table below contains each jurisdiction’s previous actions that were listed in the previous hazard mitigation plan. The table shows the jurisdiction where the action was assigned, the name of the action, a list of hazards associated with the action, and a status update on the action.The list can be sorted alphabetically by clicking the column titles or narrowed by entering text in the search bars beneath the column titles. The status updates and their meanings are: ' + 
            'Completed - This action has been completed. '+
            'In-progress - This action is still being actively pursued. This may mean that the action is not completed or that it is an ongoing action, like an outreach program, that will remain In-progress as long as it continues. ' + 
            'Proposed-Carryover - These are actions that were proposed in the previous plan that are being brought forward to be included in the inventory of actions in this hazard mitigation plan. Carryover actions are listed in the Additional Actions Inventory table on the Strategies page. They are listed there, along with other new actions as an inventory of strategies that require further development. ' + 
            'Proposed-HMP - These are actions, some of which were proposed in the previous plan, that meet minimum requirements for actions for review by DHSES and FEMA and are being brought forward to be included into this current hazard mitigation plan. The entire list of Proposed-HMP actions can be found in the Proposed Actions table on the Strategies page. ' + 
            'Discontinued - These actions are no longer relevant and have been discontinued. ',
            filterCol: ['previous_plan_action'],
            filterBy: ['yes'],
            align: 'full',
            prompt: 'Describe the status of hazard mitigation actions in the previous plan by identifying those that have' +
                ' been completed or not completed. For actions that have not been completed, the plan must either describe' +
                ' whether the action is no longer relevant or be included as part of the updated action plan.',
            intent: 'To evaluate and demonstrate progress made in the past five years in achieving goals and implementing' +
                ' actions outlined in their mitigation strategy.',
            activeGeoFilter: 'true',
            defaultSortCol: 'action_jurisdiction',
            // defaultSortOrder: 'desc',
            colOrder: ['action_jurisdiction', 'action_name', 'associated_hazards', 'action_status_update', 'action_description'],
            generalCols: ['action_jurisdiction', 'action_name', 'associated_hazards', 'priority_score', 'estimated_timeframe_for_action_implementation', 'estimated_cost_range', 'lead_agency_name_text', 'action_status_update'],
            expandableCols: ['action_description', 'description_of_problem_being_mitigated'],
            exclude: ['priority_score', 'estimated_timeframe_for_action_implementation', 'estimated_cost_range', 'lead_agency_name_text', 'description_of_problem_being_mitigated'],
            minHeight: '80vh',
            icon: 'os-icon-tasks-checked',
            hideNav: true
        },
    ],
        'Floodplain Management' : [
        {
            title: 'National Flood Insurance Program',
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
        // {
        //     title:`Floodplain Image`,
        //     description: 'The image below shows the Flood Insurance Rate Map (FIRM) 500-Year (0.2% Annual) Floodplain geography in blue and all building footprints that intersect with the floodplain in green.',
        //     requirement:'Req-B-4E',
        //     type: 'image',
        //     prompt: '',
        //     intent: '',
        //     callout: '',
        //     label:'Image', // Which you would like to see on the form
        //     height: 250,
        //     width: 500,
        //     border: 1,
        //     icon: 'os-icon-arrow-right7',
        //     // onlyAdmin: true,
        //     hideNav: true,
        //     hideIfNull: true,
        //     pullCounty:true
        // },
        {
            title: 'NFIP Statistics',
            requirement: 'Req-B-4',
            type: 'nfipStatistics',
            description:'The following table provides a snapshot of the National Flood Insurance Program (NFIP) in the county. Due to the nature of the NFIP data, the NFIP information for Villages is included within their respective Towns (in New York State, Villages are included within Towns). '+ 
            'At the top, a total number of NFIP Claims and the Total Payments for those claims is displayed. '+ 
            'The table shows the total amount of NFIP claims, how many claims were paid, the total amount paid, number of repetitive/severe repetitive loss properties, and number of NFIP policies for '+ 
            'each Town in the County. Addtionally, due to the structure of the NFIP data there were complicatons in associating the repetitive loss and severe repetitive loss '+ 
            'properties with landuse types (e.g., residential/commercial) in this table.',
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
        {
            title: 'NFIP Problem Areas Map',
            requirement: 'Req-B-B-4D',
            type: 'developementZonesFilteredMap',
            description:'The following map depicts the geographic location of the NFIP Problem Area Zones identified during the jurisdictional interviews. Clicking the blue pins on the map will display a tooltip identifying the name of the zone and any comments associated with it.',
            filterBy: {zone_type: ['NFIP Problem Area']},
            prompt: '',
            intent: 'To ensure that the mitigation strategy continues to address the risk and vulnerabilities to existing and potential development, and takes into consideration possible future conditions that can impact the vulnerability of the community.',
            icon: 'os-icon-globe',
            hideNav: true,
        },
        {
            title: 'NFIP Problem Areas List',
            requirement: 'Req-B-B-4C',
            type: 'developementZonesFilteredTable',
            description:'The following table lists all of the NFIP Problem Area Zones that were created as a result of the jurisdictional interviews and any additional comments that were noted during the zone creation. The list can be sorted alphabetically by clicking the column titles.',
            filterBy: {zone_type: ['NFIP Problem Area']},
            prompt: '',
            intent: 'To ensure that the mitigation strategy continues to address the risk and vulnerabilities to existing and potential development, and takes into consideration possible future conditions that can impact the vulnerability of the community.',
            defaultSortCol: 'name',
            activeGeoFilter: 'true',
            minHeight: '80vh',
            icon: 'os-icon-grid-squares-2',
            hideNav: true,
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