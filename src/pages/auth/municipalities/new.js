import {connect} from "react-redux";
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import Element from 'components/light-admin/containers/Element'
import React from 'react';
import config from './config.js'
import AvlFormsNewData from 'components/AvlForms/editComponents/newData.js'
import get from "lodash.get";

class MunicipalitiesFormsNew extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Element>
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
        path: '/municipalities/new',
        exact: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Municipalities', path: '/municipalities/' },
            { name: 'New Municipalities', path: '/municipalities/new' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        name: 'Create Municipality',
        auth: true,
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(MunicipalitiesFormsNew))
    },
    {
        path: '/municipalities/edit/:id',
        name: 'Edit Municipality',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            { name: 'Municipalities', path: '/municipalities/' },
            { param: 'id', path: '/municipalities/edit/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(MunicipalitiesFormsNew))
    }

]