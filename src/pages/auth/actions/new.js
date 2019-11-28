import {connect} from "react-redux";
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import Element from 'components/light-admin/containers/Element'
import React from 'react';
import WorksheetConfig from 'pages/auth/actions/actions_worksheet_forms/config.js'
import AvlFormsNewDataWizard from 'components/AvlForms/editComponents/newDataWithWizard.js'
import get from "lodash.get";
import ViewConfig from 'pages/auth/actions/view_config.js'

class ActionsWorksheetFormsNew extends React.Component{
    constructor(props){
        super(props);
    }

    chooseConfig(){
        let view_config = ViewConfig;
        let result = []
        Object.keys(view_config).forEach(config =>{
            view_config[config].forEach(item =>{
                if(item.attributes){
                    Object.values(item.attributes).forEach(d =>{
                        if(this.props.match.params.sub_type === d.sub_type){
                            result =  view_config[d.sub_type + '_config']
                        }
                    })
                }
            })
        });
        return result
    }

    render(){
        let config = this.chooseConfig();
        let sub_type = '';
        config.forEach(item =>{
            Object.keys(item.attributes).forEach(d =>{
                if(item.attributes[d].sub_type.length > 0){
                    sub_type = item.attributes[d].sub_type
                }
            })
        })
        return(
            <Element>
                <h6 className="element-header">Actions {sub_type}</h6>
                <AvlFormsNewDataWizard
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
        path: '/actions/:sub_type/new/',
        exact: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Actions', path: '/actions/' },
            { name: 'sub_type',path:'/actions/'},
            { name: 'New Worksheet', path: '/actions/:sub_type/new/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        name: 'Create Actions',
        auth: true,
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ActionsWorksheetFormsNew))
    },
    {
        path: '/actions/:sub_type/edit/:id',
        name: 'Edit Actions',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            { name: 'Actions', path: '/actions/' },
            { name: 'sub_type',path:'/actions/'},
            { param: 'id', path: '/actions/:sub_type/edit' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ActionsWorksheetFormsNew))
    }

]