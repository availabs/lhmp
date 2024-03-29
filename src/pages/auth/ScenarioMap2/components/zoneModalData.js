import React from 'react';
import {connect} from 'react-redux';
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import {reduxFalcor} from 'utils/redux-falcor'
import * as d3 from "d3";
import styled from "styled-components";
import AssetsFilteredTable from "../../Assets/components/AssetsFilteredTable";
import NewZoneAssetsFilteredTable from "./NewZoneAssetsFilteredTable";
import {setActiveCentroids} from "../../../../store/modules/centroids";
import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig.js'
import MultiSelectFilter from 'components/filters/multi-select-filter.js'
import {ListWithoutUrl} from 'pages/auth/Assets/components/AssetsListByTypeByHazard.js'

var _ = require("lodash")
var format = d3.format("~s")
const fmt = (d) => d < 1000 ? d : format(d)

const ZoneContainer = styled.div`
  color: ${props => props.theme.textColor};
  padding-top: 15px;
  width: 100%;
  min-width: 700px;

  h4 {
    color: ${props => props.theme.textColorHl};
  }
`;

const DIV = styled.div`
  table { background-color: #efefef; }
  ${props => props.theme.scrollbar};
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
            ['forms', 'byId', this.props.zone_id]
            //["building","byId", this.props.id, "riskZone", "riverine", "aal"],
            //['actions', 'assets','byId',[this.props.id],['action_name','action_type']]
        ).then(res => {
            let buildings = get(this.props.formsData, `attributes.building_id`, [])

            if (!(buildings && buildings.length)) return Promise.resolve();
            if (buildings.length > 100) {
                let requests = [];
                for (let i = 0; i < buildings.length; i += 100) {
                    requests.push(['building', 'geom', 'byBuildingId', buildings.slice(i, i + 100), 'centroid'])
                }

                return requests.reduce((a, c) => a.then(() => this.props.falcor.get(c)), Promise.resolve())
            } else {
                return this.props.falcor.get(
                    ['building', 'geom', 'byBuildingId', buildings, 'centroid']
                )
            }

        })

    }

    handleChange(e) {
        this.setState({...this.state, [e.target.id]: e.target.value});
    };

    handleMultiSelectFilterChange(e) {
        let newFilter = this.state.filter;
        newFilter.value = e;
        this.setState({filter: newFilter})
    }

    renderLandUseMenu() {
        return (
            <div style={{backgroundColor: 'white'}}>
                <MultiSelectFilter
                    filter={this.state.filter}
                    setFilter={this.handleMultiSelectFilterChange}
                />
            </div>
        )
    }

    setLink(link) {
        this.setState({
            links: _.uniqBy([...this.state.links, link], 'link'),
            prevActiveLink: this.state.activeLink,
            activeLink: link.link
        })
    }

    renderNav() {

        return (
            <div className="os-tabs-controls">
                <ul className="nav nav-tabs upper">
                    {this.props.type === 'zones' ?
                        <li className="nav-item" key={`info-0`}>
                            <div aria-expanded="false"
                                 className={this.state.activeLink === 'info-0' ? "nav-link active" : "nav-link"}
                                 onClick={() => this.setState({
                                     prevActiveLink: this.state.activeLink,
                                     activeLink: 'info-0'
                                 })}
                                 data-toggle="tab"
                            > Info
                            </div>
                        </li>
                        : null}

                    <li className="nav-item" key={`nav-0`}>
                        <div aria-expanded="false"
                             className={!this.state.activeLink ? "nav-link active" : "nav-link"}
                             onClick={() => this.setState({
                                 prevActiveLink: this.state.activeLink,
                                 activeLink: undefined
                             })}
                             data-toggle="tab"
                        > All
                        </div>
                    </li>
                    {this.state.links.map((link, linkI) =>
                        <li className="nav-item" key={`nav-${linkI + 1}`}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div aria-expanded="false"
                                     style={{marginRight: 0}}
                                     className={this.state.activeLink === link.link ? "nav-link active" : "nav-link"}
                                     onClick={() => this.setState({
                                         prevActiveLink: this.state.activeLink,
                                         activeLink: link.link
                                     })}
                                > {`${link.header} x ${link.row0}`}</div>
                                <div
                                    style={{padding: '0.5vw', cursor: 'pointer'}}
                                    className="nav-item"
                                    onClick={(e) => {
                                        this.setState({
                                            links: this.state.links.filter(f => f.link !== link.link),
                                            prevActiveLink: undefined,
                                            activeLink: this.state.prevActiveLink
                                        })
                                        if (this.props.onCloseTab) {
                                            this.props.onCloseTab.bind(this, e)
                                        }
                                    }}> x
                                </div>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        )
    }

    renderAll() {
        return (
            <React.Fragment>
                {this.renderLandUseMenu()}
                {
                    this.props.type === 'zones' ?

                        <NewZoneAssetsFilteredTable
                            geoid={[this.props.geoid]}
                            zone_id={[this.props.zone_id]}
                            groupBy={'propType'}
                            groupByFilter={this.state.filter.value}
                            scenarioId={this.props.scenario_id.map(d => d.id)}
                            riskZoneId={[this.props.risk_zone_id]}
                            height={'fit-content'}
                            width={'100%'}
                            tableClass={`table table-sm table-lightborder table-hover`}
                            linkOnClick={this.setLink.bind(this)}
                        />

                        :

                        <AssetsFilteredTable
                            geoid={[this.props.geoid]}
                            zone_id={[this.props.zone_id]}
                            groupBy={'propType'}
                            groupByFilter={this.state.filter.value}
                            scenarioId={this.props.scenario_id.map(d => d.id)}
                            riskZoneId={[this.props.risk_zone_id]}
                            height={'fit-content'}
                            width={'100%'}
                            tableClass={`table table-sm table-lightborder table-hover`}
                            linkOnClick={this.setLink.bind(this)}
                        />

                }
            </React.Fragment>
        )
    }

    getParam(link, param) {
        return link.indexOf(param) > -1 ? link[link.indexOf(param) + 1] : undefined
    }

    renderInfo() {
        return (
            <div className='table-responsive'>
                <table className='table table-sm table-hover'>
                    <thead>
                    <tr>
                        <th>Attribute</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        Object.keys(get(this.props, `formsData.attributes`, {}))
                            .filter(key => ['zone_type', 'name', 'comment'].includes(key))
                            .map(key =>
                                <tr>
                                    <td>{key}</td>
                                    <td>{get(this.props, `formsData.attributes`, {})[key]}</td>
                                </tr>)
                    }
                    </tbody>
                </table>
            </div>
        )
    }

    renderLink() {
        let link = this.state.activeLink.split('/')
        return <ListWithoutUrl
            size={100}
            zone_id={[this.props.zone_id]}
            groupBy={'propType'}
            groupByFilter={this.state.filter.value}
            scenarioId={this.props.scenario_id.map(d => d.id)}
            riskZoneId={[this.props.risk_zone_id]}
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
            dataChange={(data) => {
                let paginatedBuildings = data.map(d => parseInt(get(d, `building_id`, 0)))
                if (this.props.centroidData && paginatedBuildings.length) {

                    let newCentroids = Object.keys(this.props.centroidData)
                        .reduce((a, building_id) => {
                            if (paginatedBuildings.includes(parseInt(building_id))) {
                                a[building_id] = this.props.centroidData[building_id]
                            }
                            return a;
                        }, {})
                    this.props.setActiveCentroids(
                        newCentroids, this.props.type
                    )
                }
            }}
            buildings={this.props.type === 'zones' ? get(this.props.formsData, `attributes.building_id`, []) : null}
        />
    }

    renderData() {
        return <DIV>
            {
                this.state.activeLink ?
                    this.state.activeLink === 'info-0' ?
                        this.renderInfo() :
                        this.renderLink() :
                    this.renderAll()
            }
        </DIV>
    }

    render() {
        return (
            <div style={{padding: '10px'}}>
                <h4>{this.props.title}</h4>
                <h6>Buildings By Land Use</h6>
                {this.renderNav()}
                {this.renderData()}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        activePlan: state.user.activePlan,
        activeScenarioId: state.scenario.activeRiskZoneId,
        offRiskZoneId: state.scenario.offRiskZoneId,
        activeGeoid: state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        zonesData: get(state.graph, ['zones', 'byPlanId']),
        formsData: get(state.graph, ['forms', 'byId', ownProps.zone_id, 'value']),
        centroidData: get(state.graph, ['building', 'geom', 'byBuildingId']),
        scenarioByZonesData: get(state.graph, ['building', 'byGeoid', `${state.user.activeGeoid}`]),
        riskZoneId: state.scenario.activeRiskZoneId
    }
};

const mapDispatchToProps = {
    sendSystemMessage, setActiveCentroids
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ZoneModalData))