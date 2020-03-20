module.exports = [
    {
        type:'evacuation_route', // type is same as the route path for now
        list_attributes:['route_name','geom'], // to list the attributes on the main page
        sub_type:'',
        sections: [],
        attributes: {
            route_name:{
                label:'Route Name',
                sub_type:'',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta: 'false',
                section: ''
            },
            geom:{
                label:'Geometry',
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
