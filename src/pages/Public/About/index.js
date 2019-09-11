import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux'
import Element from 'components/light-admin/containers/Element'
import config from "pages/auth/Plan/config/about-config";
import GraphFactory from "components/displayComponents/graphFactory";

class About extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    renderElement (element) {
        return (
            <div className='element-box'>
                <h6>{element.title}</h6>
                <GraphFactory
                    graph={{type: element.type + 'Viewer'}}
                    {...element}
                    user={this.props.user}/>
            </div>
        )
    }

    render() {
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">About page</h4>
                    <div className="row">
                        <div className="col-sm-8 col-xxxl-6">
                            <div className="element-wrapper">
                                {
                                    Object.keys(config).map(section => {
                                        return (
                                            <div>
                                                <h6 className='element-header'>{section}</h6>
                                                {
                                                    config[section].map(requirement => {
                                                        return this.renderElement(requirement)
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
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
    path: '/about',
    exact: true,
    name: 'About',
    auth: false,
    mainNav: true,
    breadcrumbs: [
        { name: 'About', path: '/about' }],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-top',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(About))
}];

