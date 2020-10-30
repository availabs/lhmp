module.exports = [
    {
        type:'participation',
        list_attributes : ['id','title','start_date','sub_type'],
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
                section:''
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