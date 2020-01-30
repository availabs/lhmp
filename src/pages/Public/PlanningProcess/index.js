import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import config from "pages/auth/Plan/config/about-config";
import GraphFactory from "components/displayComponents/graphFactory";
import geoDropdown from 'pages/auth/Plan/functions'
import {falcorGraph} from "store/falcorGraph";
import {setActiveCousubid} from 'store/modules/user'

import { Element } from 'react-scroll'
import SideMenu from 'pages/Public/theme/SideMenu'

import ElementFactory from 'pages/Public/theme/ElementFactory'

import {
    PageContainer,
    PageHeader,
    StatementText, 
    HeaderImage,
    HeaderContainer,
    SectionBox,
    SectionHeader,
    ContentHeader,
    ContentContainer,
    SectionBoxMain,
    SectionBoxSidebar,
    SidebarCallout
    
} 
from 'pages/Public/theme/components'

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
    
    render() {
        let graph = this.props.graph
        let geoInfo = graph.geo
            && graph.geo[this.props.activeGeoid] ?
            graph.geo :
            null

        let allowedGeos = graph.geo &&
            graph.geo[this.props.activeGeoid] &&
            graph.geo[this.props.activeGeoid].cousubs &&
            graph.geo[this.props.activeGeoid].cousubs.value ?
            [this.props.activeGeoid, ...graph.geo[this.props.activeGeoid].cousubs.value] :
            [this.props.activeGeoid]

        return (
            <PageContainer>
                <div style={{position: 'fixed', left: 0, top: 0, paddingTop: 20,width: '220px', height: '100%'}}>
                    <SideMenu config={config}/>
                </div>
                <div style={{marginLeft: 220}}>
                    <HeaderContainer>
                        
                            <PageHeader>Planning Process</PageHeader>
                            {
                                /*
                                <span style={{float:'right'}}>
                                    {geoDropdown.geoDropdown(geoInfo,this.props.setActiveCousubid, this.props.activeCousubid,allowedGeos)}
                                </span>
                                */
                            }
                            
                            <div className="row">
                                <div className="col-12">
                                    <StatementText>
                                        The planning process is integral to understanding the approach to mitigation results.
                                    </StatementText>
                                </div>
                            </div>
                    </HeaderContainer>
                    <HeaderImage />
                    <ContentContainer>
                            
                            
                            <div className="row">
                                <div className="col-12">
                                    <div className="element-wrapper">
                                        {
                                            Object.keys(config).map(section => {
                                                return (
                                                    <div>
                                                        <SectionHeader>{section}</SectionHeader>
                                                        {
                                                            config[section].map(requirement => {
                                                                return (
                                                                    <ElementFactory 
                                                                        element={requirement} 
                                                                        user={this.props.user}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        
                    </ContentContainer>
                </div>
            </PageContainer>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        graph: state.graph
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
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(About))
}];

