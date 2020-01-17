import React, {Component} from 'react';
import AvlMap from 'components/AvlMap'
import { reduxFalcor } from 'utils/redux-falcor'
import {connect} from "react-redux";
import styled from "styled-components";
import TractsLayer from './layers/TractsLayer'
import CensusStatBox from './components/CensusStatBox'
import Content from "components/cms/Content"



import get from "lodash.get";

import {
    VerticalAlign,
    ContentHeader,
    PageContainer,
    HeaderContainer,
    backgroundColor,
    ContentContainer,
    SectionBox
} from 'pages/Public/theme/components'




TractsLayer.backgroundColor = backgroundColor;
class LocalContext extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
        };
    }

    fetchFalcorDeps(){
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();
        console.log('activeCousubid', this.props.activeCousubid)
        return this.props.falcor.get(
            ['acs', parseInt(this.props.activeCousubid), ['2017'],['B19013_001E','B01003_001E','B17001_002E']],
            ['geo', parseInt(this.props.activeCousubid), 'name']
        )
    }

    renderStats () {
        let statsMeta = [
            {
                title: 'Population',
                geoids: [parseInt(this.props.activeCousubid)],
                censusKeys: ['B01003_001E']
            },
            {
                title: 'Household Income Below Poverty Level',
                sumType: 'pct',
                valueSuffix: '%',
                censusKeys: ['B17001_002E'],
                divisorKeys: ['B01003_001E'],
                geoids: [parseInt(this.props.activeCousubid)],
            },
            {
                title: 'Median Household Income',
                censusKeys: ['B19013_001E'],
                valuePrefix: '$',
                geoids: [parseInt(this.props.activeCousubid)],
            }
        ]

        return statsMeta.map((d,i) => {
            return (
                <div className="row mb-xl-2 mb-xxl-3" key={i}>
                    <div className="col-sm-6" style={{margin: '0 auto'}}>
                        <CensusStatBox
                            {...d}
                        />
                    </div>
                </div>
            )
        })
    }

    render() {
        return (
            <PageContainer >
                <HeaderContainer>
                    <div className='row'>
                        <div className='col-12' style={{textAlign:'center'}}>
                            <ContentHeader>
                                {get(this.props.graph, `geo[${parseInt(this.props.activeCousubid)}].name`, '')} Context
                            </ContentHeader>
                        </div>
                    </div>
                        <div className='row'>
                            <div className='col'>
                                 <SectionBox> 
                                    <Content content_id={`${this.props.activeCousubid}-about`} />
                                </SectionBox>
                            </div>
                        </div>
                        <div className='row' >
                            <div className='col-md-6' >
                               
                                <VerticalAlign>
                                {this.renderStats()}
                                </VerticalAlign>

                            </div>

                            <div className='col-md-6'>
                                
                                <div style={{height: '80vh', width: '100%'}}>
                                    <AvlMap
                                        sidebar={false}
                                        mapactions={false}
                                        scrollZoom={false}
                                        zoom={6}
                                        layerProps={{[TractsLayer.name]: {backgroundColor: 'green'}}}
                                        update={[this.state.update]}
                                        style='New'
                                        styles={[{ name: "New",
                                            style: "mapbox://styles/am3081/cjhi0xntt5ul52snxcbsnaeii" }]}
                                        fitBounds={[
                                            [
                                                -79.8046875,
                                                40.538851525354666
                                            ],
                                            [
                                                -71.7626953125,
                                                45.042478050891546
                                            ]]}
                                        layers={[TractsLayer]}
                                    />
                                </div>
                            </div>
                        </div>
                    
                </HeaderContainer>
            </PageContainer>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        activePlan: state.user.activePlan || null,
        activeCousubid: state.user.activeCousubid || null,
        router: state.router,
        graph: state.graph
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(LocalContext))