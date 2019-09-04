import get from "lodash.get";
import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import Submenus from './planning-submenus'
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import {setActivePlan, setActiveGeoid, setUserToken} from 'store/modules/user'

class PlanningTools extends React.Component {

    constructor(props){
        super(props)
        this.state={
        }

    }

    render() {
        return (
            <div className='container'>
                <Element>
                    <h6 className="element-header">Planning Tools page</h6>
                    <div>
                        {Submenus[0].map(submenu => {
                            console.log(submenu)
                            return (
                                <a href={submenu.path}>
                                    <div className="element-box">
                                        {submenu.name}
                                    </div>
                                </a>
                            )
                        })}
                    </div>
                </Element>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    isAuthenticated: !!state.user.authed,
    authedPlans: state.user.authedPlans,
    attempts: state.user.attempts, // so componentWillReceiveProps will get called.
    plansList: get(state.graph, 'plans.county.byId',{}),
    token: state.user.token || null
});

const mapDispatchToProps = {
    sendSystemMessage,
    setActivePlan,
    setActiveGeoid,
    setUserToken
};

export default [
    {
        icon: 'os-icon-pencil-2',
        path: '/tools/',
        exact: true,
        name: 'PlanningTools',
        auth: true,
        authLevel: 1,
        mainNav: true,
        subMenus: Submenus,
        breadcrumbs: [
            {name: 'PlanningTools', path: '/tools/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default',
        },
        component: connect(mapStateToProps,mapDispatchToProps)(PlanningTools)
    }
]