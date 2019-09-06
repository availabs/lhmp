import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import config from './config/about-config'
import GraphFactory from "components/displayComponents/graphFactory";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {Stickyroll} from '@stickyroll/stickyroll';
import {Pagers} from "@stickyroll/pagers";
import {Content} from "@stickyroll/inner";

class AdminAbout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    renderElement(element) {
        return (
            <div className='element-box'>
                <h6>{element.requirement}</h6>
                <GraphFactory
                    graph={{type: element.type + 'Editor'}}
                    {...element}
                    user={this.props.user}/>
            </div>
        )
    }


    render() {
        let PageList = [];
        let sections = {};
        Object.keys(config).map(section => {
            sections[section] = [];
            config[section].map(requirement => {
                PageList.push(this.renderElement(requirement));
                sections[section].push(PageList.length-1)

            })
        });
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">Admin About page</h4>
                    <div className="row">
                        <div className="col-12">
                            <div className="element-wrapper">
                                {
                                    <div>
                                        <Stickyroll pages={PageList}>
                                            {({page, pageIndex, pages, progress}) => {
                                                let Content = PageList[pageIndex];
                                                return (
                                                    <div>
                                                        <h6 className='element-header'>{
                                                            Object.keys(sections).filter( key => sections[key].indexOf(pageIndex) !== -1)[0]
                                                        }</h6>
                                                        <Pagers useContext={true}/>
                                                        <div style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'absolute',
                                                            alignContent: 'stretch',
                                                            alignItems: 'stretch',
                                                            marginLeft: 10
                                                        }}>
                                                            {Content}
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        </Stickyroll>
                                    </div>
                                }

                                {/*{
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
                                }*/}

                            </div>
                        </div>
                    </div>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
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
        {name: 'About', path: '/plan/about'}],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AdminAbout))
}];

