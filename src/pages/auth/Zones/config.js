module.exports = [
    {
        type: 'zones', // type is same as the route path for now
        list_attributes: ['name'],
        //csv_download: ['capability_category', 'capability_type', 'capability_name', 'regulatory_name', 'municipality', 'capability_description', 'adoption_date', 'development_update', 'jurisdiction_utilization', 'mitigation_contribution', 'adopting_authority', 'responsible_authority', 'support_authority', 'affiliated_agency', 'link_url', 'upload'],
        sub_type: '',
        // if wizard
        sections: [],
        attributes: {
            name:{
                label:'Zone Name',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                show:'true',
                meta:'false',
                hidden:'false',
                section:'',
                list_attribute: 'true'
            },
            zone_type:{
                label:'Zone Type',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                show:'true',
                meta:'false',
                hidden:'false',
                section:'',
                list_attribute: 'true'
            },
            comment:{
                label:'Comment',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                show:'true',
                meta:'false',
                hidden:'false',
                section:'',
                list_attribute: 'true'
            },

        }
    }
];
