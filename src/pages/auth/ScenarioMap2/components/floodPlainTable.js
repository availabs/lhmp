import React from 'react';
import {connect} from 'react-redux';
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import {reduxFalcor} from 'utils/redux-falcor'
import FloodPlainModalData from "./floodPlainModalData";
import BuildingByAgency from "../../Assets/components/BuildingsByAgencyConfig";
import {falcorGraph} from "../../../../store/falcorGraph";
import store from "../../../../store";
import * as d3 from "d3";

var _ = require("lodash")
var format =  d3.format("~s")
const fmt = (d) => d < 1000 ? d : format(d)

const ATTRIBUTES =
    ['building_id', 'address', 'prop_class', 'owner_type', 'replacement_value', 'agency', 'flood_zone']
const floodZones = {
    '100 Year': ['AE', 'A', 'AH', 'VE', 'AO'],
    '500 Year': ['X'],
    none: [null]
}

class floodPlainTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zone_clicked: false,
            data: [],
            zone_id: ''
        }

        this.showZoneModal = this.showZoneModal.bind(this)
        this.onClose = this.onClose.bind(this)
    }

    onClose(layer) {
        this.setState({showZoneModal: false});
        layer.removeCentroids();
    }

    showZoneModal(name, activeScenarioId, activeRiskZoneId, layer) {
        return layer.showModal(
            () => <FloodPlainModalData
                scenario_id={activeScenarioId}
                risk_zone_id={activeRiskZoneId}
                onCloseTab={() => layer.removeCentroids()}
            />,
            `Zone Buildings By Scenario : ${name}`,
            this.onClose.bind(this, layer),
        );
    }

    componentDidUpdate(oldProps, oldState) {
        if (!_.isEqual(oldProps.activeScenarioId, this.props.activeScenarioId) || !_.isEqual(oldProps.agencyFilter, this.props.agencyFilter)) {
            this.fetchFalcorDeps()
        }
    }

    async fetchFalcorDeps() {
        let agencyList = BuildingByAgency
            .map(bba => bba.name)
            .filter(agency => this.props.agencyFilter.length ? this.props.agencyFilter.includes(agency) : true)

        let scenario_id = this.props.activeScenarioId.map(d => d.id),
            riskZone_id = this.props.activeRiskZoneId;

        let length = await falcorGraph.get(['building', 'byGeoid', store.getState().user.activeGeoid, 'agency', agencyList, 'length']);
        length = get(length, ['json', 'building', 'byGeoid', this.props.activeGeoid, 'agency', agencyList[0], 'length'])

        if (length) {
            let buildingCounts = await falcorGraph.get(['building', 'byGeoid', this.props.activeGeoid, 'agency', agencyList,
                'byIndex', {from: 0, to: length - 1}, ATTRIBUTES]
            );

            buildingCounts = Object.keys(get(buildingCounts, ['json', 'building', 'byGeoid', this.props.activeGeoid, 'agency', agencyList[0], 'byIndex'], {}))
                .filter(v => v !== '$__path')
                .map(v => get(buildingCounts, ['json', 'building', 'byGeoid', this.props.activeGeoid, 'agency', agencyList[0], 'byIndex', v], null))
                .filter(v => ((this.props.agencyFilter.length && this.props.agencyFilter.includes(get(v, ['agency']))) || !this.props.agencyFilter.length))
                .reduce((a, c) => {
                    let zone = Object.keys(floodZones).find(floodZone => floodZones[floodZone].includes(c.flood_zone))
                    a[zone].total.sum += 1;
                    a[zone].total.replacement_value += parseInt(c.replacement_value);
                    return a;

                }, {
                    '100 Year': {
                        'total': {'sum': 0, 'replacement_value': 0},
                        'hazus': {'sum': 0, 'replacement_value': 0}
                    },
                    '500 Year': {
                        'total': {'sum': 0, 'replacement_value': 0},
                        'hazus': {'sum': 0, 'replacement_value': 0}
                    },
                    'none': {'total': {'sum': 0, 'replacement_value': 0}, 'hazus': {'sum': 0, 'replacement_value': 0}},
                })

            let scenarioDataLength = await this.props.falcor.get(
                ['building', 'byGeoid', this.props.activeGeoid, 'agency', agencyList.join('-'), 'byRiskScenario', scenario_id, 'byRiskZone', riskZone_id, 'length']
            )
            scenarioDataLength = get(scenarioDataLength, ['json', 'building', 'byGeoid', this.props.activeGeoid, 'agency', agencyList.join('-'), 'byRiskScenario', scenario_id, 'byRiskZone', riskZone_id, 'length'], 0)

            if (scenarioDataLength){
                let scenarioDataList = await this.props.falcor.get(
                    ['building', 'byGeoid', this.props.activeGeoid, 'agency', agencyList.join('-'), 'byRiskScenario', scenario_id, 'byRiskZone', riskZone_id,  'byIndex', {
                        from: 0,
                        to: scenarioDataLength - 1
                    }, [ 'building_id', 'flood_zone', 'replacement_value']]
                )

                scenarioDataList = get(scenarioDataList, ['json', 'building', 'byGeoid', this.props.activeGeoid, 'agency', agencyList.join('-'), 'byRiskScenario', scenario_id, 'byRiskZone', riskZone_id, 'byIndex'], {})

                Object.keys(scenarioDataList)
                    .filter(f => f !== '$__path')
                    .forEach(index => {

                        let zone = Object.keys(floodZones).find(floodZone => floodZones[floodZone].includes(scenarioDataList[index].flood_zone))
                        buildingCounts[zone].hazus.sum += 1;
                        buildingCounts[zone].hazus.replacement_value += parseInt(scenarioDataList[index].replacement_value);

                    })

            }

            this.setState({buildingCounts})
        }

        return Promise.resolve();
    }

    render() {
        let buildingCounts = get(this.state, ['buildingCounts'], {});
        return (
            <div style={{'overflowX': 'auto'}}>
                <table className='table table-sm table-hover'>
                    <thead>
                    <tr>
                        <th/>
                        <th colSpan="2" style={{textIndent: '15px'}}>Total</th>
                        <th colSpan="2"
                            style={{textIndent: '5px'}}>{this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null : this.props.activeScenarioId.map(d => d.name.includes('HAZUS') ? 'HAZUS' : 'DFIRM')}</th>
                    </tr>
                    <tr>
                        <th>Zone</th>
                        <th>#</th>
                        <th>$</th>
                        {this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null :
                            <React.Fragment>
                                <th>#</th>
                                <th>$</th>
                            </React.Fragment>}
                    </tr>
                    </thead>
                    <tbody>
                    {buildingCounts ?
                        Object.keys(buildingCounts).map((d, i) => {
                            return (
                                <tr key={i}>
                                    <td>
                                        <a href={"#"}
                                           id={d.zone_geoid}
                                           name={d.zone_name}
                                           onClick={e => this.setState({
                                               showZoneModal: true,
                                           })}>
                                            {d}
                                        </a>
                                        {this.state.showZoneModal &&
                                        this.state.flood_zone === d
                                            ?
                                            this.showZoneModal(d, this.props.activeScenarioId, this.props.activeRiskZoneId, this.props.layer) : null}
                                    </td>
                                    <td>{fmt(buildingCounts[d].total.sum)}</td>
                                    <td>{fmt(buildingCounts[d].total.replacement_value)}</td>
                                    {this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null
                                        :
                                        <React.Fragment>
                                            <td>{fmt(buildingCounts[d].hazus.sum)}</td>
                                            <td>{fmt(buildingCounts[d].hazus.replacement_value)}</td>
                                        </React.Fragment>
                                    }
                                </tr>
                            )
                        }) :
                        <tr>
                            <td>Loading ...</td>
                        </tr>
                    }
                    </tbody>
                </table>
            </div>
        )

    }
}

floodPlainTable.defaultProps = {
    agencyFilter: []
}
const mapStateToProps = state => (
    {
        activePlan: state.user.activePlan,
        activeScenarioId: state.scenario.activeRiskScenarioId,
        offRiskZoneId: state.scenario.offRiskZoneId,
        activeGeoid: state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        zonesByActiveScenarioData: get(state.graph, ['building', 'byGeoid', `${state.user.activeGeoid}`]),
        zonesByBuildingsData: get(state.graph, ['form_zones', 'jurisdictions', 'byPlanId', `${state.user.activePlan}`, 'byId']),
        zonesFormsList: get(state.graph, ['forms', 'byId'], {}),
        activeRiskZoneId: state.scenario.activeRiskZoneId
    });

const mapDispatchToProps = {
    sendSystemMessage,

};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(floodPlainTable))
