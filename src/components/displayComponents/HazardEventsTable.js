import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBoxHistoric'

import { fnum } from 'utils/sheldusUtils'

import {
    EARLIEST_YEAR,
    LATEST_YEAR
} from "../../pages/Public/Hazards/new_components/yearsOfSevereWeatherData"
import get from 'lodash.get'
class HazardEventsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state={}
    }

    componentDidUpdate(prevProps, prevState) {
       if ( prevProps.hazard !== this.props.hazard){
           this.fetchFalcorDeps()
       }
    }

    fetchFalcorDeps() {
        let hazard = this.props.hazard ?
            [this.props.hazard] :
            this.props.hazards && this.props.hazards.length > 0 ?
                this.props.hazards : [];

        if (!hazard) return Promise.resolve()

        this.setState({hazards: hazard})
        return this.props.falcor.get(['riskIndex', 'hazards'])
                .then(response => {
                    return hazard && hazard.length ? hazard : response.json.riskIndex.hazards;
                })
            .then(hazardids => {

                return this.props.falcor.get(
                    ['riskIndex', 'meta', hazardids, ['id', 'name', 'description']],
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
            hazardids = hazard ? [hazard] : hazards && hazards.length > 0 ? hazards : [],
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
                'hazard': hazardid && this.props.riskIndex.meta[hazardid].name ? this.props.riskIndex.meta[hazardid].name.toUpperCase() : hazardid,
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
        try {
            return (
                <TableBox { ...this.processData() }
                          filterKey="narrative"
                          pageSize={ 8 }
                          expandColumns={ this.props.expandColumns }
                          columnTypes={ { date: "date" } }/>
            )
        }
        catch (e) {
            return (
                <div>Loading...</div>
            )
        }
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
        router: state.router,
        riskIndex: state.graph.riskIndex,
        severeWeather: state.graph.severeWeather,
        geoid: ownProps.geoid ? ownProps.geoid : state.user.activeGeoid,
        hazards: /*ownProps.hazards && ownProps.hazards.length ?
            ownProps.hazards : */get(state.graph, ['riskIndex', 'hazards', 'value'])
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardEventsTable));