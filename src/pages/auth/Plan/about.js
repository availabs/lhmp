import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux'
import Element from 'components/light-admin/containers/Element'
import config from './config/about-config'
import ContentEditor from 'components/displayComponents/contentEditor'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Submenus from './plan-submenus'


class AdminAbout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    renderElement (element) {
        return (
            <div className='element-box'>
                <h6>{element.requirement}</h6>
                <ContentEditor {...element} user={this.props.user} />
            </div>
        )
    }


    render() {
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">Admin About page</h4>
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
    icon: 'os-icon-pencil-2',
    path: '/plan/about',
    exact: true,
    name: 'AdminAbout',
    auth: true,
    authLevel: 1,
    mainNav: false,
    breadcrumbs: [
        { name: 'About', path: '/plan/about' }],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AdminAbout))
}];

