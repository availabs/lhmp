
import React from 'react';
import Element from 'components/light-admin/containers/Element'
import AvlFormsNewDataWizard from 'components/AvlForms/editComponents/newDataWithWizard.js'
import ViewConfig from './config.js'

class ActionsWorksheetFormsNew extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let config = ViewConfig
        return(
            <Element>
                <h6 className="element-header">Actions </h6>
                <AvlFormsNewDataWizard
                json = {config}
                id = {[this.props.match.params.id]}
                />
            </Element>
        )
    }
}

export default [
    {
        icon: 'os-icon',
        path: '/action_status_update/new/',
        exact: true,
        mainNav: false,
        
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
        path: '/action_status_update/edit/:id',
        name: 'Edit Actions',
        mainNav: false,
        auth: true,
        exact: true,
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