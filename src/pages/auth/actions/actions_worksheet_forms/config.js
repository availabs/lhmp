module.exports = [
    {
        type:'actions', // type is same as the route path for now
        list_attributes:['action_name','action_type','sub_type'], // to list the attributes on the main page
        // if wizard
        sections: [
            {title:'Step 1',sub_title:'Project Name',id:'1'},
            {title:'Step 2',sub_title:'Hazard of Concern',id:'2'},
            {title:'Step 3',sub_title:'Describe Solution',id:'3'},
            {title:'Step 4',sub_title:'Prioritization',id:'4'},
            {title:'Step 5',sub_title:'Alternatives',id:'5'},
            {title:'Step 6',sub_title:'Project Status',id:'6'}
        ],
        attributes: {
            county:{
                sub_type:'worksheet',
                prompt:'',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                section: '1'
            },
            municipality:{
                sub_type:'worksheet',
                prompt:'',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                depend_on:'county',
                section: '1'
            },
            action_name:{
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta: 'false',
                rename_column : { name: ['action_name'] }, // Here the key for eg action_name is the name in the database and the array of values are the new names given
                section: '1'
            },
            project_number:{
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta: 'false',
                section: '1'
            },
            hazard_of_concern: {
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta: 'false',
                section: '2'
            },
            problem_description:{
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta: 'false',
                section: '2'
            }

        }
    }
];
