import React, {Component} from 'react';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import {connect} from "react-redux";
import styled from "styled-components";


import AvlMap from 'components/AvlMap'
import { fnum } from "utils/sheldusUtils"
import AssetsLayer from './layers/AssetsLayer'
import AssetsPageOwnerTypeEditor from 'components/displayComponents/assetsPageOwnerTypeEditor'
import AssetsPageCriticalTypeEditor from 'components/displayComponents/assetsPageCriticalTypeEditor'

import {
    VerticalAlign,
    ContentHeader,
    PageContainer,
    HeaderContainer,
    backgroundColor
} from 'pages/Public/theme/components'

import StatBox from 'pages/Public/theme/statBox'


class NFIP extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
        };
    }

    fetchFalcorDeps(){
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();
        return this.props.falcor.get(
            ['nfip', 'losses', 'byGeoid', parseInt(this.props.activeCousubid), 'allTime', ['total_payments', 'total_losses']],
        )
    }
/*`building.byGeoid[{keys:geoids}].critical[{keys:criticalType}][{keys:riskZones}].byIndex[{integers:indices}]`,
    flood_100, critical*/
    render() {
        return (
            <PageContainer >
                <HeaderContainer>
                    <div className='row'>
                        <div className='col-12' style={{textAlign:'center'}}>
                            <ContentHeader>
                                {get(this.props.graph, `geo[${parseInt(this.props.activeCousubid)}].name`, '')} Assets in Flood Plain
                            </ContentHeader>
                        </div>
                    </div>
                <div className='row'>
                    <div className='col-lg-6'>
                        <VerticalAlign>
                                <ContentHeader>
                                    County owned Assets
                                </ContentHeader>
                                <AssetsPageOwnerTypeEditor 
                                    filter_type={'ownerType'} 
                                    filter_value={['3']} 
                                    geoid={[parseInt(this.props.activeCousubid)]} 
                                />
                            
                                <ContentHeader>
                                    Municipality Owned Assets
                                </ContentHeader>
                                <AssetsPageOwnerTypeEditor 
                                    filter_type={'ownerType'} 
                                    filter_value={['4','5','6','7']} 
                                    geoid={[parseInt(this.props.activeCousubid)]} 
                                />
                          
                            <ContentHeader>
                                Critical Infrastructure
                            </ContentHeader>
                            <AssetsPageCriticalTypeEditor 
                                filter_type={'critical'} 
                                filter_value={['all']} 
                                geoid={[parseInt(this.props.activeCousubid)]} 
                            />
                        </VerticalAlign>
                    </div>
                
                    <div className='col-lg-6'>
                    
                        <div style={{height: '80vh', width: '100%'}}>
                            <AvlMap
                                sidebar={false}
                                mapactions={false}
                                scrollZoom={false}
                                zoom={6}
                                style='Clear'
                                styles={[{
                                    name: "Clear",
                                    style: "mapbox://styles/am3081/cjvih8vrm0bgu1cmey0vem4ia"
                                }]}
                                fitBounds={[
                                    [
                                        -79.8046875,
                                        40.538851525354666
                                    ],
                                    [
                                        -71.7626953125,
                                        45.042478050891546
                                    ]]}
                                layers={[AssetsLayer]}
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NFIP))