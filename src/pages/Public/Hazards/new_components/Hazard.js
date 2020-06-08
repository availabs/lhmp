import React from 'react';
import { connect } from 'react-redux';
import styled from "styled-components";
import { reduxFalcor } from 'utils/redux-falcor'
// import {authGeoid} from "store/modules/user";
// import {getColorScale} from 'utils/sheldusUtils'
import HazardBarChart from 'components/displayComponents/hazardComponents/HazardBarChart'

import NumberOfHazardsMonthStackedBarGraph from './NumberOfHazardsMonthStackedBarGraph'
import HazardEventsTable from './HazardEventsTable'

import CousubTotalLossTable from "../components/CousubTotalLossTable";
import HazardEventsMapController from "../components/HazardEventsMapController";
import get from "lodash.get"
import fnum from 'utils/sheldusUtils'

import {
    EARLIEST_YEAR,
    LATEST_YEAR
} from "./yearsOfSevereWeatherData"


//import {EARLIEST_YEAR, LATEST_YEAR} from "./components/yearsOfSevereWeatherData";


import {
    PageContainer,
    ContentContainer    
} 
from 'pages/Public/theme/components'


class Hazards extends React.Component {

    constructor(props) {
        super(props);
        //authGeoid(this.props.user);
        this.state = {
            geoid: this.props.geoid,
            dataType: 'severeWeather'
        }
    }

    fetchFalcorDeps(geoid, geoLevel, dataType) {
        if (!geoid) geoid = this.props.geoid; 
        let contentId =  `req-B1-${this.props.hazard}-${this.props.planId}-${this.props.geoid}`
        
        return this.props.falcor.get(
            ['content', 'byId', contentId, ['body']]
        )
            
    }

    render() {
        if(!this.props.geoid) {
            return <React.Fragment />
        }
        let HazardName = get(this.props.graph,`riskIndex.meta[${this.props.hazard}].name`,'')

        return (
            <div>
                <div className='row'>
                    <div>
                        <h5>{get(this.props.graph,`riskIndex.meta[${this.props.hazard}].name`,'')} Narrative</h5>
                        <div
                            dangerouslySetInnerHTML={{ __html: get(this.props.graph, `content.byId[req-B1-${this.props.hazard}-${this.props.planId}-${this.props.geoid}].body.value`, '<span/>')}}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        <h6>{HazardName} Loss by Year</h6>
                        <HazardBarChart
                            hazard={this.props.hazard}
                            geoid={this.props.geoid}
                            geoLevel={this.props.geoLevel}
                            format={"~s"}
                            height={300}
                        />
                    </div>
                    <div className='col-md-6'>
                        <h6>{HazardName} Events by Year</h6>
                         <HazardBarChart
                            lossType={'num_events'}
                            hazard={this.props.hazard}
                            geoid={this.props.geoid}
                            geoLevel={this.props.geoLevel}

                            height={300}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        <h6>{HazardName} Loss by Month</h6>
                        <NumberOfHazardsMonthStackedBarGraph
                            showYlabel={false}
                            showXlabel={false}
                            lossType={'property_damage'}
                            geoid={this.props.geoid}
                            geoLevel={this.props.geoLevel}
                            dataType='severeWeather'
                            hazards={this.props.hazards}
                            format={"~s"}
                            hazard={this.props.hazard}
                            height={300}
                        />
                    </div>
                    <div className='col-md-6'>
                        <h6>{HazardName} Events by Month</h6>
                        <NumberOfHazardsMonthStackedBarGraph
                            showYlabel={false}
                            showXlabel={false}
                            lossType={'num_events'}
                            geoid={this.props.geoid}
                            geoLevel={this.props.geoLevel}
                            dataType='severeWeather'
                            hazards={this.props.hazards}
                            hazard={this.props.hazard}
                            height={300}
                        />
                    </div>
                </div>
                 <div className='row'>
                    <div className='col-md-12'>
                        <h5>Events with Highest Reported Loss in Dollars</h5>
                        <strong>{EARLIEST_YEAR}-{LATEST_YEAR}</strong>
                        <div>The table below lists individual events by loss in dollars.
                            Click on a row to view the event description.
                        </div>
                        <HazardEventsTable
                            hazards={this.state.hazards}
                            hazard={this.state.hazard}
                            geoid={this.state.geoid}
                        />
                        <i style={{color: '#afafaf'}}>Source: <a
                            href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI
                            Storm Events Dataset</a></i>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <h5>Hazard Loss by Municipality</h5>
                        <strong>{EARLIEST_YEAR}-{LATEST_YEAR}</strong>
                        <h6>{HazardName} Loss by Month</h6>
                        <CousubTotalLossTable
                            geoid={this.props.geoid}
                            geoLevel={this.props.geoLevel}
                            dataType='severeWeather'
                            hazards={this.props.hazards}
                            hazard={this.props.hazard}
                        />
                    </div>
                </div>

                <div className='row'>
                    <div className='col-md-12'>
                        <h5>Hazard Events</h5>
                        <strong>{EARLIEST_YEAR}-{LATEST_YEAR}</strong>
                        <h6>{HazardName} Events</h6>
                        <HazardEventsMapController
                            geoid={this.props.geoid}
                            geoLevel={this.props.geoLevel}
                            dataType='severeWeather'
                            hazards={this.props.hazards}
                            hazard={this.props.hazard}
                            zoomPadding={150}
                        />
                    </div>
                </div>
               
            </div>

        )
    }

    
}

const mapStateToProps = (state,ownProps) => {
    return {
        graph: state.graph,
        planId: state.user.activePlan
    };
};

const mapDispatchToProps = {};
export default  connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Hazards))

