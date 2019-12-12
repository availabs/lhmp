module.exports = [
    {
        type:'participation',
        list_attributes : ['id','sub_type'],
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