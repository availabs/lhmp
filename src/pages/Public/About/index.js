import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import config from "pages/auth/Plan/config/about-config";
import GraphFactory from "components/displayComponents/graphFactory";
import geoDropdown from 'pages/auth/Plan/functions'
import {falcorGraph} from "store/falcorGraph";
import {setActiveCousubid} from 'store/modules/user'

import {StatementText, HeaderImage} from 'pages/Public/theme/components'

class About extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    fetchFalcorDeps() {
        if (!this.props.activeGeoid) return Promise.resolve();
        return this.props.falcor.get(
            ['geo', this.props.activeGeoid, 'cousubs']
        )
            .then(response => {
                console.log(response,falcorGraph.getCache().geo[this.props.activeGeoid])
                return this.props.falcor.get(
                    ['geo', [this.props.activeGeoid, ...falcorGraph.getCache().geo[this.props.activeGeoid].cousubs.value], ['name']],
                )
            })
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
        let geoInfo = falcorGraph.getCache().geo
        && falcorGraph.getCache().geo[this.props.activeGeoid] ?
            falcorGraph.getCache().geo :
            null
        let allowedGeos = falcorGraph.getCache().geo &&
        falcorGraph.getCache().geo[this.props.activeGeoid] &&
        falcorGraph.getCache().geo[this.props.activeGeoid].cousubs &&
        falcorGraph.getCache().geo[this.props.activeGeoid].cousubs.value ?
            [this.props.activeGeoid, ...falcorGraph.getCache().geo[this.props.activeGeoid].cousubs.value] :
            [this.props.activeGeoid]
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">Planning Process
                    {
                        /*
                        <span style={{float:'right'}}>
                            {geoDropdown.geoDropdown(geoInfo,this.props.setActiveCousubid, this.props.activeCousubid,allowedGeos)}
                        </span>
                        */
                    }
                    </h4>
                    <div className="row">
                        <div className="col-12">
                            <StatementText>
                                The planning process is integral to understanding the approach to mitigation results.
                            </StatementText>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                           <HeaderImage />
                        </div>
                    </div>
                    
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
        router: state.router,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
    };
};

const mapDispatchToProps = {setActiveCousubid};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/planning-process',
    exact: true,
    name: 'Planning Process',
    auth: false,
    mainNav: true,
    breadcrumbs: [
        { name: 'Planning Process', path: '/planning-process' }],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(About))
}];

