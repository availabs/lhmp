module.exports = [
    {
        type:'participation',
        list_attributes : ['id','title', 'sub_type'],
        sections:[],
        attributes:{
            owner_type:{
                sub_type:'time',
                label:'Owner Id',
                prompt:'',
                edit_type:'integer',
                display_type:'text',
                hidden:'true', // if you don`t want to show it in view data
                section:''
            },
             title:{
                sub_type:'meeting',
                label:'Title',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                section:'',
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
            start_date:{
                label:'Start Date',
                sub_type:'time',
                prompt:'',
                edit_type:'date',
                display_type:'text',
                meta:'false',
                section:''
            },
            end_date:{
                label:'End Date',
                sub_type:'time',
                prompt:'',
                edit_type:'date',
                display_type:'text',
                meta:'false',
                section:''
            },
            hours:{
                label:'Hours',
                sub_type:'time',
                prompt:'',
                edit_type:'number',
                display_type:'text',
                meta:'false',
                section:''
            },
            narrative:{
                label:'Narrative',
                sub_type:'time',
                prompt:'',
                edit_type:'textarea',
                display_type:'text',
                meta:'false',
                section:''
            }
        }
    }
]