import {connect} from "react-redux";
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import Element from 'components/light-admin/containers/Element'
import React from 'react';
import AvlFormsNewData from 'components/AvlForms/editComponents/newData.js'
import get from "lodash.get";
import ViewConfig from 'pages/auth/Participation/view_config.js'

class ParticipationFormsNew extends React.Component{
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
        path: '/participation/:sub_type/new/',
        exact: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Participation', path: '/participation/' },
            { name: 'sub_type',path:'/participation/'},
            { name: 'New Participation', path: '/participation/:sub_type/new/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        name: 'Create Participation',
        auth: true,
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ParticipationFormsNew))
    },
    {
        path: '/participation/:sub_type/edit/:id',
        name: 'Edit Participation',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            { name: 'Participation', path: '/participation/' },
            { name: 'sub_type',path:'/participation/'},
            { param: 'id', path: '/participation/:sub_type/edit' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ParticipationFormsNew))
    }

]