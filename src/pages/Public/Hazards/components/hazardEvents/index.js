import React, {Component} from 'react';
import AvlMap from 'components/AvlMap'
import {reduxFalcor} from 'utils/redux-falcor'
import {connect} from "react-redux"
import {getColorScale} from 'utils/sheldusUtils'
import styled from "styled-components";
import TractsLayer from './layers/TractsLayer'
import NumberOfHazardsStackedBarGraph from "./components/NumberOfHazardsStackedBarGraph";

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
const FLEXBOX = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 25vw;
    height: 200px;
`;
const BOX = styled.div`
     color: rgb(239, 239, 239); 
     background: rgba(0, 0, 0, 0.7); 
     border-radius: 4px;
     overflow: auto;
     height: fit-content;
     margin-left: 10px;
     margin-right: 10px;
     padding: 5px;
     ${props => props.theme.modalScrollBar}
`;

const LABEL = styled.div`
    color: rgb(239, 239, 239);
    display: block;
    font-size: 1rem;
    font-weight: 500;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 1px;
`;

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
            <div style={backgroundCss}>
                <div className='col-sm-6' style={{float: 'left'}}>
                    <div className="element-wrapper">
                        <div className="element-box">
                            <div style={{height: '100vh', width: '100%'}}>
                                <NumberOfHazardsStackedBarGraph
                                    showYlabel={false}
                                    showXlabel={false}
                                    lossType={'num_events'}
                                    geoid={this.props.activeGeoid}
                                    geoLevel={this.setGeoLevel(this.props.activeGeoid.length)}
                                    dataType='severeWeather'
                                    colorScale={getColorScale([1, 2])}
                                    hazards={this.props.hazards}
                                    hazard = {this.props.hazard}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-sm-6' style={{float: 'right'}}>
                    <div className="element-wrapper">
                        <div className="element-box">
                            <div style={{height: '100vh', width: '100%'}}>
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
                                    layerProps={ {
                                        [TractsLayer.name]: {
                                            hazard: this.props.hazard,
                                            hazards: this.props.hazards
                                        }
                                    } }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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