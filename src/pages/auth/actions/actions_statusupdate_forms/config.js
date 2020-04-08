
module.exports = [
    {
        type:'actions', // type is same as the route path for now
        list_attributes:['action_name','action_type','sub_type'], // to list the attributes on the main page
        // if wizard
        sections: [
            {title:'Step 1',sub_title:'Point of Contact',id:'1'},
            {title:'Step 2',sub_title:'General Information',id:'2'},
            {title:'Step 3',sub_title:'Status',id:'3'},
            {title:'Step 4',sub_title:'Location',id:'4'},
            {title:'Step 5',sub_title:'Budget and Funding',id:'5'},
            {title:'Step 6',sub_title:'BCA and Useful Life',id:'6'},
            {title:'Step 7',sub_title:'Associated Goals/Capabilities',id:'7'},
            {title:'Step 8',sub_title:'Alternatives',id:'8'},
            {title:'Step 9',sub_title:'Prioritization',id:'9',visibility:{attribute:'new_or_update',check:['new'],hidden:'true'}}, // TODO visiility condition
            {title:'Step 10',sub_title:'Supplemental Location Information',id:'10',visibility:{attribute:'new_or_update',check:['new'],hidden:'false',optional:'Step 9'}}, // TODO this.state.new_or_update === 'new' ? 'Step 10' : 'Step 9'
            {title:'Step 11',sub_title:'Other',id:'11',visibility:{attribute:'new_or_update',check:['new'],hidden:'false',optional:'Step 10'}},
            {title:'Step 12',sub_title:'Hazard Mitigation Plan Maintenance',id:'12',visibility:{attribute:'new_or_update',check:['new'],hidden:'false',optional:'Step 11'}}
        ],
        attributes: {
            action_point_of_contact:{
                label:'Action Point of Contact',
                sub_type:'project',
                prompt:'Provide the name of the person responsible for the action.',
                edit_type:'multiselect',
                display_type:'text',
                meta: 'true',
                meta_filter:{filter_key:'roles',value:'contact_name'}, // if populating from another form type
                section: '1',
                //defaultValue: ['Countywide'],
                //example: 'Demo example.'

            },
            action_name:{
                label:'Action Name',
                sub_type:'project',
                prompt:'Provide a name for the action. Be as concise and specific as possible.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'2',
                list_attribute: 'true'
            },
            action_category:{
                label:'Action Category',
                sub_type:'project',
                prompt:'Choose the category that best describes the action from the dropdown menu .' +
                    'The category you choose will limit the possible responses to question 4.' +
                    'If you do not see the action type you are expecting in the dropdown for question 4 ' +
                    'you may need to change the action category you’ve selected in question 3.',
                edit_type:'dropdown',
                disable_condition:'',
                display_type:'text',
                meta: 'true',
                meta_filter:{filter_key:'actions_project',value:'category'}, // if populated from forms_meta
                section: '2'
            },
            action_type:{
                label:'Action Type',
                sub_type:'project',
                prompt:'Choose the category that best describes the action from the dropdown menu .' +
                    'The category you choose will limit the possible responses to question 4.' +
                    'If you do not see the action type you are expecting in the dropdown for question 4 ' +
                    'you may need to change the action category you’ve selected in question 3.',
                edit_type:'dropdown',
                disable_condition:'',
                display_type:'text',
                meta: 'true',
                meta_filter:{filter_key:'actions_project',value:'type'},
                depend_on:'action_category',
                section: '2',
                list_attribute: 'true'
            },
            sub_type:{
                label:'Sub type',
                sub_type:'project',
                prompt:'',
                //edit_type:'integer',
                display_type:'text',
                hidden:'true', // if you don`t want to show it in view data
                section:'',
                list_attribute: 'true'
            },
            action_number:{
                label:'Action Number',
                sub_type:'project',
                prompt:'',
                edit_type:'number',
                display_type:'text',
                meta:'false',
                section:'2'
            },
            description_of_problem_being_mitigated: {
                label:'Description of the Problem',
                sub_type:'project',
                prompt:'Provide a detailed narrative of the problem. Describe the natural' +
                    ' hazard you wish to mitigate, its impacts to the community, past damages and' +
                    ' loss of service, etc. Include the street address of the property/project location' +
                    ' (if applicable), adjacent streets, and easily identified landmarks such as water' +
                    ' bodies and well-known structures, and end with a brief description of existing' +
                    ' conditions (topography, terrain, hydrology) of the site.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'2'
            },
            action_description:{
                label:'Action Description',
                sub_type:'project',
                prompt:'Provide a detailed narrative of the solution. Describe the physical ' +
                'area (project limits) to be affected, both by direct work and by the project\'s ' +
                        'effects; how the action would address the existing conditions previously identified;' +
                    ' proposed construction methods, including any excavation and earth-moving activities;' +
                    ' where you are in the development process (e.g., are studies and/or drawings complete),' +
                    ' etc., the extent of any analyses or studies performed (attach any reports or studies).',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'2'
            },
            associated_hazards:{
                label:'Associated Hazard',
                sub_type:'project',
                prompt:'Identify the hazard(s) being addressed with this action.',
                edit_type:'multiselect',
                display_type:'text',
                meta: 'false',
                meta_filter:{filter_key:'',value:['Select All', 'Select None','Avalanche', 'Coastal Hazards', 'Coldwave', 'Drought',
                        'Earthquake', 'Hail', 'Heat Wave', 'Hurricane', 'Ice Storm', 'Landslide', 'Lightning',
                        'Flooding', 'Tornado', 'Tsunami/Seiche', 'Volcano', 'Wildfire', 'Wind', 'Snow Storm']},
                section: '2'
            },
            metric_for_measurement:{
                label:'Metric for Evaluation',
                sub_type:'project',
                prompt:' Identify one or more measurable elements that can be used to track the' +
                    ' progress of implementation and/or impact of this action. Quantitative values like' +
                    ' number of culverts widened or acres of agricultural land protected are recommended.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'2'
            },
            action_url:{
                label:'Action URL (if applicable)',
                sub_type:'project',
                prompt:' If the action has a website or online document associated with the capability,' +
                    ' enter it here. Examples include; emergency manager/department,' +
                    ' soil and water conservation districts’ websites, weblink to a policy.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'2'
            },
            new_or_update:{
                label:'New or Update',
                sub_type:'project',
                prompt:'Choose one. Select update if you are entering an action from a previous plan.' +
                    ' Select new only if you are entering a new action during the hazard mitigation planning process.',
                edit_type:'radio',
                edit_type_values:['new','update'],
                display_condition:'',
                display_type:'text',
                meta:'false',
                section:'3'
            },
            status:{
                label:'Update Status',
                sub_type:'project',
                prompt:'Select the current status of the project: discontinued, completed, in-progress, unchanged, proposed.',
                edit_type:'dropdown_no_meta',
                edit_type_values : ['discontinued','Completed','In-progress','unchanged','Proposed'],
                disable_condition:{attribute:'new_or_update',check:'update'},// check is when you want to show this
                display_condition : '',
                display_type:'text',
                meta:'false',
                section:'3'
            },
            status_justification:{
                label:'Status Justification',
                sub_type:'project',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['Lack of Funding','Funding Change','Env. / Hist. Preservation','Staffing','Public Support','Legal','Fixed or Otherwise Mitigated','Priority Change'],
                disable_condition : '',
                display_condition:{attribute:'status',check:['discontinued','unchanged']},
                display_type:'text',
                meta:'false',
                section:'3'
            },
            plan_maintenance_update_evaluation_of_problem_solution:{
                label:'Update Evaluation of the Problem and/or Solution',
                sub_type:'project',
                prompt:'Provide an updated description of the problem and solution, and what has' +
                    ' happened since initial consideration/development.',
                edit_type:'dropdown',
                disable_condition:{attribute:'new_or_update',check:'update'},
                display_type:'text',
                meta_filter:{filter_key:'capabilities',value:'category'},
                meta:'true',
                section:'3'
            },
            phased_action:{ // TODO why is the state same as above and Status update radio is disabled
                //disabled={this.state.new_or_update !== 'update'}
                label:'Phased Action',
                sub_type:'project',
                prompt:'Will the action be implemented in phases? Types of phases include: planning, designing, and constructing..',
                edit_type:'dropdown_no_meta',
                edit_type_values:['Not a Phased Project','Phased_planning','Phased-Design','Phased-Construction'],
                disable_condition:{attribute:'new_or_update',check:'update'},
                display_type:'text',
                meta:'true',
                section:'3'
            },
            name_of_associated_hazard_mitigation_plan:{
                label:'Name of Associated Hazard Mitigation Plan',
                sub_type:'project',
                prompt:'Provide the official name of the adopted hazard mitigation plan.',
                edit_type:'dropdown',
                disable_condition:'',
                meta_filter:{filter_key:'capabilities',value:'category'},
                display_type:'text',
                meta:'true',
                section:'3'
            },
            action_county:{
                label:' Action County',// which you would like to see on the form
                sub_type:'project',
                prompt:'Select the county where the action takes place. If the action is located' +
                    ' in a different county you can select it by clicking the dropdown.',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                area : 'true',
                section: '4'
            },
            action_jurisdiction:{
                label:' Action Jurisdiction',// which you would like to see on the form
                sub_type:'project',
                prompt:'Provide the name of the Town, Village or City where the action is located.' +
                    ' For example; Sullivan County has adopted a hazard mitigation plan, the Town of Callicoon' +
                    ' is the jurisdiction location of the specific action,' +
                    ' such as acquiring emergency generators for critical facilities.',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                depend_on:'action_county',
                area : 'true',
                section: '4'
            },
            action_location:{
                label:'Action Location',
                sub_type:'project',
                prompt:'Provide a narrative description of where the action is located. ' +
                    '(For example: At the intersection of Broadway and South St.)',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'4'
            },
            location_point:{
                label:'Location Point',
                sub_type:'project',
                prompt:' Provide the exact location(s) where the action takes place. Multiple points may be selected.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'4'
            },
            site_photographs:{
                label:'Site Photographs (If applicable)',
                sub_type:'project',
                prompt:'Upload photographs of the site that are relevant to outlining, describing,' +
                    ' depicting, or otherwise enhancing the description of this action.',
                edit_type:'file',
                display_type:'text',
                meta:'false',
                section:'4'
            },
            property_names_or_hist_dist:{
                label:'List the property name(s) or historic district(s)',
                sub_type:'project',
                prompt:'Provide the name of properties and/or districts designated as State and National Registers of Historic Places.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'4'
            },
            estimated_cost_range:{
                label:'Estimated Cost Range',
                sub_type:'project',
                prompt:'Select the cost range that most accurately reflects the costs associated with the action.',
                edit_type:'dropdown_no_meta',
                edit_type_values:['<$100k','$100K-$500K','$500K-$1M','$1M-$5M','$5M-$10M','$10M+'],
                disable_condition:'',
                display_type:'text',
                meta:'false',
                section:'5'
            },
            calculated_cost:{
                label:'Calculated Cost',
                sub_type:'project',
                prompt:'Provide the total dollar amount calculated in association with the action.',
                edit_type:'number',
                display_type:'text',
                meta:'true',
                section:'5'
            },
            primary_or_potential_funding_sources_name:{
                label:'Secured funding sources name',
                sub_type:'project',
                prompt:'Identify the name of the secured funding source. Or enter a new funding source.',
                edit_type:'dropdown_no_meta',
                edit_type_values:[],
                disable_condition:'',
                display_type:'text',
                meta:'false',
                section:'5'
            },
            secondary_funding_source_name:{
                label:'Potential funding sources name',
                sub_type:'project',
                prompt:'Identify the name of the potential funding source.',
                edit_type:'dropdown_no_meta',
                edit_type_values:[],
                disable_condition:'',
                display_type:'text',
                meta:'false',
                section:'5'
            },
            funding_received_to_date:{
                label:'Funding Received to Date',
                sub_type:'project',
                prompt:'Provide the exact dollar amount of secured funding.',
                edit_type:'number',
                display_type:'text',
                meta:'true',
                section:'5'
            },
            bca:{
                label:'BCA and Useful life',
                sub_type:'project',
                prompt:'Upload the Benefit Cost Analysis document performed for the action.',
                edit_type:'file',
                display_type:'text',
                meta:'false',
                section:'6'
            },
            bca_to_bcr:{
                label:'Does the BCA lead to BCR (Benefit Cost Ratio)?',
                sub_type:'project',
                prompt:'Was a Benefit Cost Report established as an outcome of the Benefit Cost Analysis?',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'6'
            },
            bcr:{
                label:'BCR Upload',
                sub_type:'project',
                prompt:'If you answered yes to question 28, provide an upload the Benefit Cost Report document',
                edit_type:'file',
                display_type:'text',
                meta:'false',
                section:'6'
            },
            level_of_protection:{
                label:'Level of Protection',
                sub_type:'project',
                prompt:'Identify the level of protection the proposed project will provide.  Ex. 100-year (1%) flood.',
                edit_type:'text',
                display_type:'text',
                display_condition:'',
                meta:'false',
                section:'6'
            },
            recurrence_interval:{
                label:'Recurrence Interval',
                sub_type:'project',
                prompt:'',
                edit_type:'number',
                display_type:'text',
               // display_condition:'',
                meta:'false',
                section:'6'
            },
            useful_life:{
                label:'Useful Life',
                sub_type:'project',
                prompt:'Identify the number of years the implemented action will provide protection against the hazard(s).',
                edit_type:'number',
                display_type:'text',
                display_condition:'',
                meta:'false',
                section:'6'
            },
            estimated_timeframe_for_action_implementation: {
                label:'Estimated Timeframe for Action Implementation',
                sub_type:'project',
                prompt:'Provided the estimated time required to complete the project from start to finish.',
                edit_type:'text',
                display_type:'text',
                display_condition:'',
                meta:'false',
                section:'6'
            },
            exact_timeframe_for_action_implementation: {
                label:'Exact Timeframe for Action Implementation',
                sub_type:'project',
                prompt:'Provided the specific timeline for action implementation as it exists.' +
                    ' How long it takes from beginning of action implementation to end of action implementation.',
                edit_type:'text',
                display_type:'text',
                display_condition:'',
                meta:'false',
                section:'6'
            },
            associated_mitigation_capability: {
                label:'Associated Mitigation Capability Category',
                sub_type:'project',
                prompt:'From the dropdown menu, select the capability that best describes the action.',
                edit_type:'dropdown',
                disable_condition:'',
                meta_filter:{filter_key:'capabilities',value:'category'},
                display_type:'text',
                display_condition:'',
                meta:'true',
                section:'7'
            },
            boolalternative:{
                label:'Is there an alternative?',
                sub_type:'project',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                display_condition:'',
                meta:'false',
                section:'8'
            },
            alternative_action_1:{
                // style={{display: ['yes', 'true', true].includes(this.state.boolalternative) ? 'block' : 'none'}}
                label:'Alternative Action 1',
                sub_type:'project',
                prompt:'What alternatives were considered when identifying and developing this action?',
                edit_type:'text',
                display_type:'text',
                display_condition:{attribute:'boolalternative',check:['yes','true',true]},
                meta:'false',
                section:'8'
            },
            alternative_action_1_evaluation:{
                label:'Alternative Action 1 Evaluation',
                sub_type:'project',
                prompt:'Explain why the alternative action was not selected; include the estimated cost and reasoning.',
                edit_type:'text',
                display_type:'text',
                display_condition:{attribute:'boolalternative',check:['yes','true',true]},
                meta:'false',
                section:'8'
            },
            alternative_action_2:{
                label:'Alternative Action 2',
                sub_type:'project',
                prompt:'What alternatives were considered when identifying and developing this action?',
                edit_type:'text',
                display_type:'text',
                display_condition:{attribute:'boolalternative',check:['yes','true',true]},
                meta:'false',
                section:'8'
            },
            alternative_action_2_evaluation:{
                label:'Alternative Action 2 (if applicable)',
                sub_type:'project',
                prompt:'Explain why the alternative action was not selected; include the estimated cost and reasoning.',
                edit_type:'text',
                display_type:'text',
                display_condition:{attribute:'boolalternative',check:['yes','true',true]},
                meta:'false',
                section:'8'
            },

            // TODO Step 9 is hidden
            priority_scoring_probability_of_acceptance_by_population:{
                label:'Priority Scoring: Probability of Acceptance by Population',
                sub_type:'project',
                prompt:'Priority Information is Only Applicable to New Actions',
                edit_type:'dropdown_no_meta',
                edit_type_values:['(4) Likely to be endorsed by the entire population',
                '(3) Of benefit only to those directly affected and would not adversely affect others',
                '(2) Would be somewhat controversial with special interest groups or a small percentage of the population',
                '(1) Would be strongly opposed by special interest groups or a significant percentage of the population',
                '(0) Would be strongly opposed by nearly all of the population'
                ],
                display_type:'text',
                meta:'false',
                section:'9'
            },
            priority_scoring_funding_availability:{
                label:'Priority Scoring: Funding Availability',
                sub_type:'project',
                prompt:'Priority Information is Only Applicable to New Actions',
                edit_type:'dropdown_no_meta',
                edit_type_values:['(4) Little to no direct expenses',
                '(3) Can be funded by operating budget',
                '(2) Grant funding identified',
                '(1) Grant funding needed',
                '(0) Potential funding source unknown'],
                display_type:'text',
                meta:'false',
                section:'9'
            },
            priority_scoring_probability_of_matching_funds:{
                label:'Priority Scoring: Probability of Matching Funds',
                sub_type:'project',
                prompt:'Priority Information is Only Applicable to New Actions',
                edit_type:'dropdown_no_meta',
                edit_type_values:['(4) Funding match is available or funding match not required',
                '(2) Partial funding match available',
                '(0) No funding match available or funding match unknown'],
                display_type:'text',
                meta:'false',
                section:'9'
            },
            priority_scoring_benefit_cost_review:{
                label:'Priority Scoring: Benefit Cost Review',
                sub_type:'project',
                prompt:'Priority Information is Only Applicable to New Actions',
                edit_type:'radio',
                edit_type_values:['(4) Likely to meet Benefit Cost Review',
                    '(2) Benefit Cost Review not required',
                    '(0) Benefit Cost Review unknown'],
                display_type:'text',
                meta:'false',
                section:'9'
            },
            priority_scoring_environmental_benefit:{
                label:'Priority Scoring: Environmental Benefit',
                sub_type:'project',
                prompt:'Priority Information is Only Applicable to New Actions.',
                edit_type:'radio',
                edit_type_values:['(4) Environmentally sound and relatively easy to implement; or no adverse impact on environment', '(3) Environmentally acceptable and not anticipated to be difficult to implement', '(2) Environmental concerns and somewhat difficult to implement because of complex requirements', '(1) Difficult to implement because of significantly complex requirements and environmental permitting', '(0) Very difficult to implement due to extremely complex requirements and environmental permitting problems'],
                display_type:'text',
                meta:'false',
                section:'9'
            },
            relates_to_protects_critical_facility_infrastructure:{
                label:'Relates to/ Protects Critical Facility/ Infrastructure',
                sub_type:'project',
                prompt:'Is the action directly related to any critical facilities or infrastructure?' +
                    ' Critical facilities include; utilities, emergency services, governmental structures,' +
                    ' bridges, transportation corridors, etc.',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            relates_to_protects_community_lifeline_by_fema:{
                label:'Relates to / Protects Community Lifeline(s) as defined by FEMA',
                sub_type:'project',
                prompt:'Categories include; Safety & Security, Food/Water/Sheltering, Health & Medical,' +
                    'Energy, Communications, Transportation, and Hazardous Material.',
                edit_type:'dropdown_no_meta',
                edit_type_values:[' '],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_pnp:{
                label:'Is PNP (private non-profit)?',
                sub_type:'project',
                prompt:'Is this the responsibility of a private non-profit?',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_state_agency:{
                label:'Is State Agency?',
                sub_type:'project',
                prompt:'Is this the responsibility of a State Agency?',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_community_member_of_crs: {
                label:'Is the community a member of CRS?',
                sub_type:'project',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_community_member_of_good_standing_with_nfip:{
                label:'Is the community a member of good standing with the NFIP?',
                sub_type:'project',
                prompt:'Is the community a member of good standing with the National Flood Insurance Program?',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_community_participate_in_climate_smart_communities:{
                label:'Does the community participate in Climate Smart Communities?',
                sub_type:'project',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_community_have_local_adopted_hmp:{
                label:'Does the community have a local adopted Hazard Mitigation Plan?',
                sub_type:'project',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_community_have_comprehensive_plan:{
                label:'Does the community have a comprehensive plan?',
                sub_type:'project',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_community_have_land_use_zoning:{
                label:'Does the community have land use zoning?',
                sub_type:'project',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_community_have_subdivision_ordinances:{
                label:'Does the community have subdivision ordinances?',
                sub_type:'project',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_community_have_building_codes:{
                label:'Does the community have building codes?',
                sub_type:'project',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            engineering_required:{
                label:'Engineering Required?',
                sub_type:'project',
                prompt:'Does proposed action require input or designs from engineering professionals?',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_final_engineering_design_completes:{
                label:'Final Engineering Design Complete?',
                sub_type:'project',
                prompt:'Is the final engineering design complete?',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_mitigation:{
                label:'Is Mitigation?',
                sub_type:'project',
                prompt:'select yes or no if the action falls under mitigation',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_preparedness: {
                label:'Is Preparedness?',
                sub_type:'project',
                prompt:'select yes or no if the action falls under preparedness',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_response:{
                label:'Is Response?',
                sub_type:'project',
                prompt:'select yes or no if the action falls under response',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_recovery:{
                label:'Is Recovery?',
                sub_type:'project',
                prompt:'select yes or no if the action falls under recovery',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_climate_adaptation:{
                label:'Is Climate Adaptation?',
                sub_type:'project',
                prompt:'What categories of the disaster cycle would the action be considered?',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_proposed_project_located_in_sfha:{
                label:'Is proposed project located in SFHA?',
                sub_type:'project',
                prompt:'if yes, select zone',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_project_structure_located_in_sfha:{
                label:'Is Project Structure (s) Located in SFHA?',
                sub_type:'project',
                prompt:'This can be any project or building located in the Special Flood Hazard Area',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_protects_repetitive_loss_property:{
                label:'Protects Repetitive Loss Property?',
                sub_type:'project',
                prompt:'Does the action protect a “Repetitive Loss Property” as defined by FEMA?' +
                    ' “Repetitive Loss Structure. An NFIP-insured structure that has had at least 2 ' +
                    'paid flood losses of more than $1,000 each in any 10-year period since 1978.” (FEMA)',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_protects_severe_repetitive_loss_property:{
                label:'Protects Repetitive Loss Property?',
                sub_type:'project',
                prompt:'Does the action protect a “Severe Repetitive Loss Property” as defined by FEMA? \n' +
                    '“Severe Repetitive Loss Building. Any building that:\n' +
                    'Is covered under a Standard Flood Insurance Policy made available under this title;\n' +
                    'Has incurred flood damage for which:\n' +
                    'a. 4 or more separate claim payments have been made under a Standard Flood Insurance ' +
                    'Policy issued pursuant to this title, with the amount of each such claim exceeding $5,000, ' +
                    'and with the cumulative amount of such claims payments exceeding $20,000; or\n' +
                    'b. At least 2 separate claims payments have been made under a Standard Flood Insurance Policy,' +
                    ' with the cumulative amount of such claim payments exceed the fair market value of the' +
                    ' insured building on the day before each loss.” (FEMA)',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            known_environmental_historic_preservation_protected_species_iss:{
                label:'Known Environmental/Historic Preservation/Protected Species Issues?',
                sub_type:'project',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            ground_distributed_other_than_agriculture:{
                label:'Has the ground at the project location been disturbed other than by agriculture?',
                sub_type:'project',
                prompt:'Has there been any instances of development, clearing, or other ground altering activity',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            indian_or_historic_artifacts_found_on_or_adjacent_project_area:{
                label:'To your knowledge, have Indian or historic artifacts been found on or adjacent to the project area?',
                sub_type:'project',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            building_50_years_or_older_within_or_near:{
                label:'Is there a building 50 years or older within or near the project area?',
                sub_type:'project',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            is_shpo_survey:{
                label:'SHPO survey?',
                sub_type:'project',
                prompt:'Has a State Historic Preservation Office survey been conducted in the ' +
                    'location of the action? If the survey is available, upload the PDF.',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'10'
            },
            shpo_survey:{
                label:'SHPO survey File',
                sub_type:'project',
                prompt:'',
                edit_type:'file',
                display_condition:{attribute:'is_shpo_survey',check:['yes', 'true', true]},
                display_type:'text',
                meta:'false',
                section:'10'
            },
            climate_smart_communities_action_type:{
                label:'Climate Smart Communities action type?',
                sub_type:'project',
                prompt:'From the Climate Smart Community action type dropdown, select the category that best describes your action.',
                edit_type:'dropdown_no_meta',
                edit_type_values:[' '],
                display_type:'text',
                meta:'false',
                section:'11'
            },
            plan_maintenance_date_of_status_report:{ // TODO value={this.state.plan_maintenance_date_of_status_report ? this.state.plan_maintenance_date_of_status_report.split('T')[0] : ''}
                label:'Plan Maintenance - Date of Status Report',
                sub_type:'project',
                prompt:'This section should be completed during plan maintenance/evaluation.',
                edit_type:'date',
                display_type:'text',
                meta:'false',
                section:'12'
            },
            plan_maintenance_progress_report:{
                label:'Plan Maintenance - Progress Report',
                sub_type:'project',
                prompt:'Describe what progress, if any, has been made on this project.  ' +
                    'If it has been determined the community no longer wishes to pursue project, state that here and indicate why.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'12'
            }

        }

    }
];