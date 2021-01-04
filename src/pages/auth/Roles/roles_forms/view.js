import React from 'react';
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import config from 'pages/auth/Roles/roles_forms/config.js'
import participationTableSubConfig from "./participationTableSubConfig";
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';

class RolesFormsView extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className='container'>
                <Element>
                    <AvlFormsViewData
                        json = {config}
                        subJson = {participationTableSubConfig}
                        id = {[this.props.match.params.id]}
                    />
                </Element>
            </div>
        )
    }
}

const mapStateToProps = state => (
    {
        activePlan : state.user.activePlan,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        capabilities: get(state.graph,'capabilitiesLHMP.byId',{})// so componentWillReceiveProps will get called.
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: `/roles/view/:id`,
        exact: true,
        name: 'Roles',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'roles', path: '/roles/' },
            { param: 'id', path: '/roles/view/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(RolesFormsView))
    },
    {
        path: `/roles/view/:id/p`,
        exact: true,
        name: 'Roles',
        auth: false,
        mainNav: false,
        breadcrumbs: [
            { name: 'roles', path: '/roles/' },
            { param: 'id', path: '/roles/view/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-dark',
            position: 'menu-position-top',
            layout: 'menu-layout-full',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(RolesFormsView))
    }
]