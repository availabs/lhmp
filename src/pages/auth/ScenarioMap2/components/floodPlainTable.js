import React from 'react';
import {connect} from 'react-redux';
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import {reduxFalcor} from 'utils/redux-falcor'
import FloodPlainModalData from "./floodPlainModalData";
import BuildingByAgency from "../../Assets/components/BuildingsByAgencyConfig";
import {falcorGraph} from "../../../../store/falcorGraph";
import store from "store";
import * as d3 from "d3";

var _ = require("lodash")
var format =  d3.format("~s")
const fmt = (d) => d < 1000 ? d : format(d)

const floodZones = {
    'Annual 1%': {color: '#ff0031', name: '100 Year'},
    'Annual 0.2%': { color: '#005eff', name: '500 Year'},
    none: {values: [null], color: '#242323', name: 'None'}
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
        let scenario_id = this.props.activeScenarioId.map(d => d.id);
        if(this.props.activeGeoid.length === 2){
            scenario_id = ['3','4','9','10','38','12','14','15','16','40','18','19','41','43','22','44',
                '23','24','25','26','46','28','29','47','30','49','31','52','20','27','17','33','34','13','32',
                '42','36','35','53','54','55','56'];
        }

        let reqs = [
            ['building', 'statewide', 'byGeoid', this.props.activeGeoid, 'agency', 'sum', ['count', 'replacement_value']],
           ['building', 'statewide', 'byGeoid', this.props.activeGeoid, 'agency', 'byRiskScenario', scenario_id, 'byRiskZone', 'all']
        ]
            return reqs.reduce((a,c) => a.then(() => falcorGraph.get(c)), Promise.resolve())
                .then(buildingCounts => {
                    let graph = store.getState();
                    graph = get(graph, ['graph', 'building', 'statewide', 'byGeoid', this.props.activeGeoid, 'agency']);

                    let data = {
                        'Annual 1%': {'sum': 0, 'replacement_value': 0},
                        'Annual 0.2%': {'sum': 0, 'replacement_value': 0},
                        'none': {'sum': 0, 'replacement_value': 0}
                    };

                    Object.keys(get(graph, ['byRiskScenario'], {}))
                        .filter(key => key !== 'sum')
                        .forEach(scenarioId => {
                            let tmpData = get(graph, ['byRiskScenario', scenarioId, 'byRiskZone', 'all', 'value'], []);
                            tmpData
                                .filter(d => d)
                                .forEach(d => {
                                data[d.name].sum = get(data, [d.name, 'sum'], 0) + (parseInt(d.count) || 0);
                                data[d.name].replacement_value = get(data, [d.name, 'replacement_value'], 0) + (parseInt(d.sum) || 0);
                            })
                        })

                    data['none'].sum = get(graph, ['sum', 'count', 'value'], 0) - data["Annual 1%"].sum - data["Annual 0.2%"].sum;
                    data['none'].replacement_value = get(graph, ['sum', 'replacement_value', 'value'], 0) - data["Annual 1%"].replacement_value - data["Annual 0.2%"].replacement_value;
                    this.setState({data})
                })
    }

    render() {
        let buildingCounts = get(this.state, ['data'], {});
        return (
            <div style={{'overflowX': 'auto'}}>
                <table className='table table-sm table-hover'>
                    <thead>
                    <tr>
                        <th/>
                        <th/>
                        <th colSpan="3" style={{textIndent: '15px'}}>Total</th>
                        {/*<th colSpan="2"*/}
                        {/*    style={{textIndent: '5px'}}>{this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null : this.props.activeScenarioId.map(d => d.name.includes('HAZUS') ? 'HAZUS' : 'DFIRM')}</th>*/}
                    </tr>
                    <tr>
                        <th/>
                        <th>Zone</th>
                        <th>#</th>
                        <th>$</th>
                        {/*{this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null :
                            <React.Fragment>
                                <th>#</th>
                                <th>$</th>
                            </React.Fragment>}*/}
                    </tr>
                    </thead>
                    <tbody>
                    {buildingCounts ?
                        Object.keys(buildingCounts).map((d, i) => {
                            return (
                                <tr key={i}>
                                    <td><i className='fa fa-circle' style={{color: floodZones[d].color}}/></td>
                                    <td>
                                        {/*<a href={"#"}
                                           id={d.zone_geoid}
                                           name={d.zone_name}
                                           onClick={e => this.setState({
                                               showZoneModal: true,
                                           })}>
                                            {d}
                                        </a>*/}
                                        {floodZones[d].name}
                                        {this.state.showZoneModal &&
                                        this.state.flood_zone === d
                                            ?
                                            this.showZoneModal(d, this.props.activeScenarioId, this.props.activeRiskZoneId, this.props.layer) : null}
                                    </td>
                                    <td>{fmt(buildingCounts[d].sum)}</td>
                                    <td>{fmt(buildingCounts[d].replacement_value)}</td>
                                    {/*{this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null
                                        :
                                        <React.Fragment>
                                            <td>{fmt(buildingCounts[d].hazus.sum)}</td>
                                            <td>{fmt(buildingCounts[d].hazus.replacement_value)}</td>
                                        </React.Fragment>
                                    }*/}
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
