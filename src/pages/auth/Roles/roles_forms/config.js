module.exports = [
    {
        // TODO check the list view if no data
        type:'roles',
        list_attributes: [
            {'contact_name':{filter:'true'}},
            {'contact_title_role': {filter:'multi'}},
            'contact_department',
            {'contact_agency': {filter:'true'}},
            'contact_planning_team',
            {'contact_municipality': {filter:'true'}},
        ],
        csv_download: [
                'contact_email',
                'contact_county',
                'contact_municipality',
                'contact_name',
                'contact_agency',
                'contact_department',
                'contact_title_role',
                'contact_planning_team',
                'is_hazard_mitigation_representative',
                'contact_phone',
                'contact_address',
                'comments',
                'participation'
        ],
        // combine_list_attributes:{attributes:['contact_county','contact_municipality'],result:'Jurisidiction'},
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
                section: '',
                list_attribute: 'true'
            },
            contact_municipality:{
                label:'Jurisdiction(optional)',
                prompt:'',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                area:'true',
                defaultValue: ['Countywide'],
                depend_on:'contact_county',
                section: '',
                list_attribute: 'true'
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
                section:'',
                list_attribute: 'true'

            },
            contact_agency:{
                label:'Agency(optional)',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'',
                list_attribute: 'true'
            },
            contact_department:{
                label:'Department(optional)',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'',
                list_attribute: 'true'
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
                section: '',
                list_attribute: 'true'
            },
            contact_planning_team:{
                label:'HMP Participation',
                prompt:'',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                // field_required:'required', // optional if you want the field to be required
                // validation: "true",
                meta: 'true',
                meta_filter:{
                    filter_key:'',
                    value:[
                        'Core Planning Group',
                        'Steering Committee', 
                        'Stakeholder', 
                        'Jurisdictional Representative',
                        'Public/Citizen',
                    ],
                },
                section: '',
                list_attribute: 'true'
            },
            is_hazard_mitigation_representative:{
                label:'Is Hazard Mitigation Representative?',
                sub_type:'',
                prompt:'if yes, select',
                edit_type:'checkbox',
                edit_type_values:['yes'],
                display_type:'text',
                meta:'false',
                inline:'true',
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
            },    
            comments:{
                label:'Additional Comments',
                prompt:'Additional comments and concerns regarding this role.',
                sub_type:'',
                edit_type:'textarea',
                display_type:'text',
                meta:'false',
                hidden:'false',   
            },
            //is_representitive: {},
            participation:{
                label:'Participation',
                sub_type:'',
                prompt:'',
                edit_type:'AvlFormsJoin',
                display_type:'AvlFormsJoin',
                parentConfig: 'roles',
                targetConfig: 'participation',
                targetKey: 'title',
                hidden:'false',
                meta:'false',
                section:'',
            },
        }

    }
];