import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import {authGeoid} from "store/modules/user";
import {fnum, getColorScale} from 'utils/sheldusUtils'


import styled from "styled-components";
import Element from "../../../components/light-admin/containers/Element";
import ElementBox from "../../../components/light-admin/containers/ElementBox";
import config from "../Plan/config/guidance-config";
import {Link} from "react-router-dom";
import get from "lodash.get";
import TableSelector from "../../../components/light-admin/tables/tableSelector";


const StickySelect = styled.div`
   margin-top: 30px
   select {
   
   height: 5vh;
   width: 100%;
   z-index:100;
   
   }
`;

class StormEvents extends React.Component {

    constructor(props) {
        super(props);
        authGeoid(this.props.user);
        this.state = {
            geoid: this.props.geoid,
            geoLevel: this.setGeoLevel(this.props.geoid.length),
            dataType: 'severeWeather',
            colorScale: getColorScale([1, 2]),
            hazards: [],
            hazard: undefined
        }
    }

    setGeoLevel(geoid_len) {
        return geoid_len === 2 ? 'state'
            : geoid_len === 5 ? 'counties'
                : geoid_len === 7 ? 'villages'
                    : geoid_len === 10 ? 'cousubs'
                        : geoid_len === 11 ? 'tracts'
                            : geoid_len === 12 ? 'blockgroup' : ''
    }

    fetchFalcorDeps() {

        return this.props.falcor.get(['riskIndex', 'hazards'])
            .then(response => {
                return response.json.riskIndex.hazards;
            })
            .then(hazardids => {
                return this.props.falcor.get(
                    ['severeWeather', 'events', this.props.geoid, hazardids, 'top', 'property_damage']
                )
                    .then(response => {
                        let event_ids = [];
                        hazardids.forEach(hazardid => {
                            const ids = response.json['severeWeather'].events[this.props.geoid][hazardid].top.property_damage;
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
                        'severeWeather',
                        "events", "byId",
                        event_ids.slice(i, i + eventIdsPerRequest),
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
        const dataType = 'severeWeather',
            hazardids = this.props.riskIndex.hazards.value,
            graphEventsById = this.props[dataType].events.byId,
            data = [];
        let event_ids = [];

        hazardids.forEach(hazardid => {
            const ids = this.props['severeWeather'].events[this.props.geoid][hazardid].top.property_damage.value;
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
                "municipality": municipality ? `${municipality}, ${county}` : county,
                "date": new Date(date).toLocaleString(),
                "narrative": event_narrative || episode_narrative,
                'view': <a href={`stormevents/${event_id}`}> view </a>
            })
        })
        data.sort((a, b) => b.property_damage - a.property_damage);
        return {data, columns: ['property damage', 'hazard', "municipality", "date", 'narrative']};
    }


    render() {
        if (!this.props.riskIndex || !this.props.severeWeather || !this.props.severeWeather.events.byId) return null;
        let data = this.processData()
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">
                        <label>
                            Storm Events
                            {config['stormevents'] ?
                                <Link
                                    className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded"
                                    to={
                                        get(this.props.config, `[0].guidance`, `/guidance/${config['stormevents'].requirement}/view`)
                                    } target={'_blank'}
                                >?</Link>
                                : null}
                        </label>
                    </h4>
                    <ElementBox>
                        <div className="table-responsive">
                            <TableSelector
                                data={data.data}
                                columns={
                                    data.columns
                                        .map(f => {
                                            return ({
                                                Header: f,
                                                accessor: f,
                                                expandable: f === 'narrative' ? 'true' : 'false'
                                            })
                                        })}
                                flex={this.props.flex ? this.props.flex : false}
                                height={this.props.height ? this.props.height : ''}
                                width={this.props.width ? this.props.width : ''}
                                tableClass={this.props.tableClass ? this.props.tableClass : null}
                                actions={{edit: true, view: true, delete: true}}
                            />
                        </div>

                    </ElementBox>
                </Element>
            </div>
        )
    }


}

const mapStateToProps = (state, ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        planId: state.user.activePlan,
        geoid: ownProps.computedMatch.params.geoid ?
            ownProps.computedMatch.params.geoid
            : state.user.activeCousubid && state.user.activeCousubid !== 'undefined' ?
                state.user.activeCousubid :
                state.user.activeGeoid ?
                    state.user.activeGeoid :
                    localStorage.getItem('geoId'),
        riskIndex: state.graph.riskIndex,
        severeWeather: state.graph.severeWeather
    };
};

const mapDispatchToProps = {authGeoid};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/stormevents',
    exact: true,
    name: 'StormEvents',
    auth: true,
    mainNav: true,
    breadcrumbs: [
        {name: 'StormEvents', path: '/stormevents'}],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(StormEvents))
}];

