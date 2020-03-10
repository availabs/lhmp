import React, {Component} from 'react';
import { reduxFalcor } from 'utils/redux-falcor'


import { Link, WithRouter } from 'react-router-dom'

 import config from "pages/auth/Plan/config/landing-config";
 import {RenderConfig} from 'pages/Public/theme/ElementFactory'

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
    Feature,
    FeatureDescription,
    FeatureName,
    FeatureName2,
    FeatureImage,
    FeatureHeader,
    HeaderImageContainer
} from 'pages/Public/theme/components'

const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';


class Introduction extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
        };
    }
    fetchFalcorDeps(){
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();
        return this.props.falcor.get(
            ['geo', parseInt(this.props.activeCousubid), 'name']
        )
    }
    priceTest () {
        let info = [
            {
                title: 'Planning Process',
                description:`The foundation for a plan begins with the process. It is critical to identify a wide range of planning participants to contribute to the process. Significant outreach must be conducted to ensure members of the community are
given the opportunity to engage in the discussion. Existing resources must be identified and integrated into the
planning process to promote comprehensive, community wide solutions. Documentation throughout is key, not
just to meet planning requirements, but to ensure transparency and foster continued plan maintenance.`,
                image: '/img/bigicon4.png',
                features: [
                    'Planning Context',
                    'Participation/Meetings',
                    'Integration',
                    'Maintenance',
                    'Adoptions',
                ],
                link: '/planning-process'
            },
            {
                title: 'Risk',
                description: `Risk is the potential for damage, loss or other impacts created by the interaction of natural hazard with
community assets. Risk identifies exposure to hazards and evaluates vulnerability to that hazard. Particular
attention is given to risk to critical infrastructure. Recent changes in development are identified and assessed
for impact to hazard risk, and a community’s capacity to respond to and recover from potential events is
considered.`,
                image: '/img/bigicon3.png',
                features: [
                    'Vulnerability',
                    'Critical Infrastructure',
                    'Changes in Development',
                    'Response'
                ],
                link: '/risk'
            },
            {
                title: 'Strategies',
                description: `Mitigation strategies bolster a community’s established goals and objectives by identifying a range of specific mitigation actions to be implemented during the lifecycle of the plan.  The framework includes an inventory of capabilities to be both leveraged and enhanced to support actions to reduce risk to hazards.`,
                image: '/img/bigicon2.png',
                features: [
                     'Goals',
                    'Capabilities',
                    'Actions'
                ],
                link: '/strategies'

            }
        ]

        let content = info.map((sect,i) => {
            let highlight =   i === 1;
            return (
               
                    <Feature className={`col-sm-4`} highlight={highlight} key={i}>
                        <FeatureHeader highlight={highlight}>
                          <FeatureImage>
                            <img alt={'Heading Image'} src={sect.image} />
                          </FeatureImage>
                          <FeatureName2>{sect.title}</FeatureName2>
                        </FeatureHeader>
                   
                        <FeatureDescription>
                          <h6>Description</h6>
                          <p>
                            {sect.description}
                          </p>
                          <h6>Features</h6>
                          <ul>
                            {sect.features.map((feat,ii) => (<li key={ii}>{feat}</li>))}
                          </ul>
                        </FeatureDescription>
                  </Feature>
                
            )
        }

        )
        return (
            <div className="pricing-plans row no-gutters">            
                {content}
            </div>
         
        )
    }

    render() {
        return (
            <PageContainer>
                <HeaderImageContainer img={'/img/sullivan-min.png'}>
                    <div style={{width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', padding: 50}}>
                        <PageHeader style={{color: '#efefef'}}>{get(this.props.graph, `geo[${parseInt(this.props.activeCousubid)}].name`, '')} Hazard Mitigation Plan</PageHeader>
                        <div className="row">
                            <div className="col-12">
                                <StatementText>
                                    <RenderConfig
                                        config={{'Landing Quote':config['Landing Quote']}}
                                        user={this.props.user}
                                        showTitle={false}
                                        showHeader={false}
                                    />
                                </StatementText>
                            </div>
                        </div>
                    </div>
                </HeaderImageContainer>
                
                
                {this.priceTest()}
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Introduction))

