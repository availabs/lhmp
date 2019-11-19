module.exports = [
    {
        type:'actions', // type is same as the route path for now
        list_attributes:['action_name','action_type','sub_type'], // to list the attributes on the main page
        // if wizard
        sections: [],
        /*
        attributes: {
            :{
                prompt:'Choose the county the capability is located from the list of all counties.',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                section: ''
            },
            municipality:{
                prompt:'Choose the jurisdiction where the capability is located. Jurisdictions that occur are based on the County selected in question 1',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                depend_on:'county',
                section: ''
            },
        }
         */
    }
];
