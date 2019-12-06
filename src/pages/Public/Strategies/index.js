import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import config from "pages/auth/Plan/config/strategies-config";
import GraphFactory from "components/displayComponents/graphFactory";
import geoDropdown from 'pages/auth/Plan/functions'
import {falcorGraph} from "store/falcorGraph";
import {setActiveCousubid} from 'store/modules/user'

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
    renderElement (element) {
        return (
            <SectionBox>
                {['right'].includes(element.align) ? 
                    <SectionBoxSidebar >
                        {element.callout ? <SidebarCallout>{element.callout}</SidebarCallout> : <span/>}
                    </SectionBoxSidebar>
                    : React.fragment
                }
                <SectionBoxMain>
                    <ContentHeader>{element.title}</ContentHeader>
                    <GraphFactory
                        graph={{type: element.type + 'Viewer'}}
                        {...element}
                        user={this.props.user}/>
                </SectionBoxMain>
                {['right', 'full'].includes(element.align) ? 
                    React.fragment :
                    <SectionBoxSidebar >
                        {element.callout ? <SidebarCallout>{element.callout}</SidebarCallout> : <span/>}
                    </SectionBoxSidebar>
                }
            </SectionBox>
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
            <PageContainer>
                <HeaderContainer>
                    
                        <PageHeader>Strategies</PageHeader>
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
                                    We are finding ways to reduce our risk by investing in mitigatoin.
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
                    
                </ContentContainer>
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
    };
};

const mapDispatchToProps = {setActiveCousubid};
export default [{
    icon: '',
    path: '/strategies',
    exact: true,
    name: 'Strategies',
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



