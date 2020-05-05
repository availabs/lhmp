module.exports = [
    {
        type:'map_comment', // type is same as the route path for now
        list_attributes:['title','type','point','comment'], // to list the attributes on the main page
        sub_type:'',
        sections: [],
        attributes: {
            title:{
                label:'Title',
                sub_type:'',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta: 'false',
                section: '',
                hidden: 'false'
            },
            type:{
                label:'Type',
                sub_type:'',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta: 'false',
                section: '',
                hidden: 'false'
            },
            point:{
                label:'Point',
                sub_type:'',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta: 'false',
                section: '',
                hidden: 'true'
            },
            comment:{
                label:'Comment',
                sub_type:'',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta: 'false',
                section: '',
                hidden: 'true'
            }
        }
    }
];