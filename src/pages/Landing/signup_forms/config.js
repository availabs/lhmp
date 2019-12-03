module.exports = [
    {
        type:'roles',
        list_attributes : ['contact_title_role','contact_department','contact_agency','contact_county','contact_municipality'],
        combine_list_attributes:{attributes:['contact_county','contact_municipality'],result:'Jurisidiction'},
        sub_type:'',
        sections:[
            {title:'Step 1',sub_title:'Email',id:'1',activate:{attributes:['contact_email','email_verify'],nextButtonActiveStep1:false}},
            {title:'Step 2',sub_title:'Role Details',id:'2'},
            {title:'Step 3',sub_title:'Personal Details',id:'3'},

        ],
        attributes:{
            contact_email:{
                label:'Email',
                prompt:'',
                sub_type:'',
                edit_type:"email",
                display_type:'text',
                data_error:"Your email address is invalid",
                meta:'false',
                section:'1'
            },
            email_verify:{
                label:'Confirm Email',
                prompt:'',
                sub_type:'',
                edit_type:"email",
                display_type:'text',
                data_error:"Your email address is invalid",
                meta:'false',
                section:'1'
            },
            contact_county:{
                label:'County', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'dropDownSignUp',
                display_type:'text',
                data_error:"Please select county",
                field_required:"required",
                area:'true',
                meta: 'true',
                section: '2'
            },
            contact_municipality:{
                label:'Jurisdiction(optional)',
                prompt:'',
                sub_type:'',
                edit_type:'dropDownSignUp',
                display_type:'text',
                meta: 'true',
                area:'true',
                depend_on:'false',
                section: '2'
            },
            contact_agency:{
                label:'Agency(optional)',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'2'
            },
            contact_department:{
                label:'Department(optional)',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'2'
            },
            contact_title_role:{
                label:'Role',
                prompt:'',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                field_required:'required', // optional if you want the field to be required
                validation: "true",
                meta: 'true',
                meta_filter:{filter_key:'roles',value:'category'},
                section: '2'
            },
            contact_name:{
                label:'Name',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                field_required:'required',
                display_type:'text',
                validation:"true",
                meta:'false',
                section:'3'
            },
            contact_phone:{
                label:'Phone(optional)',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'3'
            },
            contact_address:{
                label:'Address(optional)',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'3'
            }
        }
    }
]