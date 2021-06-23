import React, {Component} from 'react';
import { reduxFalcor } from 'utils/redux-falcor'
import {falcorGraph} from "store/falcorGraph";

import get from "lodash.get";
import {connect} from "react-redux";
import styled from "styled-components";

import AvlMap from 'components/AvlMap'
import { fnum } from "utils/sheldusUtils"
import NfipLossesTable from "./components/NfipLossesTable";
import NfipLossesLayer from './components/NfipLossesLayer';

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

    render() {
        return (
             <PageContainer >
                <HeaderContainer>
                    <div className='row'>
                        <div className='col-12' style={{textAlign:'center'}}>
                            <ContentHeader>
                                {get(this.props.graph, `geo[${parseInt(this.props.activeCousubid)}].name`, '')} National Flood Insurance Program (NFIP) Claims
                            </ContentHeader>
                        </div>
                    </div>
                <div className='row'>
                    <div className='col-lg-6'>
                        <VerticalAlign>
                               {/* <div className='row'>
                                    <div className="col-sm-6">
                                        <StatBox 
                                            title={`Number NFIP Claims`}
                                            value={get(this.props.graph,
                                                            `nfip.losses.byGeoid.${parseInt(this.props.activeCousubid)}.allTime.total_losses`, 0).toLocaleString()}
                                            />
                                    </div><div className="col-sm-6">
                                        <StatBox 
                                            title={`Total Payments`}
                                            value={fnum(get(this.props.graph,
                                                            `nfip.losses.byGeoid.${parseInt(this.props.activeCousubid)}.allTime.total_payments`, 0))}
                                            />
                                               
                                    </div>

                                </div>*/}
                                <div  >
                                    <NfipLossesTable
                                        title={ "NFIP Losses by Jurisdiction" }
                                        defaultSortCol={this.props.defaultSortCol}
                                        defaultSortOrder={this.props.defaultSortOrder}
                                        colOrder={this.props.colOrder}
                                        minHeight={this.props.minHeight}
                                    />
                                </div>
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
                                layers={[NfipLossesLayer]}
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