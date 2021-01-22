import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBoxHistoric'

import { fnum } from 'utils/sheldusUtils'

import {
    EARLIEST_YEAR,
    LATEST_YEAR
} from "./yearsOfSevereWeatherData"
import get from "lodash.get";
import {setActiveCousubid} from "../../../store/modules/user";
import {ContentHeader, PageContainer} from "../../../pages/Public/theme/components";
import HazardBarChart from "./HazardBarChart";
import NumberOfHazardsMonthStackedBarGraph
    from "../../../pages/Public/Hazards/new_components/NumberOfHazardsMonthStackedBarGraph";
import CousubTotalLossTable from "../../../pages/Public/Hazards/components/CousubTotalLossTable";

class HazardEventsTable extends React.Component {

    fetchFalcorDeps() {
        let hazard = this.props.hazard ?
            [this.props.hazard] :
            this.props.hazards && this.props.hazards.length > 0 ?
                this.props.hazards : null;

        return this.props.falcor.get(['riskIndex', 'hazards'])
                .then(response => {
                    return hazard ? hazard : response.json.riskIndex.hazards;
                })
            .then(hazardids => {
                return this.props.falcor.get(
                    [this.props.dataType, 'events', this.props.geoid, hazardids, 'top', 'property_damage']
                )
                    .then(response => {
                        let event_ids = [];
                        hazardids.forEach(hazardid => {
                            const ids = response.json[this.props.dataType].events[this.props.geoid][hazardid].top.property_damage;
                            event_ids = event_ids.concat(ids);
                        })
                        return event_ids;
                    })
            })
            .then(event_ids => {
                const requests = [],
                    eventIdsPerRequest = 500;
                for (let i = 0; i < event_ids.length; i += eventIdsPerRequest) {
                    requests.push([
                        this.props.dataType,
                        "events", "byId",
                        event_ids.slice(i , i + eventIdsPerRequest),
                        [
                            'property_damage',
                            'hazardid',
                            'episode_narrative', 'episode_id',
                            'event_narrative', 'event_id',
                            'municipality', 'county', 'date'
                        ]
                    ])
                }
                return requests.sort((a, b) => b.year - a.year)
                    .reduce((a, c) =>
                            a.then(() => this.props.falcor.get(c))
                        , Promise.resolve());
            })
    }

    render() {
        let HazardName = this.props.hazard;

        return (
            <div className='col-md-12'>
                <h4>Hazard Loss by Municipality</h4>
                <strong>{EARLIEST_YEAR}-{LATEST_YEAR}</strong>
                <h6>{HazardName} Loss by Month</h6>
                <div>This table displays the total damage amount in dollars and number
                    of fatalities for all recorded hazards between the years of 1996-2018.
                    Viewers can access individual jurisdiction-specific statistics by clicking on the jurisdiction name.
                    In New York State, Villages are included within Town boundaries. Villages are not included in this table so as to not double count hazard loss statistics.
                </div>
                <CousubTotalLossTable
                    geoid={this.props.activeGeoid}
                    geoLevel={this.props.geoLevel}
                    dataType='severeWeather'
                    hazards={this.props.hazards}
                    hazard={this.props.hazard}
                />
                <i style={{color: '#afafaf'}}>Source: <a
                    href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI
                    Storm Events Dataset</a></i>
            </div>
        )
    }
}

HazardEventsTable.defaultProps = {
    dataType: "severeWeather",
    geoid: "36",
    year: 2017,
    expandColumns: ['narrative'],
    hazard: null,
    hazards: []
}

const mapStateToProps = (state, ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        graph: state.graph,
        contentGraph: get(state.graph, `content.byId`, {}),
        formData: get(state.graph, [`forms`, 'filterRequirements'], null),
        planId: state.user.activePlan,
        geoid: state.user.activeCousubid && state.user.activeCousubid !== 'undefined' ?
                state.user.activeCousubid :
                state.user.activeGeoid ?
                    state.user.activeGeoid :
                    localStorage.getItem('geoId'),
        riskIndexMeta: get(state.graph, `riskIndex.meta`, {})

    };
};

const mapDispatchToProps = {setActiveCousubid};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardEventsTable));