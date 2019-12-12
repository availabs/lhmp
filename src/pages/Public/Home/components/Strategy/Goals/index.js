 import React, {Component} from 'react';
import { reduxFalcor } from 'utils/redux-falcor'

// import { Link } from 'react-router-dom'
import AvlMap from 'components/AvlMap'
import { connect } from 'react-redux';
import get from "lodash.get";

import styled from "styled-components";
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
    VerticalAlign

} from 'pages/Public/theme/components'

const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

class Goals extends Component {
    

    fetchFalcorDeps(){
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();
        return this.props.falcor.get(
            ['geo', parseInt(this.props.activeCousubid), 'name']
        )
    }
    
    render() {
        return (
            <PageContainer> 
                <HeaderContainer style={{}}>
                    <PageHeader>Goals and Objectives</PageHeader>
                        <br/>
                        <ContentContainer>
                            <SectionBox>
                              
                                <SectionBoxMain>
                                   
                                    <p>
                                    <h4>Goal 1</h4> Protect existing property including public, historic, private structures, state-owned/operated buildings, and critical facilities and infrastructure.  
                                    </p>
                                    <p>
                                    <h4>Goal 2</h4> Increase awareness of hazard risk and mitigation capabilities among stakeholders, citizens, elected officials, and property owners to enable the successful implementation of mitigation strategies.
                                    </p>
                                    <p>
                                    <h4>Goal 3</h4> Encourage the development and implementation of long-term, cost effective, and resilient mitigation projects to preserve or restore the functions of natural systems.
                                    </p>
                                    <p>
                                    <h4>Goal 4</h4> Build stronger by promoting mitigation actions that emphasize sustainable construction and design measures to reduce or eliminate the impacts of natural hazards now and in the future
                                    </p>
                                </SectionBoxMain>
                                  
                            </SectionBox>
                        </ContentContainer>
                    

                </HeaderContainer>
            </PageContainer>
           
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        activePlan: get(state, `user.activePlan`, null),
        activeCousubid: get(state, `user.activeCousubid`, null),
        graph: state.graph,
        router: state.router
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Goals))

