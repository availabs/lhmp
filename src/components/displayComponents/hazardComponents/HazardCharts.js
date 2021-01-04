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

    processData() {
        const { hazard, hazards, dataType, geoid, year } = this.props,
            hazardids = hazard ? [hazard] : hazards && hazards.length > 0 ? hazards : this.props.riskIndex.hazards.value,
            graphEventsByGeoid = this.props[dataType].events[geoid],
            graphEventsById = this.props[dataType].events.byId,
            data = [];
        let event_ids = [];

        hazardids.forEach(hazardid => {
            const ids = this.props[this.props.dataType].events[this.props.geoid][hazardid].top.property_damage.value;
            event_ids = event_ids.concat(ids);
        })
        event_ids.forEach(event_id => {
            const {
                hazardid,
                property_damage,
                event_narrative,
                episode_narrative,
                municipality,
                county,
                date
            } = graphEventsById[event_id];
            data.push({
                "property damage": fnum(+property_damage),
                'hazard': hazardid ? hazardid.toUpperCase() : hazardid,
                property_damage: +property_damage,
                "municipality": municipality ? `${ municipality }, ${ county }` : county,
                "date": new Date(date).toLocaleString(),
                "narrative": event_narrative || episode_narrative
            })
        })
        data.sort((a, b) => b.property_damage - a.property_damage);
        return { data, columns: ['property damage', 'hazard', "municipality", "date", 'narrative'] };
    }

    render() {
        let HazardName = this.props.hazard;

        return (
            <div>
                <div className='row'>
                    <ContentHeader>About the NOAA Storm Events Dataset</ContentHeader>
                    <PageContainer style={{paddingTop:20}}>The following charts, as well as the visualizations above, display storm events from the<i style={{color: '#afafaf'}}><a
                        href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI
                        Storm Events Dataset</a></i>.
                        The Storm Events Database contains the records used to create the official NOAA Storm Data publication. The The NOAA NCEI storm events database contains data dating back to January 1950, as entered by NOAA's National Weather Service (NWS).
                        The NCEI Storm Events data provides information about the the occurrence and magnitude of severe or unusual weather
                        events and other significant meteorological events. The Storm Events data documents the following event types:
                        <li>The occurrence of storms and other significant weather phenomena having sufficient intensity to cause loss of life, injuries, significant property damage, and/or disruption to commerce;</li>
                        <li>Rare, unusual, weather phenomena that generate media attention, such as snow flurries in South Florida or the San Diego coastal area; and</li>
                        <li>Other significant meteorological events, such as record maximum or minimum temperatures or precipitation that occur in connection with another event.</li>
                        <h5>On How the MitigateNY Software displays NCEI Storm Events Data</h5>
                        <li>The MitigateNY software utilizes data dating back to 1996 when the current Storm Events data formatting was standardized. </li>
                        <li>Storm Events calculations, tables and visualizations in the MitigateNY software are at the geographic level of the County. While some events are identified specific to jurisdictions, the majority of the data is
                            not jurisdiction specific. Therefore, the MitigateNY software is designed to show the county aggregations even when a jurisdiction is selected.</li>
                        <li>The NCEI Storm Events data is color coordinated with the associated hazard which can be found at the top of the page and on the
                            left side navigation panel. Using your mouse tooltip, hover over a bar to see exact amounts as recorded in the data.</li>
                        <h5>Notes on Visualizations</h5>
                        <li>The statistics listed at the top of the page include overall loss damages in U.S. dollars, average loss damages
                            per year, annual probability and daily probability. Annual probabilities are calculated based on the total number of events in the Storm Events dataset (From 1996) divided by the number of years in the dataset.
                            The daily probability calculation takes the total number of events and divides it by the total number of days in the dataset. </li>
                        <li>The Loss by Year bar chart shows the loss in dollar value annually based on hazard events.
                            Data can be scaled based on dollar amounts listed at the top of the chart.</li>
                        <li>The Events by Year bar chart shows the number of events during the given years.
                            Events are separated by hazard types.</li>
                        <li>The Loss by Month bar chart shows the loss in dollar value monthly based on hazard events.
                            Data can be scaled based on dollar amounts listed at the top of the chart.</li>
                        <li>The Events by Month bar chart shows the number of events during the given months.
                            Events are separated by hazard types.</li>
                    </PageContainer>
                    <div className='col-md-6'>
                        <h6>{HazardName} Loss by Year</h6>
                        <HazardBarChart
                            hazard={this.props.hazard}
                            geoid={this.props.activeGeoid}
                            geoLevel={this.props.geoLevel}
                            format={"~s"}
                            height={300}
                            maxValueButtons={true}
                        />

                    </div>
                    <div className='col-md-6'>
                        <h6 style={{paddingBottom:29}}>{HazardName} Events by Year</h6>
                        <HazardBarChart
                            lossType={'num_events'}
                            hazard={this.props.hazard}
                            geoid={this.props.activeGeoid}
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
                            geoid={this.props.activeGeoid}
                            geoLevel={this.props.geoLevel}
                            dataType='severeWeather'
                            hazards={this.props.hazards}
                            format={"~s"}
                            hazard={this.props.hazard}
                            height={300}
                            maxValueButtons={true}
                        />

                    </div>
                    <div className='col-md-6'>
                        <h6 style={{paddingBottom:29}}>{HazardName} Events by Month</h6>
                        <NumberOfHazardsMonthStackedBarGraph
                            showYlabel={false}
                            showXlabel={false}
                            lossType={'num_events'}
                            geoid={this.props.activeGeoid}
                            geoLevel={this.props.geoLevel}
                            dataType='severeWeather'
                            hazards={this.props.hazards}
                            hazard={this.props.hazard}
                            height={300}
                        />

                    </div>
                    <i style={{color: '#afafaf'}}>Source: <a
                        href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI
                        Storm Events Dataset</a></i>
                </div>
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