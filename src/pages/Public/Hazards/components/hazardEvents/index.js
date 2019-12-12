import React, {Component} from 'react';
import AvlMap from 'components/AvlMap'
import {reduxFalcor} from 'utils/redux-falcor'
import {connect} from "react-redux"
import {getColorScale} from 'utils/sheldusUtils'
import styled from "styled-components";
import TractsLayer from './layers/TractsLayer'
import NumberOfHazardsStackedBarGraph from "./components/NumberOfHazardsStackedBarGraph";
import get from "lodash.get";

import {
    VerticalAlign,
    ContentHeader,
    PageContainer,
    HeaderContainer,
    backgroundColor
} from 'pages/Public/theme/components'

let backgroundCss = {
    //background: '#fafafa',
    backgroundSize: '100vw 100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    //marginTop: '50vh',
    zIndex: '8'
};


class HazardLoss extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {};
    }

    fetchFalcorDeps() {
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();
        return this.props.falcor.get(
            ['acs', parseInt(this.props.activeCousubid), ['2017'], ['B19013_001E', 'B01003_001E', 'B17001_002E']]
        )
    }

    setGeoLevel(geoid_len) {
        return geoid_len < 5 ? 'state'
            : geoid_len === 5 ? 'counties'
                : geoid_len === 10 ? 'cousubs'
                    : geoid_len === 11 ? 'tracts'
                        : geoid_len === 12 ? 'blockgroup' : ''
    }

    render() {
        return (
            <PageContainer >
                <HeaderContainer>
                    <div className='row'>
                        <div className='col-12' style={{textAlign:'center'}}>
                            <ContentHeader>
                                {get(this.props.graph, `geo[${parseInt(this.props.activeCousubid)}].name`, '')} Hazard Events
                            </ContentHeader>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <VerticalAlign>
                                <ContentHeader> Hazard Events <span style={{fontSize: '14px'}}> Number of Events by Hazard Type (1996-2017)</span></ContentHeader>
                                <NumberOfHazardsStackedBarGraph
                                    showYlabel={false}
                                    showXlabel={false}
                                    lossType={'num_events'}
                                    geoid={this.props.activeGeoid}
                                    geoLevel={this.setGeoLevel(this.props.activeGeoid.length)}
                                    dataType='severeWeather'
                                    colorScale={getColorScale([1, 2])}
                                    hazards={['hurricane', 'hail']}
                                    //hazard = {'hurricane'}
                                />
                            </VerticalAlign>
                        </div>
                        <div className='col-lg-6' >
                            
                                    <div style={{height: '80vh', width: '100%'}}>
                                        <AvlMap
                                            sidebar={false}
                                            mapactions={false}
                                            scrollZoom={false}
                                            zoom={6}
                                            update={[this.state.update]}
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

const mapStateToProps = (state, ownProps) => {
    return {
        activePlan: state.user.activePlan || null,
        activeCousubid: state.user.activeCousubid || null,
        activeGeoid: state.user.activeGeoid || null,
        router: state.router,
        graph: state.graph
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardLoss))