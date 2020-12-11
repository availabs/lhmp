module.exports = [
    {
        type:'participation',
        list_attributes : [
                'id',
                'title', 
                'contact_municipality',
                'start_date', 
                {'milestones' : {filter:'true'}}, 
                'narrative', 
                /*'roles'*/
        ],
        csv_download: [
                'title',
                'contact_county',
                'contact_municipality',
                'sub_type',
                'owner_type',
                'meeting_format',
                'start_date',
                'hours',
                'invite_method',
                'narrative',
                'minutes',
                'milestones',
                'roles'
        ],
        sections:[],
        attributes:{
            title:{
                sub_type:'meeting',
                label:'Title',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                section:'',
                list_attribute: 'true'
            },
            contact_county:{
                label:'County', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                data_error:"Please select county",
                //field_required:"required",
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
                depend_on:'contact_county',
                section: '',
                list_attribute: 'true'
            },
            sub_type:{
                label:'Sub type',
                prompt:'',
                //edit_type:'integer',
                display_type:'text',
                hidden:'true', // if you don`t want to show it in view data
                section:'',
                list_attribute: 'true'
            },
            owner_type:{
                sub_type:'meeting',
                label:'Owner Id',
                prompt:'',
                edit_type:'integer',
                display_type:'text',
                hidden:'true', // if you don`t want to show it in view data
                section:''
            },
            meeting_format:{
                label:'Meeting Format',
                prompt:'',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                show:'true',
                meta:'true',
                meta_filter:{
                    filter_key:'',
                    value:[
                        'Virtual',
                        'In-Person',
                        'Phone Call', 
                    ],
                },
            },
            start_date:{
                label:'Date',
                sub_type:'meeting',
                prompt:'',
                edit_type:'date',
                display_type:'text',
                meta:'false',
                section:''
            },
            hours:{
                label:'Hours',
                sub_type:'meeting',
                prompt:'',
                edit_type:'number',
                display_type:'text',
                meta:'false',
                section:'',

            },
            invite_method:{
                label:'Invitation Method',
                prompt:'',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                show:'true',
                meta:'true',
                meta_filter:{
                    filter_key:'',
                    value:[
                        'Email',
                        'Outlook Invitation',
                        'Phone Call',
                        'Mailed Letter',
                    ],
                },
            },
            narrative:{
                label:'Narrative',
                sub_type:'meeting',
                prompt:'',
                edit_type:'textarea',
                display_type:'text',
                meta:'false',
                section:''
            },
            minutes:{
                label:'Agenda and Minutes',
                sub_type:'meeting',
                prompt:'',
                edit_type:'textarea',
                display_type:'text',
                meta:'false',
                section:''
            },
            milestones:{
                label:'Participation Milestones',
                prompt:'',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                show:'true',
                meta:'true',
                meta_filter:{
                    filter_key:'',
                    value:[
                        'Core Planning Group Meeting',
                        'Ad Hoc Meeting or Phone Call',
                        'Steering Committee Meeting',
                        'Completed Information Gathering or Surveys',
                        'Provided Data or Information',
                        'Jurisdictional Information Meeting',
                        'Identified Vulnerabilities',
                        'Identified Capabilities',
                        'Conducted Risk Assessment', 
                        'Inventoried - Critical Infrastructure, Shelters, etc.',
                        'Progress on Previous Mitigation Strategies',
                        'Mitigation Strategy Development',
                        'Mitigation Strategy Workshop',
                        'Input on Goals and Objectives',
                        'Facilitated or Supported Public Outreach Initiative',
                        'Integration with Other Planning Mechanisms',
                        'Reviewed/Approved Draft and Final Plan Sections',
                        'Plan Draft Review Meeting',
                        'Adoption Support',
                        'Maintenance', 
                    ],
                },
            },
            roles:{
                label:'Roles',
                sub_type:'',
                prompt:'',
                edit_type:'AvlFormsJoin',
                display_type:'AvlFormsJoin',
                parentConfig: 'participation',
                targetConfig: 'roles',
                targetKey: 'contact_name',
                hidden:'false',
                meta:'false',
                section:'',
            },
        }
    }
]