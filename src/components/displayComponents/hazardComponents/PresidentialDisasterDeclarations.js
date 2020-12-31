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
import FemaDisasterDeclarationsTable from "../../../pages/Public/Hazards/new_components/FemaDisasterDeclarationsTable";

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
        return (
            <div className='col-md-12' style={{paddingBottom: 20}}>
                <h4>Presidential Disaster Declrations</h4>
                <p>
                    The table below lists all of the presidentially declared disasters, their unique identification number, and the date that a declaration was made. The amounts of funding provided for each disaster are delineated by program. IHP is the Individual and Household Program that provides temporary housing assistance or grants for repair and replacement of impacted homes. PA is the Public Assistance program that provides supplemental grants for response, recovery, and mitigation projects. HMGP is the Hazard Mitigation Grant Program available after Presidential Disaster Declarations to help communities reduce the impacts of future hazards.</p>
                <p>Presidential Disaster Declarations are made through a joint governmental process where the total extent of the disaster damage is identified and a determination is made that the impacts exceed the affected jurisdictions’ capabilities. To learn more about Presidential Disaster Declarations, please visit: <a href="https://www.fema.gov/disasters/how-declared">https://www.fema.gov/disasters/how-declared</a>.</p>

                <FemaDisasterDeclarationsTable
                    geoid={this.props.activeGeoid}
                    geoLevel={this.props.geoLevel}
                    hazards={this.props.hazards}
                    hazard={this.props.hazard}


                />
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