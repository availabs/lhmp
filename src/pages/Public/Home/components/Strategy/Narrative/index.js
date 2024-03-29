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
    ImageContainer,
    HeroContainer,
    HeroBox,

} from 'pages/Public/theme/components'
 import config from "pages/auth/Plan/config/landing-config";
 import {RenderConfig} from 'pages/Public/theme/ElementFactory'
const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

class Narrative extends Component {
    

    fetchFalcorDeps(){
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();
        return this.props.falcor.get(
            ['geo', parseInt(this.props.activeCousubid), 'name']
        )
    }
    
    render() {
        return (
            <PageContainer>
                <HeaderContainer>
                    <PageHeader>Strategy Overview</PageHeader>
                    <SectionBox>
                        <SectionBoxMain>
                            <RenderConfig
                                config={{'Strategy Text':config['Strategy Text']}}
                                user={this.props.user}
                                showTitle={false}
                                showHeader={false}
                            />
                        </SectionBoxMain>
                    </SectionBox>

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
        router: state.router,
        user: state.user
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Narrative))

