import React from 'react';
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import Element from 'components/light-admin/containers/Element'

import ViewConfig from './config.js'

class ActionsWorkSheetFormsView extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let config = ViewConfig
        return(
            <Element>
                <AvlFormsViewData
                    json = {config}
                    id = {[this.props.match.params.id]}
                />
            </Element>
        )
    }
}

export default [
    {
        path: `/action_status_update/view/:id`,
        exact: true,
        name: 'Actions',
        auth: true,
        mainNav: false,
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: ActionsWorkSheetFormsView
    }
]