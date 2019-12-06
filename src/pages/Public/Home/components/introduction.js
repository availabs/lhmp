 import React, {Component} from 'react';
// import { Link } from 'react-router-dom'
import AvlMap from 'components/AvlMap'
import Element from 'components/light-admin/containers/Element'
import { connect } from 'react-redux';
import reduxFalcor from "utils/redux-falcor";
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
    HeroBox
} from 'pages/Public/theme/components'

const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const HEADER = styled.div`
    margin-bottom: 0.5rem;
    color: rgb(239, 239, 239);
    font-size: 2rem;
    font-weight: 700;
    font-size: 40px;
    font-family: "Proxima Nova W01";
    line-height: 0.9;
    text-shadow: rgb(68, 68, 102) -1px -1px 0px, rgb(68, 68, 102) 1px -1px 0px, rgb(68, 68, 102) -1px 1px 0px, rgb(68, 68, 102) 1px 1px 0px;
    text-align: center;
`


const LABEL = styled.div`
    color: rgb(239, 239, 239);
    display: block;
    font-size: 1rem;
    font-weight: 500;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 1px;
`
class Introduction extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
        };
    }
    priceTest () {
        let info = [
            {
                title: 'Planning Process',
                description: loremIpsum,
                features: [
                     'User Profiles',
                    'File Manager',
                    'Pricing Plans',
                ]
            },
            {
                title: 'Risk',
                description: loremIpsum,
                features: [
                     'User Profiles',
                    'File Manager',
                    'Pricing Plans',
                ]
            },
            {
                title: 'Strategies',
                description: loremIpsum,
                features: [
                     'User Profiles',
                    'File Manager',
                    'Pricing Plans',
                ]
            }
        ]

        let content = info.map((sect,i) => {
            return (
                <div className={`pricing-plan col-sm-4 ${ i === 1 ? 'highlight' : ''}`}>
                <div className="plan-head">
                  <div className="plan-image">
                    <img alt src={`/img/plan${i+1}.png`} />
                  </div>
                  <div className="plan-name">{sect.title}</div>
                </div>
               
                <div className="plan-description">
                  <h6>Description</h6>
                  <p>
                    {sect.description}
                  </p>
                  <h6>Features</h6>
                  <ul>
                    {sect.features.map(feat => (<li>{feat}</li>))}
                  </ul>
                </div>
              </div>
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
                <HeaderContainer>
                        <PageHeader>X County Hazard Mitigation Plan</PageHeader>
                        <div className="row">
                            <div className="col-12">
                                <StatementText>
                                    We should do mitigation because we have $12,312,312 and 2,001 people at risk in the floodplain.
                                </StatementText>
                            </div>
                        </div>
                </HeaderContainer>
                
                <HeaderImage image={'/img/sullivan.png'} >
                     
                </HeaderImage>
                {this.priceTest()}
            </PageContainer>
           
        )
    }
}

export default Introduction