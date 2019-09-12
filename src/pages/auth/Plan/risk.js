import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import config from './config/risk-config'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import functions from "./functions";

class AdminRisk extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return functions.render(config, this.props.user)
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
    path: '/plan/risk',
    exact: true,
    name: 'AdminRisk',
    auth: true,
    authLevel: 1,
    mainNav: false,
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AdminRisk))
}];

