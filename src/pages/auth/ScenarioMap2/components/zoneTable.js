import React from 'react';
import { connect } from 'react-redux';
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import { register, unregister } from "components/AvlMap/ReduxMiddleware.js"
import { reduxFalcor, UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'
import { setActiveRiskZoneId } from 'store/modules/scenario'
import * as d3 from "d3";
import ZoneModalData from "./zoneModalData";

var _ = require("lodash")
var format =  d3.format("~s")
const fmt = (d) => d < 1000 ? d : format(d)

const showZoneModal = (zone_geoid,name,activeScenarioId,setState) => {
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
                            geoid ={zone_geoid}
                            scenario_id = {activeScenarioId}
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
            data: []
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
    }

    componentDidMount(){
        this.fetchFalcorDeps()
            .then(data =>{
                return data
            })

    }


    fetchFalcorDeps(){
        if(this.props.zones){
            //console.log('in fetch of zone table',this.props.activeMode)
            let zone_geoids = [];
            let zone_ids = [];
            let count_buildings_scenarios_county = 0;
            let sum_buildings_value_county = 0
            let count_buildings_scenarios_cousub = 0;
            let sum_buildings_value_cousub = 0
            let data = []
            let graph_zones = {}
            let scenario_id = []
            this.props.zones.forEach(item =>{
                zone_geoids.push(item.geoid)
                zone_ids.push(item.zone_id)
            });
            if(this.props.activeScenarioId){
               this.props.activeScenarioId.forEach(item =>{
                    if(scenario_id.length === 0){
                        scenario_id.push(item.id)
                    }

                })
            }
            return this.props.falcor.get(['zones','byPlanId',this.props.activePlan,'byId',zone_ids,'byGeoid',zone_geoids,'sum',['num_buildings','replacement_value']])
                .then(response =>{
                    graph_zones = response.json.zones.byPlanId[this.props.activePlan].byId
                    if(zone_geoids.length > 0){
                        zone_geoids.forEach(geoid =>{
                            if(geoid.length === 5){
                                this.props.falcor.get(['building', 'byGeoid', this.props.activeGeoid, 'county', [geoid], 'byRiskScenario',scenario_id, 'byRiskZone', 'all'])
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
                    }
                    if(graph_zones && this.props.scenarioByZonesData){
                        let graph_scenario_county = this.props.scenarioByZonesData.county
                        let graph_scenario_jurisdiction = this.props.scenarioByZonesData.jurisdiction;
                        this.props.zones.forEach(zone =>{
                            Object.keys(graph_zones).forEach(zone_id =>{
                                if(graph_zones[zone_id].byGeoid){
                                    Object.keys(graph_zones[zone_id].byGeoid).forEach(geoid =>{
                                        if(geoid === zone.geoid){
                                            if(graph_zones[zone_id].byGeoid[zone.geoid].sum.num_buildings && graph_zones[zone_id].byGeoid[zone.geoid].sum.replacement_value){
                                                data.push({
                                                    zone_geoid:geoid,
                                                    zone_id : zone.zone_id,
                                                    zone_name: zone.name,
                                                    num_buildings: graph_zones[zone_id].byGeoid[zone.geoid].sum.num_buildings ? fmt(graph_zones[zone_id].byGeoid[zone.geoid].sum.num_buildings) : '',
                                                    replacement_value : graph_zones[zone_id].byGeoid[zone.geoid].sum.replacement_value ? fnum(graph_zones[zone_id].byGeoid[zone.geoid].sum.replacement_value) :''
                                                })
                                            }


                                        }
                                    })
                                }

                            })
                        });
                        if(this.props.scenarioByZonesData && this.props.scenarioByZonesData.county){

                            Object.keys(graph_scenario_county).forEach(county =>{
                                if(graph_scenario_county[county].byRiskScenario[scenario_id] && graph_scenario_county[county].byRiskScenario[scenario_id].byRiskZone.all){
                                    graph_scenario_county[county].byRiskScenario[scenario_id].byRiskZone.all.value.forEach(item =>{
                                        data.forEach(d =>{
                                            if(d.zone_geoid === item.geoid){

                                                count_buildings_scenarios_county += parseInt(item.count)
                                                sum_buildings_value_county += parseFloat(item.sum)
                                                d['zone_geoid']=item.geoid
                                                d['count_buildings_scenarios'] = fmt(count_buildings_scenarios_county)
                                                d['sum_buildings_value'] = fnum(sum_buildings_value_county)
                                            }
                                        })
                                    })
                                }
                            });
                        }
                        if( this.props.scenarioByZonesData && this.props.scenarioByZonesData.jurisdiction){

                            Object.keys(graph_scenario_jurisdiction).forEach(jurisdiction =>{
                                if(graph_scenario_jurisdiction[jurisdiction].byRiskScenario[scenario_id] && graph_scenario_jurisdiction[jurisdiction].byRiskScenario[scenario_id].byRiskZone.all){
                                    graph_scenario_jurisdiction[jurisdiction].byRiskScenario[scenario_id].byRiskZone.all.value.forEach(item =>{
                                        data.forEach(d =>{
                                            if(d.zone_geoid === item.cousub_geoid){
                                                count_buildings_scenarios_cousub += parseInt(item.count)
                                                sum_buildings_value_cousub += parseFloat(item.sum)
                                                d['zone_geoid']=item.cousub_geoid
                                                d['count_buildings_scenarios'] = fmt(count_buildings_scenarios_cousub)
                                                d['sum_buildings_value'] = fnum(sum_buildings_value_cousub)
                                            }
                                        })
                                    })
                                }

                            })
                        }


                    }
                    //console.log('data',data)
                    this.setState({
                        data : data
                    })
                    return response
                })


        }
    }

    removeZone(e){
        let ids = [];
        ids = JSON.parse("[" + localStorage.getItem("zone") + "]")[0] || []
        ids = ids.filter( id => id.id.toString() !== e.target.id);
        localStorage.setItem('zone', JSON.stringify(ids));
        let data = this.state.data
        this.setState({
            data : data.filter(d => d.zone_id.toString() !== e.target.id)
        })
        this.props.noShowBoundary.noShowTownBoundary(localStorage.getItem("zone"))

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
                        <th>Zone</th><th>#</th><th>$</th>{this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null : <><th>#</th><th>$</th></>}
                    </tr>
                    </thead>
                    <tbody>
                    { this.state.data.length > 0 ? this.state.data.map(d =>{
                            return (
                                <tr>
                                    <td>
                                        <a href={"#"}
                                           id={d.zone_geoid}
                                           name={d.zone_name}
                                           onClick={e => this.setState({
                                               showZoneModal: true,
                                               geoid : e.target.id,
                                               name: e.target.name
                                           })}>
                                            {d.zone_name}
                                        </a>
                                        {this.state.showZoneModal ? showZoneModal(this.state.geoid,this.state.name,this.props.activeScenarioId,this.setState.bind(this)) : null}
                                    </td>

                                    <td>{d.num_buildings}</td>
                                    <td>{d.replacement_value}</td>
                                    {this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null
                                        :
                                        <>
                                            <td>{d.count_buildings_scenarios}</td>
                                            <td>{d.sum_buildings_value}</td>
                                        </>
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
                        <div>Loading ...</div>
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
    setActiveRiskZoneId,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ZoneTable))
