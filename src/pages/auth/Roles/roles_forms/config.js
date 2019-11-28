module.exports = [
    {
        type:'roles',
        list_attributes : ['contact_title_role','contact_department','contact_agency','contact_county','contact_municipality'],
        combine_list_attributes:{attributes:['contact_county','contact_municipality'],result:'Jurisidiction'},
        sub_type:'',
        sections:[],
        /*
        attributes:{

        }
         */
    }
];