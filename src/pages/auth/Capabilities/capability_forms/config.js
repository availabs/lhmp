module.exports = [
    {
        type: 'filterJurisdictions', // type is same as the route path for now
        list_attributes: [
            {'municipality': {filter: 'multi'}},
        ],
        // if wizard
        sections: [],
        attributes: {
            county: {
                label: 'County', // Which you would like to see on the form
                prompt: 'Choose county',
                sub_type: '',
                edit_type: 'dropdown',
                display_type: 'text',
                area: 'true',
                meta: 'true',
                //hidden:'false',
                section: '',
                //field_required:"required",
            },
            municipality: {
                label: 'Filter',
                prompt: 'Choose the jurisdiction(s) to hide',
                sub_type: '',
                edit_type: 'dropdown',
                addAll: 'true', // to give add all option to multiselect
                defaultValue: ['Countywide'],
                display_type: 'text',
                meta: 'true',
                area: 'true',
                depend_on: 'county',
                hidden: 'false',
                section: ''
            },

        }
    }
];
