import React from 'react';
import AvlFormsListTable from 'components/AvlForms/displayComponents/listTable.js';
import config from './config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick"


class MunicipalitiesFormsIndex extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return(
            <AvlFormsListTable
                json = {config}
                createButtons = {true}
                editButton = {true}
                viewButton = {true}
                deleteButton = {true}
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
        path: '/municipalities/',
        exact: true,
        name: 'Municipalities',
        auth: true,
        mainNav: true,
        icon: 'os-icon-pencil-2',
        breadcrumbs: [
            { name: 'Municipalities', path: '/municipalities/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(MunicipalitiesFormsIndex))
    }
]