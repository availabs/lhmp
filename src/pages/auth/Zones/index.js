import React from 'react';
import AvlFormsListTable from 'components/AvlForms/displayComponents/listTable.js';
import config from 'pages/auth/Zones/config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick"


class ZonesFormsIndex extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return(
            <AvlFormsListTable
                json = {config}
                createButtons = {false}
                editButton = {true}
                viewButton = {true}
                deleteButton = {false}
            />
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
        path: '/zones/',
        exact: true,
        name: 'Zones',
        auth: true,
        mainNav: false,
        icon: 'os-icon-pencil-2',
        breadcrumbs: [
            { name: 'zones', path: '/zones/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ZonesFormsIndex))
    }
]