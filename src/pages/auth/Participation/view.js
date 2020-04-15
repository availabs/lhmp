import React from 'react';
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import ViewConfig from 'pages/auth/Participation/view_config.js'

class ParticipationFormsView extends React.Component{
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
        })
        return result
    }

    render(){
        let config = this.chooseConfig();

        return(
            <div className='container'>
                <Element>
                    <h6 className="element-header">Participation {this.props.match.params.sub_type}</h6>
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
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: `/participation/view/:sub_type/:id`,
        exact: true,
        name: 'Actions',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'participation', path: '/participation/' },
            { param: 'id', path: '/participation/view/:sub_type' },
            { param: 'sub_type',path:'/participation/view/'}
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ParticipationFormsView))
    }
]