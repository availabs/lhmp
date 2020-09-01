module.exports = [
    {
        type: 'zones', // type is same as the route path for now
        list_attributes: ['name','zone_type'],
        //csv_download: ['capability_category', 'capability_type', 'capability_name', 'regulatory_name', 'municipality', 'capability_description', 'adoption_date', 'development_update', 'jurisdiction_utilization', 'mitigation_contribution', 'adopting_authority', 'responsible_authority', 'support_authority', 'affiliated_agency', 'link_url', 'upload'],
        sub_type: '',
        // if wizard
        sections: [],
        attributes: {
            name:{
                label:'Zone Name',
                prompt:'',
                sub_type:'',
                edit_type: 'hidden',
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
                edit_type:'dropdown',
                display_type:'text',
                show:'true',
                meta:'true',
                meta_filter:{
                    filter_key:'',
                    value:['Select All', 'Zone A', 'Zone B', 'Zone C']
                },
                hidden:'false',
                section:'',
                list_attribute: 'true'
            },
            actions:{
                label:'Actions',
                sub_type:'',
                prompt:'',
                edit_type:'AvlFormsJoin',
                display_type:'AvlFormsJoin',
                parentConfig: 'zones',
                targetConfig: 'actions',
                hidden:'false',
                meta:'false',
                section:'',
            },
            comment:{
                label:'Comment',
                prompt:'',
                sub_type:'',
                edit_type:'textarea',
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
