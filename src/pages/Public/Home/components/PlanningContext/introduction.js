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
                description: loremIpsum,
                image: '/img/bigicon4.png',
                features: [
                     'User Profiles',
                    'File Manager',
                    'Pricing Plans',
                ]
            },
            {
                title: 'Risk',
                description: loremIpsum,
                image: '/img/bigicon3.png',
                features: [
                     'User Profiles',
                    'File Manager',
                    'Pricing Plans',
                ]
            },
            {
                title: 'Strategies',
                description: loremIpsum,
                image: '/img/bigicon2.png',
                features: [
                     'User Profiles',
                    'File Manager',
                    'Pricing Plans',
                ]

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
                        <PageHeader>{get(this.props.graph, `geo[${parseInt(this.props.activeCousubid)}].name`, '')} Hazard Mitigation Plan</PageHeader>
                        <div className="row">
                            <div className="col-12">
                                <StatementText>
                                    Hazard Mitigation saves lives and dollars.  With XXX people and $XXX of assets, we must protect our future by investing in resiliency now.
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
        router: state.router
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Introduction))

