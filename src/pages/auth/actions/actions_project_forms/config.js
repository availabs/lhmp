module.exports = [
    {
        type:'actions', // type is same as the route path for now
        list_attributes:['action_name','action_type','sub_type'], // to list the attributes on the main page
        // if wizard
        sections: [],
        attributes: {
            action_county:{
                sub_type:'project',
                prompt:'',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                section: '1'
            },
            action_jurisdiction:{
                sub_type:'project',
                prompt:'',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                depend_on:'county',
                section: '1'
            },
        }

    }
];
