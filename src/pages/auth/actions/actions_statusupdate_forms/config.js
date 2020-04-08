
module.exports = [
    {
        type:'action_status_update', // type is same as the route path for now
        list_attributes:['action_name','action_type'], // to list the attributes on the main page
        // if wizard
        sections: [
            {title:'Step 1',sub_title:'Point of Contact',id:'1'},
            
        ],
        attributes: {
           
            action_name:{
                label:'Action Name',
                prompt:'Provide a name for the action. Be as concise and specific as possible.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'1',
                list_attribute: 'true'
            },
            
        }

    }
];
