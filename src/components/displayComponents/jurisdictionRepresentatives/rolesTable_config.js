let config = [
    {
        // TODO check the list view if no data
        type:'roles',
        list_attributes : ['contact_name','contact_county','contact_municipality','contact_agency','contact_title_role','contact_department'],
        combine_list_attributes:{attributes:['contact_county','contact_municipality'],result:'Jurisidiction'},
        sub_type:'',
        sections:[],
        attributes:{
            contact_email:{
                label:'Email(optional)',
                prompt:'',
                sub_type:'',
                edit_type:"email",
                display_type:'text',
                data_error:"Your email address is invalid",
                meta:'false',
                section:''
            },
            contact_county:{
                label:'County', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                data_error:"Please select county",
                field_required:"required",
                validation : "true",
                area:'true',
                meta: 'true',
                section: ''
            },
            contact_municipality:{
                label:'Jurisdiction(optional)',
                prompt:'',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                area:'true',
                depend_on:'contact_county',
                section: ''
            },
            contact_agency:{
                label:'Agency(optional)',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:''
            },
            contact_department:{
                label:'Department(optional)',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:''
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
                section: ''
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
                section:''
            },
            contact_phone:{
                label:'Phone(optional)',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:''
            },
            contact_address:{
                label:'Address(optional)',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:''
            }
        }

    }
];

module.exports = config