import React from 'react';
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import config from 'pages/auth/Capabilities/capability_forms/config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick"


class CapabilitiesFormsView extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className='container'>
                <Element>
                    <h6 className="element-header">Capability</h6>
                    <AvlFormsViewData
                        json = {config}
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
        path: `/capabilities/view/:id`,
        exact: true,
        name: 'Capabilities',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'capabilities', path: '/capabilities/' },
            { param: 'id', path: '/capabilities/view/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(CapabilitiesFormsView))
    }
]