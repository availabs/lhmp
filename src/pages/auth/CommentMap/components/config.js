module.exports = [
    {
        type:'map_comment', // type is same as the route path for now
        list_attributes:['title','type'], // to list the attributes on the main page
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
            }
        }
    }
];