import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import config from './config/about-config'
import GraphFactory from "components/displayComponents/graphFactory";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {Stickyroll} from '@stickyroll/stickyroll';
import {Pagers} from "@stickyroll/pagers";
import CSS_CONFIG from 'pages/auth/css-config'

class AdminAbout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    renderElement(element, section, index) {
        return (
            <div style={{
                width: '100%',
                height: '100%',
            }}>
                <label> <big>{section}</big> | <small>{element.title}</small> </label>
                <GraphFactory
                    graph={{type: element.type + 'Editor'}}
                    {...element}
                    user={this.props.user}
                    index={index}
                />
            </div>
        )
    }

    renderReqNav(allRequirenments) {
        return (
            <ul className='ae-main-menu '>
                {
                    allRequirenments.map((f, f_i) =>
                        <li><a href={'#' + (parseInt(f_i) + 1)}>
                            <span style={{marginLeft: 0, 'word-break': 'break-word'}}>{f}</span>
                        </a></li>
                    )
                }
            </ul>
        )
    }

    render() {
        let PageList = [];
        let sections = {};
        let allRequirenments = [];
        Object.keys(config).map(section => {
            sections[section] = [];
            config[section].map((requirement, req_i) => {
                allRequirenments.push(requirement.title);
                PageList.push(this.renderElement(requirement, section, req_i));
                sections[section].push(PageList.length - 1)

            })
        });
        return (
            <div>
                {
                    <Stickyroll pages={PageList} anchors="">
                        {({page, pageIndex, pages, progress}) => {
                            let Content = PageList[pageIndex];

                            return (
                                <div>
                                    <div
                                        className='ae-side-menu'
                                        style={{
                                            height: '100vh',
                                            width: CSS_CONFIG.reqNavWidth,
                                            position: 'absolute',
                                            display: 'block',
                                            overflow: 'scroll',
                                        }}>
                                        {this.renderReqNav(allRequirenments)}
                                    </div>

                                    <div
                                        style={{
                                            width: `calc(100% - ${CSS_CONFIG.reqNavWidth}))`,
                                            height: '100%',
                                            marginLeft: `calc(${CSS_CONFIG.reqNavWidth})`,
                                            display: 'absolute',
                                            alignContent: 'stretch',
                                            alignItems: 'stretch',
                                        }}>
                                        <Pagers useContext={true}/>

                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow={page / pages}
                                             className="progress-bar bg-success" role="progressbar"
                                             style={{
                                                 width: page / pages * 100 + '%',
                                                 height: '15px'
                                             }}>{(page / pages * 100).toFixed(2)} %
                                        </div>

                                        <div style={{
                                            height: '100vh',
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
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AdminAbout))
}];

