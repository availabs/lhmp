module.exports = [
    {
        type:'hazardid', // type is same as the route path for now
        list_attributes:['community_name','hazard_concern','previous_occurrence', 'future_occurrence', 'loss_life_property', 'extent_description', 'location_description'],
        csv_download: ['county', 'community_name','hazard_concern','previous_occurrence', 'future_occurrence', 'loss_life_property', 'extent_description', 'location_description'],
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
                prompt:'Select a hazard of concern.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
            },
            concern_level:{
                label:'What is your level of concern about this hazard',
                prompt:'In your view what is your jurisdictional concern regarding this hazard. Please rate concern for this hazard on a scale of High, Medium, Low. ',
                sub_type:'',
                edit_type:'dropdown_no_meta',
                edit_type_values: ['High','Medium','Low'],
                display_type:'text',
                meta: 'false',
            },
            future_occurrence:{
                label:'Do you feel that this hazard is likely to occur again in the next 5-10 years?',
                prompt:'Likelihood of future orrurences are measured as High, Medium, Low on a sacle of 1 to 10. 1-3 is Low, 4-7 is Medium and 8-10 is High. Please indicate using H/M/L the likeliness of this hazard happening in the future.',
                sub_type:'',
                edit_type:'dropdown_no_meta',
                edit_type_values: ['High','Medium', 'Low'],
                display_type:'text',
                meta: 'false',
            },
            extent_description:{
                label:'Magnitude/Extent Description',
                prompt:'Extent is the strength or magnitude of the hazard. Extent can be described in a combination of ways depending on the hazard, such as:• The value on an established scientific scale or measurement system, such as EF2 on the Enhanced Fujita Scale for tornadoes or 5.5 on the Richter Scale for earthquakes. • Other measures of magnitude, such as water depth or wind speed.• The speed of onset. For example, hurricanes have longer warning times, giving people and governments more time to prepare and evacuate, while earthquakes occur without warning. • The duration of hazard events. For most hazards, the longer the duration of an event, the greater the extent. Flooding that peaks and retreats in a matter of hours is typically less damaging than flooding of the same depth that remains in place for days.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
            },
            location_description:{
                label:'Location Description',
                prompt:'Location is the geographic areas within the planning area that are affected by the hazard, such as a floodplain. Hazard areas may be further defined, such as high wildfire hazard areas versus low wildfire hazard areas. The entire planning area may be uniformly affected by some hazards, such as drought or winter storm. Although maps are usually the best way to illustrate location for many hazards, location may be described in other formats, such as a narrative.',
                sub_type:'',
                edit_type:'text', // the values you would like to see as options for radio buttons
                disable_condition:'',
                display_condition:'',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
            affected_climate_change:{
                label:'Does Climate Change affect this Hazard? How?',
                prompt:'Please indicate whether and how Climate Change affects the duration, intensity, and occurrence of this hazard.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
            },
            impact_description:{
                label:'Hazard Impact Description',
                prompt:'Describe in detail the effects this hazard had in your community.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
            },
            case_study:{
                label:'Example Event or Case Study',
                prompt:'Please provide a description of a specific hazard event and the effects it had on your community. Provide URLs to news media and/or vides if possible.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
            }   
        }
    }
];
