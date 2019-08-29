import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux'
import Element from 'components/light-admin/containers/Element'
import Submenus from './plan-submenus'
class AdminStrategies extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">Admin About page</h4>
                    <div className="row">
                        <div className="col-sm-8 col-xxxl-6">
                            <div className="element-wrapper">
                                <div className="element-box">

                                </div>
                            </div>
                        </div>
                    </div>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router
    };
};

const mapDispatchToProps = {};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/plan/strategies',
    exact: true,
    name: 'AdminStrategies',
    auth: true,
    authLevel: 1,
    mainNav: false,
    breadcrumbs: [
        { name: 'Strategies', path: '/plan/strategies' }],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AdminStrategies))
}];

