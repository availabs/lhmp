import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux'
import Element from 'components/light-admin/containers/Element'
import config from "pages/auth/Plan/config/strategies-config";
import GraphFactory from "components/displayComponents/graphFactory";

class Strategies extends React.Component {

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
                    <h4 className="element-header">Strategies page</h4>
                    <div className="row">
                        <div className="col-12">
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
    icon: '',
    path: '/strategies',
    exact: true,
    name: 'Strategies',
    auth: false,
    mainNav: true,
    breadcrumbs: [
        { name: 'Strategies', path: '/strategies' }],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Strategies))
}];

