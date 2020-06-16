module.exports = [
    {
        type:'hazardid', // type is same as the route path for now
        list_attributes:['community_name','hazard_concern','previous_occurence', 'future_occurence', 'loss_life_property', 'extent_description', 'location_description'],
        csv_download: ['county', 'community_name','hazard_concern','previous_occurence', 'future_occurence', 'loss_life_property', 'extent_description', 'location_description'],
        default_title: 'Hazard ID', // in the case when page_title is invalid
        page_title: 'community_name', // page title in edit and view
        sub_title: '', // sub title in edit and view
        sub_type:'',
        // if wizard
        sections: [],
        attributes: {
            county:{
                label:'County', // Which you would like to see on the form
                prompt:'Choose the county the capability is located from the list of all counties.',
                sub_type:'',
                edit_type:'dropdown',  
                display_type:'text',
                area:'true',
                meta: 'true',
                //hidden:'false',
                section: '',
                //field_required:"required",
            },
            community_name:{
                label:'Jurisdiction',
                prompt:'Choose the jurisdiction where the capability is located. Jurisdictions that occur are based on the County selected in question 1',
                sub_type:'',
                edit_type:'dropdown',
                defaultValue: ['Countywide'],
                display_type:'text',
                meta: 'true',
                area:'true',
                depend_on:'county',
                hidden:'false',
                section: ''
            },
            hazard_concern: {
                label:'Hazard of Concern',
                prompt:'Identify the hazards of concern for your jurisdiction.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
            },
            previous_occurrence:{
                label:'Previous Hazard Occurrence',
                prompt:'Prevoious occurences are measured as High, Medium, Low on a scale of 1 to 10. 1-3 is Low, 4-7 is Medium, and 8-10 is High. Please indicate using H/M/L the level at which this hazard has previously occurred. ',
                sub_type:'',
                edit_type:'dropdown_no_meta',
                edit_type_values: ['High','Medium','Low'],
                display_type:'text',
                meta: 'false',
            },
            future_occurrence:{
                label:'Likelihood of Future Occurrence',
                prompt:'Likelihood of future orrurences are measured as High, Medium, Low on a sacle of 1 to 10. 1-3 is Low, 4-7 is Medium and 8-10 is High. Please indicate using H/M/L the likeliness of this hazard happening in the future.',
                sub_type:'',
                edit_type:'dropdown_no_meta',
                edit_type_values: ['High','Medium', 'Low'],
                display_type:'text',
                meta: 'false',
            },
            loss_life_property:{
                label:'Loss of Life and Property',
                prompt:'Loss of Life and Property are measured as High, Medium, Low on a scale of 1 to 10. 1-3 is Low 4-7 is Medium and 8-10 is High. Please indicating using H/M/L the level of loss your jurisdiction has experienced as a result of a hazard event. .',
                sub_type:'',
                edit_type:'dropdown_no_meta',
                edit_type_values:['High','Medium','Low'],
                display_type:'text',
                meta: 'false',
            },
            extent_description:{
                label:'General Area of This Hazard  .',
                prompt:'Please describe the scale of this hazard, and the areas it typically covers.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
            },
            location_description:{
                label:'Local Description',
                prompt:'Identify with a yes or no if the participating community is a tribal nation.',
                sub_type:'',
                edit_type:'text', // the values you would like to see as options for radio buttons
                disable_condition:'',
                display_condition:'',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
        }
    }
];
