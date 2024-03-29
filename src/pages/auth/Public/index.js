import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux'
import Element from 'components/light-admin/containers/Element'
import {authGeoid} from "../../../store/modules/user";

class Public extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.geoid
        }
    }


    render() {
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">Public page</h4>
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
        router: state.router,
        geoid: state.user.activeGeoid ?
                state.user.activeGeoid :
                localStorage.getItem('geoId')
    };
};

const mapDispatchToProps = {
    authGeoid
};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/',
    exact: true,
    name: 'Public',
    auth: true,
    authLevel: 0,
    mainNav: false,
    breadcrumbs: [
        { name: 'Public', path: '/' },
        { param: 'geoid', path: '/' }
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Public))
}];

