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
                                    <p>The prime objective of setting hazard mitigation goals is to aid in the reduction and/or the elimination of losses from hazard events. In concentrating on the top five natural hazards of concern which include: flood, severe storm, winter storm (severe), earthquake, and ice storm; resources can be better focused on achieving progress towards minimizing impacts that could result from such hazards. It is important to create goals that are tangible. The following is a listing of the goals which would help towards diminishing the impacts of the five natural hazards of concern, in conjunction with the other natural and technological hazards assessed in this plan update. </p>
                                    <p>
                                    <h4>Goal 1 </h4>
                                    Improve County-wide Transportation Infrastructure and Networks 
                                    <h4>Goal 2 </h4>
                                    Reduce Vulnerability of Residential and Commercial Properties to Flooding Events 
                                    <h4>Goal 3</h4>
                                    Preserve and Enhance the Natural Environment 
                                    <h4>Goal 4</h4>
                                    Increase Community Preparedness for Large-scale Hazard Events 
                                    <h4>Goal 5</h4>
                                    Reduce the Potential Impact of Disasters on the Critical Facilities Identified within the County 
                                    <h4>Goal 6</h4>
                                    Increase Public Understanding, Support, and Demand for Hazard Mitigation
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

