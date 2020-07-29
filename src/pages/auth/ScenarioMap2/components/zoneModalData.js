import React from 'react';
import { connect } from 'react-redux';
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import { reduxFalcor, UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'
import * as d3 from "d3";
import styled from "styled-components";
import AssetsFilteredTable from "../../Assets/components/AssetsFilteredTable";
import NewZoneAssetsFilteredTable from "./NewZoneAssetsFilteredTable";

import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig.js'
import MultiSelectFilter from 'components/filters/multi-select-filter.js'
import {ListWithoutUrl} from 'pages/auth/Assets/components/AssetsListByTypeByHazard.js'
import AvlModal from 'components/AvlStuff/DraggableModal'
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

const DIV = styled.div`
  ${ props => props.theme.scrollbar };
  max-height: 50vh;
  overflow: auto;
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
            links: [],
            activeLink: undefined,
            prevActiveLink: undefined
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleMultiSelectFilterChange = this.handleMultiSelectFilterChange.bind(this)
        this.renderNav = this.renderNav.bind(this)
        this.setLink = this.setLink.bind(this)
        this.renderAll = this.renderAll.bind(this)
        this.renderData = this.renderData.bind(this)
        this.renderLink = this.renderLink.bind(this)
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
                <MultiSelectFilter
                    filter = {this.state.filter}
                    setFilter = {this.handleMultiSelectFilterChange}
                />
            </div>
        )
    }
    setLink(link){
        this.setState({links: _.uniqBy([...this.state.links, link], 'link'), prevActiveLink: this.state.activeLink, activeLink: link.link})
    }
    renderNav(){
        return (
            <div className="os-tabs-controls">
                <ul className="nav nav-tabs upper">
                    <li className="nav-item">
                        <a aria-expanded="false"
                           className={!this.state.activeLink ? "nav-link active" : "nav-link"}
                           onClick={() => this.setState({prevActiveLink: this.state.activeLink, activeLink: undefined})}
                           data-toggle="tab"
                           href="#tab_overview"> All</a>
                    </li>
                    {this.state.links.map(link =>
                        <li className="nav-item">
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <a aria-expanded="false"
                                   style={{marginRight: 0}}
                                   className={this.state.activeLink === link.link ? "nav-link active" : "nav-link"}
                                   onClick={() => this.setState({prevActiveLink: this.state.activeLink, activeLink: link.link})}
                                   href="#"> {`${link.header} x ${link.row0}`}</a>
                                <div
                                    style={{padding: '0.5vw', cursor: 'pointer'}}
                                    className="nav-item"
                                    onClick={() => {
                                        this.setState({
                                            links: this.state.links.filter(f => f.link !== link.link),
                                            prevActiveLink: undefined,
                                            activeLink: this.state.prevActiveLink
                                        })
                                    }}> x </div>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        )
    }

    renderAll(){
        console.log('id',this.props.zone_id,this.props.geoid)
        return (
            <React.Fragment>
                {this.renderLandUseMenu()}
                <h4>Buildings By Land Use</h4>
                {
                    this.props.type === 'zones' ?

                        <NewZoneAssetsFilteredTable
                            zone_id ={[this.props.zone_id]}
                            groupBy={'propType'}
                            groupByFilter={this.state.filter.value}
                            scenarioId={this.props.scenario_id.map(d => d.id)}
                            riskZoneId = {[this.props.risk_zone_id]}
                            height={'fit-content'}
                            width={'100%'}
                            tableClass={`table table-sm table-lightborder table-hover`}
                            linkOnClick={this.setLink.bind(this)}
                        />

                        :

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
                            linkOnClick={this.setLink.bind(this)}
                        />

                }
            </React.Fragment>
        )
    }

    getParam(link, param){
        return link.indexOf(param) > -1 ? link[link.indexOf(param) + 1] : undefined
    }

    renderLink(){
        let link = this.state.activeLink.split('/')
        return <ListWithoutUrl
            size={5}
            match={
                {
                    url: this.state.activeLink,
                    params: {
                        type: this.getParam(link, 'list'),
                        typeIds: this.getParam(link, this.getParam(link, 'list')),
                        hazardIds: this.getParam(link, 'hazard'),
                        scenarioIds: this.getParam(link, 'scenario'),
                        riskzoneIds: this.getParam(link, 'riskZone'),
                        geoid: link.includes('geo') ? this.getParam(link, 'geo') : this.getParam(link, 'geoid'),
                    }
                }
            }
        />
    }

    renderData(){
        return <DIV>{this.state.activeLink ? this.renderLink() : this.renderAll()}</DIV>
    }
    render() {
        return (
            <AvlModal show={true} onClose={this.props.onClose}>
                <div>
                    <h4>{this.props.title}</h4>
                    {this.renderNav()}
                    {this.renderData()}
                </div>
            </AvlModal>
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