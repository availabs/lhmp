import {connect} from "react-redux";
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import Element from 'components/light-admin/containers/Element'
import React from 'react';
import config from 'pages/auth/Capabilities/capability_forms/config.js'
import AvlFormsNewData from 'components/AvlForms/editComponents/newData.js'
import get from "lodash.get";

class CapabilitiesFormsNew extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Element>
                <h6 className="element-header">New Capability</h6>
                <AvlFormsNewData
                    json = {config}
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
        path: '/capabilities/new',
        exact: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Capabilities', path: '/capabilities/' },
            { name: 'New Capability', path: '/capabilities/new' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        name: 'Create Capability',
        auth: true,
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(CapabilitiesFormsNew))
    },
    {
        path: '/capabilities/edit/:id',
        name: 'Edit Capabilities',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            { name: 'Capabilities', path: '/capabilities/' },
            { param: 'id', path: '/capabilities/edit/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(CapabilitiesFormsNew))
    }

]