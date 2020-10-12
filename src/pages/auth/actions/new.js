import React from 'react';
import Element from 'components/light-admin/containers/Element'
import WorksheetConfig from 'pages/auth/actions/actions_worksheet_forms/config.js'
import AvlFormsNewDataWizard from 'components/AvlForms/editComponents/newDataWithWizard.js'
import ViewConfig from 'pages/auth/actions/view_config.js'
import ProjectMeta from 'pages/auth/actions/actions_project_forms/meta.js'

class ActionsWorksheetFormsNew extends React.Component{
    constructor(props){
        super(props);
    }

    chooseConfig(){
        let view_config = ViewConfig;
        let result = []
        Object.keys(view_config).forEach(config =>{
            view_config[config].forEach(item =>{
                if(item.attributes){
                    Object.values(item.attributes).forEach(d =>{
                        if(this.props.match.params.sub_type === d.sub_type){
                            result =  view_config[d.sub_type + '_config']
                        }
                    })
                }
            })
        });
        return result
    }

    render(){
        let config = this.chooseConfig();
        return(
            <Element>
                <AvlFormsNewDataWizard
                json = {config}
                meta = {ProjectMeta}
                id = {[this.props.match.params.id]}
                submitOnAll={true}
                />
            </Element>
        )
    }
}

export default [
    {
        icon: 'os-icon',
        path: '/actions/:sub_type/new/',
        exact: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Actions', path: '/actions/' },
            { name: 'sub_type',path:'/actions/'},
            { name: 'New Worksheet', path: '/actions/:sub_type/new/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        name: 'Create Actions',
        auth: true,
        component: ActionsWorksheetFormsNew
    },
    {
        path: '/actions/:sub_type/edit/:id',
        name: 'Edit Actions',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            { name: 'Actions', path: '/actions/' },
            { name: 'sub_type',path:'/actions/'},
            { param: 'id', path: '/actions/:sub_type/edit' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: ActionsWorksheetFormsNew
    }

]