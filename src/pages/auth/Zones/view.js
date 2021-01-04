import React from 'react';
import AvlFormsViewDataZones from 'components/AvlForms/displayComponents/viewDataZones';
import config from 'pages/auth/Zones/config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';


class ZonesFormsView extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className='container'>
                <Element>
                    <AvlFormsViewDataZones
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
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: `/zones/view/:id`,
        exact: true,
        name: 'Zones',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'zones', path: '/zones/' },
            { param: 'id', path: '/zones/view/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ZonesFormsView))
    },
    {
        path: `/zones/view/:id`,
        exact: true,
        name: 'Zones',
        auth: false,
        mainNav: false,
        breadcrumbs: [
            { name: 'zones', path: '/zones/' },
            { param: 'id', path: '/zones/view/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-dark',
            position: 'menu-position-top',
            layout: 'menu-layout-full',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ZonesFormsView))
    }
]