module.exports = [
    {
        type:'participation',
        list_attributes : ['id','sub_type'],
        sections:[],
        attributes:{
            meetings:{
                sub_type:'meeting',
                label:'Meetings',
                prompt:'',
                edit_type:'meeting_roles',
                display_type:'text',
                //hidden:'true', // if you don`t want to show it in view data
                section:''
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
                label:'Start Date',
                sub_type:'meeting',
                prompt:'',
                edit_type:'date',
                display_type:'text',
                meta:'false',
                section:''
            },
            end_date:{
                label:'End Date',
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
            }
        }
    }
]