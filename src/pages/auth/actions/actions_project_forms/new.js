import {connect} from "react-redux";
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import Element from 'components/light-admin/containers/Element'
import React from 'react';
import WorksheetConfig from 'pages/auth/actions/actions_worksheet_forms/config.js'
import AvlFormsNewDataWizard from 'components/AvlForms/editComponents/newDataWithWizard.js'
import get from "lodash.get";

class ActionsProjectFormsNew extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        return(
            <Element>
                <h6 className="element-header">Actions Project</h6>
                <AvlFormsNewDataWizard
                    json = {WorksheetConfig}
                    id = {[this.props.match.params.id]}
                />
            </Element>
        )
    }
}

const mapDispatchToProps = {
    sendSystemMessage
};

const mapStateToProps = state => {
    return {
        activePlan: state.user.activePlan,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        capabilitiesMeta : get(state.graph,'capabilitiesLHMP.meta',{}),
        countyData: get(state.graph,'geo',{})

    };
};

export default [
    {
        icon: 'os-icon',
        path: '/actions/new/',
        exact: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Actions', path: '/actions/' },
            { name: 'New Project', path: '/actions/new/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        name: 'Create Actions Project',
        auth: true,
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ActionsProjectFormsNew))
    },
    {
        path: '/actions/edit/:id',
        name: 'Edit Actions Project',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            { name: 'Actions', path: '/actions/' },
            { param: 'id', path: '/actions/new/edit' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ActionsProjectFormsNew))
    }

]