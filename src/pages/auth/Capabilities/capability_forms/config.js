module.exports = [
    {
        type:'capabilities', // type is same as the route path for now
        list_attributes:[
            // 'county',
            {'municipality' : {filter:'multi'}},
            {'capability_type': {filter:'true'}} ,
            {'capability_category': {filter:'true'}},
            'capability_name',
            'responsible_authority',
            'jurisdiction_utilization', 'capability_description'
            ],
        csv_download: ['capability_category', 'capability_type', 'capability_name','regulatory_name','municipality','capability_description','adoption_date','development_update','jurisdiction_utilization','mitigation_contribution','adopting_authority','responsible_authority','support_authority','affiliated_agency','link_url','upload'],
        default_title: 'Capability', // in the case when page_title is invalid
        page_title: 'capability_name', // page title in edit and view
        sub_title: 'capability_category', // sub title in edit and view
        sub_type:'',
        // if wizard
        sections: [],
        attributes: {
/*            image:{
                label:'Image', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'imageEditor',
                display_type:'imageViewer',
                area:'true',
                meta: 'true',
                height: 250,
                width: 500,
                border: 1,
                //hidden:'false',
                section: '',
                //field_required:"required",
            },*/
            county:{
                label:'County', // Which you would like to see on the form
                prompt:'Choose the county where the capability is located.',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                area:'true',
                meta: 'true',
                //hidden:'false',
                section: '',
                //field_required:"required",
            },
            municipality:{
                label:'Jurisdiction',
                prompt:'Choose the jurisdiction(s) where the capability is located. Selections will autopopulate based on the County selection. If Countywide, select Countywide.',
                sub_type:'',
                edit_type:'dropdown',
                addAll:'true', // to give add all option to multiselect
                defaultValue: ['Countywide'],
                display_type:'text',
                meta: 'true',
                area:'true',
                depend_on:'county',
                hidden:'false',
                section: ''
            },
            capability_category: {
                label:'Capability Type',
                prompt:'Choose a Capability Type from the Dropdown Menu. Use the above guidance to identify which type best fits this capability or select Other.',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                // metaSource: 'meta_file', // meta_file, default: database
                hidden:'false',
                section: '',
                list_attribute: 'true',
                example:''
            },
            capability_type :{
                label:'Capability',
                prompt:'Choose a Capability from the Dropdown Menu. Selections are based on the Capability Type selection. Use the above guidance to identify the best fit for this capability or select Other.',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                meta:'true',
                // metaSource: 'meta_file', // meta_file, default: database
                depend_on : 'capability_category',
                hidden:'false',
                section:'',
                list_attribute: 'true'
            },
            capability_name:{
                label:'Capability Name',
                prompt:'Provide a capability title only if it differs from the capability you chose in the dropdown menu in the previous question. ' +
                    'You might fill out this optional field if the Capability chosen is different than the official name for the capability.' +
                    '(Ex: You chose “Floodplain Management Plan” but the specific capability name for your jurisdictions Floodplain Management Plan is ' +
                    '“Floodplain Resources Management Plan.” Enter “Floodplain Resources Management Plan” in the Capability Name box.)',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                show:'true',
                meta:'false',
                hidden:'false',
                section:'',
                list_attribute: 'true'
            },
            capability_description:{
                label:'Capability Description',
                prompt:'Describe this capability',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                hidden:'false',
                expandable:'true',
                section:''
            },
            lifelines :{
                label:'Associated FEMA Lifeline(s)',
                prompt:'',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                // metaSource: 'meta_file', // meta_file, default: database
                hidden:'false',
                section:'',
                list_attribute: 'true'
            },
            status:{
                label:'Update Status',
                prompt:'Select the current status of the capability.' +
                   'New-Since-Last-Plan: capability was newly established since the last Hazard Mitigation Plan.' +
                   'On-going-Since-Last-Plan: capability was established and documented in your last Hazard Mitigation Plan.' +
                   'In-Development: capability is currently being developed.' +
                   'No-Longer-Relevant: capability has been discontinued or has ended its useful life.',
                edit_type:'dropdown_no_meta',
                edit_type_values : ['New-Since-Last-Plan','On-Going-Since-Last-Plan','In-Development','No-Longer-Relevant',],
// disable_condition:{attribute:'new_or_update',check:'update'},// check is when you want to show this
                display_condition : '',
                display_type:'text',
                meta:'false',
                section:'',
            },
            development_update:{
                label:'Description of Status',
                prompt:'If appropriate, provide additional information related to the status of this capability. For instance, if In-Development, describe how your jurisdiction is currently working towards implementing or enhancing the status of this capability; if No-Longer-Relevant, please describe why.',
                sub_type:'',
                edit_type:'text', // the values you would like to see as options for radio buttons
                disable_condition:'',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
              jurisdiction_utilization:{
                label:'Utilization: How is this Capability utilized in Mitigation Work? How does it contribute to Mitigation?',
                prompt:'Describe how or in what ways your jurisdiction is currently utilizing the capability. If it is an asset, describe in what capacity the asset is being used. If it is planning or regulatory based, describe the role it plays in your jurisdictional decision making. If it is educational, describe the method of outreach. If it is financial, for example; grants, local funds, state funds, tax agreements, etc. describe the distribution of the funds and their impacts on your jurisdiction. If it is administrative or technical, describe assistance offered to jurisdiction.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                hidden:'false',
                expandable:'true',
                section:'',
            },
             potential_risk:{
                label:'Risk Potential: Does this capability present goals, objectives or practices that may work against the goals and objectives of this Hazard Mitigation Plan and the mitigation programs in your community?',
                prompt:'Describe in what ways this capability may conflict with the goals and objectives of this hazard mitigation plan. For example, an economic development plan may seek to re-develop a waterfront area. If this waterfront area is a designated Special Flood Hazard Area, development without careful consideration of potential flooding may inadvertently incease risk to your community.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:'',
            },
            mitigation_contribution:{
                label:'Integration: What capacity does Mitigation planning provide this Capability?',
                prompt:'Describe how mitigation planning supports and contributes to building, maintaining or enhancing capacity for this capability',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:'',
            },
            capacity_explanation:{
                label:'Capacity: What is the jurisdictional capacity for implementing this Capability?',
                prompt: 'For planning and Regulatory consider if the plan, policy, code, or ordinance is robust enough to support effective mitigation. For Administrative and Technical consider if the staffing and tools are sufficient for implementing the mitigation plan. For Financial consider if the funding mechanism is effective for implementation of hazard mitigation planning. For Education/Outreach consider if the programs and methods communicate effectively and are implemented as designed for mitigation planning purposes.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:''
            },
            adoption_date:{
                label:'Date of adoption',
                prompt:'Provide the date (mm/dd/yyyy) capability was originally adopted by governing body/authority.',
                sub_type:'',
                edit_type:'date',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
            adopting_authority:{
                label:'Adopting Authority',
                prompt:'Provide the name of adopting authority and how they provide assistance. The adopting authority is usually a jurisdictional governing body.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                on_click:'false',
                hidden:'false',
                section:''
            },
            responsible_authority:{
                label:'Responsible Authority',
                prompt:'Provide name and description of responsible authority,' +
                    'if different from the adopting authority and how they provided assistance. ' +
                    'As an example; the County Planning Board is the “Adopting Authority” for a Water Resource Management Plan, ' +
                    'the “Responsible Authority” would be the Soil and Water Conservation District.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
            support_authority:{
                label:'Supporting Authority',
                prompt:'Provide the name and contact info of any jurisdictional department, authority, or organization that provides assistance to or is associated with the capability.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
            affiliated_agency:{
                label:'Affiliated Agency',
                prompt:'Provide the name of any affiliated State or Federal agency that provides assistance to or is associated with the capability.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
            link_url:{
                label:'URL for the link',
                prompt:'if the capability has a website or online document associated with the capability, provide the link here. (E.g.: Emergency Management Office or Soil and Water Conservation District websites, weblink to a complete streets policy, etc.)',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
            regulatory_name:{
                label:'Regulatory Name',
                prompt:'If the capability is a law/ordinance/resolution/policy, provide the legal ID (ex. Article 3, Section 4.6.1) of the capability at the time of adoption.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
            comments:{
                label:'Additional Comments',
                prompt:'Additional comments and concerns regarding the capablity.',
                sub_type:'',
                edit_type:'textarea',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
            // upload:{
            //     label:'Upload',
            //     prompt:'If applicable, provide a PDF upload of any and all supporting documents related to capability and its assessment. Examples include; meeting minutes, public participation surveys, regulatory documents, studies pertaining to development and updates.',
            //     sub_type:'',
            //     edit_type:'text',
            //     display_type:'text',
            //     meta:'false',
            //     hidden:'false',
            //     data:'true',
            //     section:''
            // }
        }
    }
];
