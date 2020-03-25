import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import config from "pages/auth/Plan/config/about-config";
import {RenderConfig} from 'pages/Public/theme/ElementFactory'

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
    SidebarCallout,
    HeaderImageContainer
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
                    {console.log('passing config', config)}
                    <SideMenu config={config} filterAdmin={true}/>
                </div>
                <div style={{marginLeft: 220}}>
                    <HeaderImageContainer>
                        <div style={{width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', padding: 50}}>
                            <PageHeader style={{color: '#efefef'}}>Planning Process</PageHeader>
                            <div className="row">
                                <div className="col-12">
                                    <StatementText>
                                        <RenderConfig
                                            config={{'Planning Context Quote':config['Header'].filter(f => f.title === 'Planning Process Quote')}}
                                            user={this.props.user}
                                            showTitle={false}
                                            showHeader={false}
                                            pureElement={true}
                                        />
                                    </StatementText>
                                </div>
                            </div>
                        </div>
                    </HeaderImageContainer>
                    <ContentContainer>
                            
                            
                            <div className="row">
                                <div className="col-12">
                                    <div className="element-wrapper">
                                        {
                                            Object.keys(config)
                                                .filter(section => config[section].filter(item => !item.onlyAdmin).length > 0)
                                                .map(section => {
                                                return (
                                                    <div>
                                                        <SectionHeader>{section}</SectionHeader>
                                                        {
                                                            config[section]
                                                                .filter(item => !item.onlyAdmin)
                                                                .map(requirement => {
                                                                return (
                                                                    <ElementFactory 
                                                                        element={requirement} 
                                                                        user={this.props.user}
                                                                        autoLoad={true}
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

