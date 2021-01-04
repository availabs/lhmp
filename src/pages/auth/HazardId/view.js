import React from 'react';
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import config from './config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';

class hazardidFormsView extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className='container'>
                <Element>
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
        path: `/hazardid/view/:id`,
        exact: true,
        name: 'Hazard ID',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Hazard ID', path: '/hazardid/' },
            { param: 'id', path: '/hazardid/view/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(hazardidFormsView))
    },
    {
        path: `/hazardid/view/:id`,
        exact: true,
        name: 'Hazard ID',
        auth: false,
        mainNav: false,
        breadcrumbs: [
            { name: 'Hazard ID', path: '/hazardid/' },
            { param: 'id', path: '/hazardid/view/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-dark',
            position: 'menu-position-top',
            layout: 'menu-layout-full',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(hazardidFormsView))
    }
]