module.exports = [
    {
        type:'actions', // type is same as the route path for now
        list_attributes:['action_name','action_type','sub_type'], // to list the attributes on the main page
        // if wizard
        sections: [
            {title:'Step 1',sub_title:'Project Name',id:'1'},
            {title:'Step 2',sub_title:'Hazard of Concern',id:'2'},
            {title:'Step 3',sub_title:'Describe Solution',id:'3'},
            {title:'Step 4',sub_title:'Prioritization',id:'4'}
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
                section: ''
            },

        }
    }
];
