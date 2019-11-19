module.exports = [
    {
        type:'capabilities', // type is same as the route path for now
        list_attributes:['capability_category','capability_type','capability_name'], // to list the attributes on the main page
        sub_type:'',
        // if wizard
        sections: [],
        attributes: {
            county:{
                prompt:'Choose the county the capability is located from the list of all counties.',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                section: ''
            },
            municipality:{
                prompt:'Choose the jurisdiction where the capability is located. Jurisdictions that occur are based on the County selected in question 1',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                depend_on:'county',
                section: ''
            },
            capability_category: {
                prompt:'Choose a Capability Category Type from the Dropdown Menu. This will limit the number of options in the Capability dropdown menu on the next question.',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                section: ''
            },
            capability_type :{
                prompt:'Choose a Capability. To limit the number of choices in this dropdown menu, choose a capability category from the dropdown menu in question 1.',
                edit_type:'dropdown',
                display_type:'text',
                meta:'true',
                depend_on : 'capability_category',
                section:''
            },
            capability_name:{
                prompt:'How your Jurisdiction titled this capability. ' +
                    'Provide a capability title only if it differs from the capability you chose in the dropdown menu on question 2. ' +
                    'You might fill out this optional field if the Capability you chose in question 2 is different than the official name of ' +
                    'your jurisdictional capability ex:  You chose “Floodplain Management Plan” but the specific capability name for your jurisdiction ' +
                    '“Floodplain Resources Management Plan.” Enter “Floodplain Resources Management Plan” in the Capability Title  box for question 3',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:''
            },
            regulatory_name:{
                prompt:'If the capability is a law/ordinance/resolution/policy, provide the legal ID (ex. Article 3, Section 4.6.1) of the capability at the time of adoption.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:''
            },
            adoption_date:{
                prompt:'Provide the date (mm/dd/yyyy) capability was originally adopted by governing body/authority.',
                edit_type:'date',
                display_type:'text',
                meta:'false',
                section:''
            },
            development_update:{
                prompt:'Is your jurisdiction currently working towards implementing or enhancing the status of this capability?',
                edit_type:'radio',
                edit_type_values:['yes','no'], // the values you would like to see as options for radio buttons
                display_type:'text',
                meta:'false',
                section:''
            },
            jurisdiction_utilization:{
                prompt:'Describe how or in what ways your jurisdiction is currently utilizing the capability. If it is an asset, describe in what capacity the asset is being used. If it is planning or regulatory based, describe the role it plays in your jurisdictional decision making. If it is educational, describe the method of outreach. If it is financial, for example; grants, local funds, state funds, tax agreements, etc. describe the distribution of the funds and their impacts on your jurisdiction. If it is administrative or technical, describe assistance offered to jurisdiction.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:''
            },
            adopting_authority:{
                prompt:'Provide the name of adopting authority and how they provide assistance. The adopting authority is usually a jurisdictional governing body.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                on_click:'false',
                section:''
            },
            responsible_authority:{
                prompt:'Provide name and description of responsible authority, ' +
                    'if different from the adopting authority and how they provided assistance. ' +
                    'As an example; the County Planning Board is the “Adopting Authority” for a Water Resource Management Plan, ' +
                    'the “Responsible Authority” would be the Soil and Water Conservation District.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:''
            },
            support_authority:{
                prompt:'Provide the name and contact info of any jurisdictional  department/authority/organization that provides assistance to or is associated with the capability.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:''
            },
            affiliated_agency:{
                prompt:'Provide the name of any affiliated State or Federal agency that provides assistance to or is associated with the capability.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:''
            },
            link_url:{
                prompt:'if the capability has a website or online document associated with the capability. Examples include; emergency manager/department, soil and water conservation districts websites, weblink to a complete streets policy.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:''
            },
            upload:{
                prompt:'If applicable, provide a PDF upload of any and all supporting documents related to capability and its assessment. Examples include; meeting minutes, public participation surveys, regulatory documents, studies pertaining to development and updates.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:''
            }
        }
    }
];
