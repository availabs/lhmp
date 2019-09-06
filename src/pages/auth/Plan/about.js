import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import config from './config/about-config'
import GraphFactory from "components/displayComponents/graphFactory";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {Stickyroll} from '@stickyroll/stickyroll';
import {Pagers} from "@stickyroll/pagers";

class AdminAbout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    renderElement(element) {
        return (
            <div className='element-box' style={{
                width: '100%',
                height: '100%',
            }}>
                <h6>{element.requirement}</h6>
                <GraphFactory
                    graph={{type: element.type + 'Editor'}}
                    {...element}
                    user={this.props.user}/>
            </div>
        )
    }

    renderReqNav(allRequirenments) {
        return (
            <table>
                <tbody>
                {
                    allRequirenments.map(f =>
                        <tr> <td> {f} </td> </tr>
                    )
                }{
                    allRequirenments.map(f =>
                        <tr> <td> {f} </td> </tr>
                    )
                }{
                    allRequirenments.map(f =>
                        <tr> <td> {f} </td> </tr>
                    )
                }
                </tbody>
            </table>
        )
    }
    render() {
        let PageList = [];
        let sections = {};
        let allRequirenments = [];
        Object.keys(config).map(section => {
            sections[section] = [];
            config[section].map(requirement => {
                allRequirenments.push(requirement.requirement)
                PageList.push(this.renderElement(requirement));
                sections[section].push(PageList.length - 1)

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
                                        <Stickyroll pages={PageList} anchors="">
                                        {({page, pageIndex, pages, progress}) => {
                                            let Content = PageList[pageIndex];
                                            return (
                                                <div>
                                                <div
                                                    className='element-box table-responsive'
                                                    style={{
                                                        height: '80%',
                                                        width: '15%',
                                                        float: 'left',
                                                        display: 'block',
                                                        overflow: 'hidden',
                                                        'overflow-y': 'scroll'

                                                    }}>
                                                    {this.renderReqNav(allRequirenments)}
                                                </div>

                                                <div
                                                    style={{
                                                    width: '80%',
                                                    height: '100%',
                                                    display: 'absolute',
                                                    alignContent: 'stretch',
                                                    alignItems: 'stretch',
                                                    float: 'right'
                                                }}>
                                                    <h6 className='element-header'>{
                                                        Object.keys(sections).filter(key => sections[key].indexOf(pageIndex) !== -1)[0]
                                                    }</h6>
                                                    <Pagers useContext={true}/>

                                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow={page/pages}
                                                             className="progress-bar bg-success" role="progressbar"
                                                             style={{width: page/pages * 100 + '%', height:'15px'}}>{(page/pages * 100).toFixed(2)} % </div>
                                                    <div style={{
                                                        height: '100%',
                                                        width: '100%',
                                                    }}>
                                                        {Content}
                                                    </div>
                                                </div>
                                                </div>
                                            );
                                        }}
                                    </Stickyroll>
                                    }
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

