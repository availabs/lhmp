module.exports = [{
    type:'comments', // type is same as the route path for now
    list_attributes:[],
    default_title: 'Add a Comment', // in the case when page_title is invalid
    page_title: '', // page title in edit and view
    sub_title: 'Add a Comment', // sub title in edit and view
    sub_type:'',
    sections: [],
    attributes: {
        type:{
            label:'Type',
            prompt:'',
            edit_type:'dropdown_no_meta',
            edit_type_values : ['Required Revision','Opportunity for improvement','Strengths'],
            display_condition : '',
            display_type:'text',
            meta:'false',
            section:'',
            sub_type: ''
        },
        comment:{
            label:'Comment',
            prompt:'',
            sub_type:'',
            edit_type:'contentEditor',
            display_type:'contentViewer',
            meta:'false',
            hidden:'false',
            section:'',
        },
        user:{
            label:'user',
            prompt:'',
            sub_type:'',
            edit_type:'textarea',
            display_type:'text',
            meta:'false',
            hidden:'true',
            section:'',
        },
        geoid:{
            label:'geoid',
            prompt:'',
            sub_type:'',
            edit_type:'textarea',
            display_type:'text',
            meta:'false',
            hidden:'true',
            section:'',
        },
        element:{
            label:'geoid',
            prompt:'',
            sub_type:'',
            edit_type:'textarea',
            display_type:'text',
            meta:'false',
            hidden:'true',
            section:'',
        },
        created_at:{
            label:'created_at',
            prompt:'',
            sub_type:'',
            edit_type:'hidden',
            display_type:'text',
            meta:'false',
            hidden:'false',
            section:'',
        },
    }
}]