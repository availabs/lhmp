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
var _ = require("lodash")

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
    }

    componentDidMount(){
        this.fetchFalcorDeps()
            .then(data =>{
                return data
            })
    }

    fetchFalcorDeps(){
        if(this.props.zones){
            let zone_geoids = [];
            let zone_ids = [];
            this.props.zones.forEach(item =>{
                zone_geoids.push(item.geoid)
                zone_ids.push(item.zone_id)
            });
            return this.props.falcor.get(['zones','byPlanId',this.props.activePlan,'byId',zone_ids,'byGeoid',zone_geoids,'sum',['num_buildings','replacement_value']])
                .then(response =>{
                    let data = []
                    let format = d3.format("~s");
                    let graph = response.json.zones.byPlanId[this.props.activePlan].byId
                    if(graph){
                        this.props.zones.forEach(zone =>{
                            Object.keys(graph).forEach(zone_id =>{
                                if(graph[zone_id].byGeoid){
                                    Object.keys(graph[zone_id].byGeoid).forEach(geoid =>{
                                        if(geoid === zone.geoid){
                                            if(graph[zone_id].byGeoid[zone.geoid].sum.num_buildings && graph[zone_id].byGeoid[zone.geoid].sum.replacement_value){
                                                data.push({
                                                    zone_id : zone.zone_id,
                                                    zone_name: zone.name,
                                                    num_buildings: graph[zone_id].byGeoid[zone.geoid].sum.num_buildings ? format(graph[zone_id].byGeoid[zone.geoid].sum.num_buildings) : '',
                                                    replacement_value : graph[zone_id].byGeoid[zone.geoid].sum.replacement_value ? format(graph[zone_id].byGeoid[zone.geoid].sum.replacement_value) :''
                                                })
                                            }

                                        }
                                    })
                                }

                            })
                        });
                    }
                    this.setState({
                        data : data
                    })
                    return response
                })


        }

    }


    removeZone(e){
        let ids = [];
        ids = JSON.parse(localStorage.getItem('zone')) || []
        ids = ids.filter( id => id.toString() !== e.target.id);
        localStorage.setItem('zone', JSON.stringify(ids));
        let data = this.state.data
        this.setState({
            data : data.filter(d => d.zone_id.toString() !== e.target.id)
        })


    }

    render(){
        return (
            <div>
                <table className='table table-sm table-hover'>
                    <thead>
                    <tr>
                        <th>Zone</th>
                        <th># Number of Buildings</th>
                        <th>$ Replacement Value</th>
                        <th>Remove Zone</th>
                    </tr>
                    </thead>
                    <tbody>
                    { this.state.data.length > 0 ? this.state.data.map(d =>{
                            return (
                                <tr>
                                    <td>{d.zone_name}</td>
                                    <td>{d.num_buildings}</td>
                                    <td>${d.replacement_value}</td>
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
                        null
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
        activeGeoid:state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        zonesData : get(state.graph,['zones','byPlanId']),
        riskZoneId: state.scenario.activeRiskZoneId
    });

const mapDispatchToProps = {
    sendSystemMessage,
    setActiveRiskZoneId,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ZoneTable))
