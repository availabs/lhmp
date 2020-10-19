module.exports = [
    {
        type: 'zones', // type is same as the route path for now
        list_attributes: [
            {'action_jurisdiction': {filter: 'multi'}},
            {'name': {filter: 'true'}},
            {'zone_type': {filter: 'multi'}},
            {'comment': {filter: 'true'}},
        ],
        //csv_download: ['capability_category', 'capability_type', 'capability_name', 'regulatory_name', 'municipality', 'capability_description', 'adoption_date', 'development_update', 'jurisdiction_utilization', 'mitigation_contribution', 'adopting_authority', 'responsible_authority', 'support_authority', 'affiliated_agency', 'link_url', 'upload'],
        sub_type: '',
        // if wizard
        sections: [],
        attributes: {
            action_county:{
                label:' Action County',// which you would like to see on the form
                sub_type:'project',
                prompt:'Select the county where the action takes place. If the action is located' +
                    ' in a different county you can select it by clicking the dropdown.',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                area : 'true',
                section: '3',
            },
            action_jurisdiction:{
                label:' Action Jurisdiction',// which you would like to see on the form
                sub_type:'project',
                prompt:'Provide the name of the Town, Village or City where the action is located.' +
                    ' For example; Sullivan County has adopted a hazard mitigation plan, the Town of Callicoon' +
                    ' is the jurisdiction location of the specific action,' +
                    ' such as acquiring emergency generators for critical facilities.',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                depend_on:'action_county',
                area : 'true',
                section: '3',
                defaultValue: ['Countywide'],
            },
            name:{
                label:'Zone Name',
                prompt:'',
                sub_type:'',
                edit_type: 'text',
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
                    value:[
                        'Select All',
                        'Recent Development Zone', 
                        'Future Development Zone', 
                        'Historic Distric',
                        'Relocation Zone',
                        'Jurisdiction',
                        'Area of Concern',
                        'Vulnerable Population',
                        'Other'
                    ]
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
