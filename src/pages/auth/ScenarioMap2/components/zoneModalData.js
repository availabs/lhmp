import React from 'react';
import { connect } from 'react-redux';
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import { register, unregister } from "components/AvlMap/ReduxMiddleware.js"
import { reduxFalcor, UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'
import * as d3 from "d3";
import styled from "styled-components";
import {Link} from "react-router-dom";
import AssetsFilteredTable from "../../Assets/components/AssetsFilteredTable";
import NewZoneAssetsFilteredTable from "./NewZoneAssetsFilteredTable";
import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig.js'
import MultiSelectFilter from 'components/filters/multi-select-filter.js'
var _ = require("lodash")
var format =  d3.format("~s")
const fmt = (d) => d < 1000 ? d : format(d)

const ZoneContainer = styled.div`
  color: ${ props => props.theme.textColor };
  padding-top: 15px;
  width: 100%;
  min-width: 700px;

  h4 {
    color: ${ props => props.theme.textColorHl };
  }
`;


class ZoneModalData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buildingByLandUse: null,
            filter: {
                domain: BuildingByLandUseConfig.filter((config) => parseInt(config.value) % 100 === 0 ? config : ''),
                value: []
            },
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleMultiSelectFilterChange = this.handleMultiSelectFilterChange.bind(this)
    }
    fetchFalcorDeps() {
        return this.props.falcor.get(
            //["building", "byId", this.props.id, TABS.filter(tab => tab.name !== 'Actions').reduce((a, c) => [...a, ...c.props], [])],
            ["parcel", "meta", ["prop_class", "owner_type"]],
            //["building","byId", this.props.id, "riskZone", "riverine", "aal"],
            //['actions', 'assets','byId',[this.props.id],['action_name','action_type']]
        )

    }

    handleChange(e) {
        this.setState({...this.state, [e.target.id]: e.target.value});
    };

    handleMultiSelectFilterChange(e) {
        let newFilter = this.state.filter;
        newFilter.value = e;
        this.setState({filter: newFilter})
    }

    renderLandUseMenu(){
        return (
            <div>
                {JSON.stringify(this.state.filter.value)}
                <MultiSelectFilter
                    filter = {this.state.filter}
                    setFilter = {this.handleMultiSelectFilterChange}
                />
            </div>
        )
    }

    render() {
        return (
            <div className='element-wrapper'>
                <div className='element-box'>
                    {this.renderLandUseMenu()}
                    <h4>Buildings By Land Use</h4>
                    {
                        this.props.geoid !== "" ?
                            <AssetsFilteredTable
                                geoid={[this.props.geoid]}
                                zone_id ={[this.props.zone_id]}
                                groupBy={'propType'}
                                groupByFilter={this.state.filter.value}
                                scenarioId={this.props.scenario_id.map(d => d.id)}
                                riskZoneId = {[this.props.risk_zone_id]}
                                height={'fit-content'}
                                width={'100%'}
                                tableClass={`table table-sm table-lightborder table-hover`}
                            />
                            :
                            <NewZoneAssetsFilteredTable
                                name = {[this.props.name]}
                                geom = {[this.props.geom]}
                                geoid = {[this.props.geoid]}
                                zone_id ={[this.props.zone_id]}
                                groupBy = {'propType'}
                                groupByFilter = {this.state.filter.value}
                                scenarioId={this.props.scenario_id.map(d => d.id)}
                                riskZoneId = {[this.props.risk_zone_id]}
                                height={'fit-content'}
                                width={'100%'}
                                tableClass={`table table-sm table-lightborder table-hover`}
                            />
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => (
    {
        activePlan : state.user.activePlan,
        activeScenarioId:state.scenario.activeRiskZoneId,
        offRiskZoneId:state.scenario.offRiskZoneId,
        activeGeoid:state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        zonesData : get(state.graph,['zones','byPlanId']),
        scenarioByZonesData : get(state.graph,['building','byGeoid',`${state.user.activeGeoid}`]),
        riskZoneId: state.scenario.activeRiskZoneId
    });

const mapDispatchToProps = {
    sendSystemMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ZoneModalData))