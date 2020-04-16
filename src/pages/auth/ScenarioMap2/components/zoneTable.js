import React from 'react';
import { connect } from 'react-redux';
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import { register, unregister } from "components/AvlMap/ReduxMiddleware.js"
import { reduxFalcor, UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'

import * as d3 from "d3";
import ZoneModalData from "./zoneModalData";

var _ = require("lodash")
var format =  d3.format("~s")
const fmt = (d) => d < 1000 ? d : format(d)

const showZoneModal = (zone_geoid,name,activeScenarioId,activeRiskZoneId,geom,setState) => {
    return (
        <div aria-labelledby="mySmallModalLabel" className="modal fade bd-example-modal-lg show" role="dialog"
             tabIndex="-1" aria-modal="true" style={{paddingRight: '15px', display: 'block'}}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header"><h5 className="modal-title" id="exampleModalLabel">Zone Buildings By Scenario : {name}</h5>
                        <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                onClick={() => setState({ showZoneModal: false })}
                        >
                            <span aria-hidden="true"> ×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <ZoneModalData
                            name = {name}
                            geoid ={zone_geoid}
                            scenario_id = {activeScenarioId}
                            risk_zone_id ={activeRiskZoneId}
                            geom = {geom}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

class ZoneTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zone_clicked:false,
            data: [],
            zone_id : ''
        }
        //this.populateZonesData = this.populateZonesData.bind(this)
    }

    componentDidUpdate(oldProps,oldState){

        if(oldProps.zones.length !== this.props.zones.length){
            this.fetchFalcorDeps()
        }
        if(oldProps.activeScenarioId !== this.props.activeScenarioId){
            this.fetchFalcorDeps()
        }
        if(oldProps.zone_id !== this.props.zone_id){
            this.fetchFalcorDeps()
        }
    }

    componentDidMount(){
        this.fetchFalcorDeps()

    }

    fetchFalcorDeps(){
        if(this.props.zones){
            console.log('in fetch of zone table',this.props.activeMode)
            let new_zones = [];
            let zone_geoid = [];
            let zone_id = [];
            let data = []
            let graph_zones = {}
            let scenario_id = []
            this.props.zones.forEach(item =>{
                if(item.geoid !== null){
                    zone_geoid.push(item.geoid)
                    zone_id.push(item.zone_id)
                }
                if(item.geom){
                    new_zones.push({
                        zone_id:item.zone_id,
                        geoid: item.geoid,
                        geom: item.geom,
                        name:item.name
                    })
                }
            });

            if(this.props.activeScenarioId){
               this.props.activeScenarioId.forEach(item =>{
                    if(scenario_id.length === 0){
                        scenario_id.push(item.id)
                    }

                })
            }

            return this.props.falcor.get(['zones','byPlanId',this.props.activePlan,'byId',zone_id,'byGeoid',zone_geoid,'sum',['num_buildings','replacement_value']])
                .then(response =>{
                    graph_zones = response.json.zones.byPlanId[this.props.activePlan].byId
                    if(zone_geoid.length > 0){
                        zone_geoid.forEach(geoid =>{
                            if(geoid.length === 5){
                                this.props.falcor.get(['building', 'byGeoid', this.props.activeGeoid, 'county', geoid, 'byRiskScenario',scenario_id, 'byRiskZone', 'all'])
                                    .then(response =>{
                                        return response
                                    })
                            }else{
                                this.props.falcor.get(['building', 'byGeoid', this.props.activeGeoid, 'jurisdiction',geoid, 'byRiskScenario',scenario_id, 'byRiskZone', 'all'])
                                    .then(response =>{
                                        return response
                                    })
                            }
                        })
                        if(new_zones.length > 0){
                            new_zones.forEach((zone,i) =>{
                                this.props.falcor.get(['zones','byPlanId',this.props.activePlan,'byName',zone.name,'byGeom',zone.geom,['none'],['none'],'buildings','sum',['count','replacement_value']])
                                    .then(response =>{
                                        return response
                                    }).catch(function(err){
                                    console.error(err); // This will print any error that was thrown in the previous error handler.
                                });
                                this.props.falcor.get(['zones','byPlanId',this.props.activePlan,'byName',zone.name,'byGeom',zone.geom,['none'],['none'],'byRiskScenario',scenario_id,'byRiskZone','all'])
                                    .then(response =>{
                                        return response
                                    }).catch(function(err){
                                    console.error(err); // This will print any error that was thrown in the previous error handler.
                                });
                                //}

                            })
                        }
                    }
                    if(graph_zones && this.props.scenarioByZonesData){
                        let graph_scenario_county = this.props.scenarioByZonesData.county
                        let graph_scenario_jurisdiction = this.props.scenarioByZonesData.jurisdiction;
                        let graph = {}
                        this.props.zones.forEach(zone =>{
                            if(zone.geoid && zone.geoid.length === 5){
                                graph = get(graph_zones,`${zone.zone_id}.byGeoid.${zone.geoid}.sum`,{})
                                let graph_county = get(graph_scenario_county,`${zone.geoid}.byRiskScenario.${scenario_id}.byRiskZone.all.value`,[])
                                data.push({
                                    zone_geoid : zone.geoid,
                                    zone_id : zone.zone_id,
                                    zone_name : zone.name || '',
                                    num_buildings : graph.num_buildings ? fmt(graph.num_buildings) :0,
                                    replacement_value : graph.replacement_value ? fnum(graph.replacement_value) : 0,
                                    count_buildings_scenarios:fmt(graph_county.reduce((a, b) => a + (parseInt(b['count']) || 0), 0)),
                                    sum_buildings_value : fnum(graph_county.reduce((a, b) => a + (parseInt(b['sum']) || 0), 0))
                                })
                            }if(zone.geoid && zone.geoid.length > 5){
                                graph = get(graph_zones,`${zone.zone_id}.byGeoid.${zone.geoid}.sum`,{})
                                let graph_jurisdiction = get(graph_scenario_jurisdiction,`${zone.geoid}.byRiskScenario.${scenario_id}.byRiskZone.all.value`,[])
                                data.push({
                                    zone_geoid : zone.geoid,
                                    zone_id : zone.zone_id,
                                    zone_name : zone.name || '',
                                    num_buildings : graph.num_buildings ? fmt(graph.num_buildings) :0,
                                    replacement_value : graph.replacement_value ? fnum(graph.replacement_value) : 0,
                                    count_buildings_scenarios: fmt(graph_jurisdiction.reduce((a, b) => a + (parseInt(b['count']) || 0), 0)),
                                    sum_buildings_value : fnum(graph_jurisdiction.reduce((a, b) => a + (parseInt(b['sum']) || 0), 0))
                                })
                            }

                        });

                        if(this.props.newZonesData){
                            Object.keys(this.props.newZonesData).forEach(item =>{
                                new_zones.forEach(z_g =>{
                                    if(z_g['name'] === item && this.props.newZonesData[item].byGeom[z_g['geom']] && this.props.newZonesData[item].byGeom[z_g['geom']].none.none.buildings) {
                                        let graph = get(this.props.newZonesData,`${item}.byGeom`,{})
                                        let graph_new_zone_buildings = {}
                                        let graph_new_zone_scenarios = {}
                                        if(graph && Object.keys(graph).length > 0){
                                            Object.values(graph).forEach(item =>{
                                                graph_new_zone_buildings = get(item,`none.none.buildings.sum`,{})
                                                graph_new_zone_scenarios = get(item,`none.none.byRiskScenario.${scenario_id}.byRiskZone.all.value`,[])
                                            })
                                            data.push({
                                                zone_id: z_g['zone_id'],
                                                zone_name: item,
                                                num_buildings: fmt( graph_new_zone_buildings.count ? graph_new_zone_buildings.count.value : 0),
                                                replacement_value: fnum(graph_new_zone_buildings.replacement_value ? graph_new_zone_buildings.replacement_value.value : 0),
                                                zone_geom: z_g['geom'],
                                                count_buildings_scenarios : fmt(graph_new_zone_scenarios.reduce((a, b) => a + (parseInt(b['count']) || 0), 0)),
                                                sum_buildings_value : fnum(graph_new_zone_scenarios.reduce((a, b) => a + (parseInt(b['sum']) || 0), 0))
                                            })
                                        }
                                    }

                                })
                            })

                        }
                    }
                    this.setState({
                        data : _.uniqBy(data,'zone_id')
                    })
                    return response

                })

        }
    }

    removeZone(e){
        let ids = [];
        ids = JSON.parse("[" + localStorage.getItem("zone") + "]")[0] || [];
        ids = ids.filter( id => id.id.toString() !== e.target.id);
        localStorage.setItem('zone', JSON.stringify(ids));
        let data = this.state.data
        this.setState({
            data : data.filter(d => d.zone_id.toString() !== e.target.id)
        })
        this.props.noShowBoundary.showTownBoundary(localStorage.getItem("zone"))
    }

    render(){

        return (
            <div>
                <table className='table table-sm table-hover'>
                    <thead>
                    <tr>
                        <th/><th colSpan='2'>Total</th><th colSpan='2'>{this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null : this.props.activeScenarioId.map(d => d.name.includes('hazus') ? 'HAZUS' : 'DFIRM')}</th>
                    </tr>
                    <tr>
                        <th>Zone</th><th>#</th><th>$</th>{this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null : <React.Fragment><th>#</th><th>$</th></React.Fragment>}
                    </tr>
                    </thead>
                    <tbody>
                    { this.state.data.length > 0 ? this.state.data.map((d,i) =>{
                            return (
                                <tr key ={i}>
                                    <td>
                                        <a href={"#"}
                                           id={d.zone_geoid}
                                           name={d.zone_name}
                                           onClick={e => this.setState({
                                               showZoneModal: true,
                                               geoid : e.target.id,
                                               name: e.target.name,
                                               geom : d.zone_name === e.target.name ? d.zone_geom : ''
                                           })}>
                                            {d.zone_name}
                                        </a>
                                        {this.state.showZoneModal ? showZoneModal(this.state.geoid,this.state.name,this.props.activeScenarioId,this.props.activeRiskZoneId,this.state.geom,this.setState.bind(this)) : null}
                                    </td>
                                    <td>{d.num_buildings}</td>
                                    <td>{d.replacement_value}</td>
                                    {this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null
                                        :
                                        <React.Fragment>
                                            <td>{d.count_buildings_scenarios}</td>
                                            <td>{d.sum_buildings_value}</td>
                                        </React.Fragment>
                                    }
                                    <td>
                                        <div id={`closeMe`+ d.zone_id}>
                                            <button
                                                aria-label="Close"
                                                className="close"
                                                data-dismiss="alert"
                                                type="button"
                                                onClick={(e) =>{
                                                    this.removeZone(e)
                                                    this.setState({
                                                        zone_clicked : !this.state.zone_clicked
                                                    })
                                                }}
                                            >
                                                <span aria-hidden="true"
                                                      id = {d.zone_id}
                                                >×</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                    }):
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

const mapStateToProps = state => (
    {
        activePlan : state.user.activePlan,
        activeScenarioId:state.scenario.activeRiskScenarioId,
        offRiskZoneId:state.scenario.offRiskZoneId,
        activeGeoid:state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        zonesData : get(state.graph,['zones','byPlanId']),
        scenarioByZonesData : get(state.graph,['building','byGeoid',`${state.user.activeGeoid}`]),
        newZonesData : get(state.graph,['zones','byPlanId',`${state.user.activePlan}`,'byName']),
        activeRiskZoneId: state.scenario.activeRiskZoneId
    });

const mapDispatchToProps = {
    sendSystemMessage,

};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ZoneTable))
