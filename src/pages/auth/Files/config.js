module.exports = [
    {
        type:'files', // type is same as the route path for now
        list_attributes:['name', 'tag', 'upload'],
        csv_download: ['name', 'tag', 'upload'],
        default_title: 'Files', // in the case when page_title is invalid
        page_title: 'name', // page title in edit and view
        sub_title: 'tag', // sub title in edit and view
        sub_type:'',
        // if wizard
        sections: [],
        attributes: {
            name:{
                label:'File Name',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                show:'true',
                meta:'false',
                hidden:'false',
                section:''
            },
            tag:{
                label:'Tags',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                show:'true',
                meta:'false',
                hidden:'false',
                section:''
            },
            upload:{
                label:'Upload',
                prompt:'',
                sub_type:'',
                edit_type:'file',
                display_type:'url',
                meta:'false',
                hidden:'false',
                data:'true',
                section:''
            }
        }
    }
];
