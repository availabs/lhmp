import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "../../../../store/falcorGraph";

const ATTRIBUTES =[
    'id',
    'name',
    'type',
    'parcel_id'
]
let cousubs = []
class AssetsTable extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            geoid:'',

        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        console.log('---',e.target.id,e.target.value)
        this.setState({...this.state,[e.target.id]: e.target.value});
    };

    fetchFalcorDeps(){
        this.props.falcor.get(['geo',this.props.geoid,'cousubs'])
            .then(res => res.json.geo[this.props.geoid].cousubs)
            .then(cousubs => this.props.falcor.get(['geo',cousubs,['name']]).then(response =>{
                return response
            }));
        this.props.falcor.get(['geo',this.props.geoid,['name']]).then(response => {
            return response
        });

        //length.json.building.byGeoid[this.props.geoid].length-1
        return this.props.falcor.get(['building','byGeoid',[this.state.geoid],'length'])
            .then(length => this.props.falcor.get(['building','byGeoid',[this.state.geoid],'byIndex',{from:0,to:50},'id']))
            .then(response => {
                const ids = [];
                Object.values(response.json.building.byGeoid[this.state.geoid].byIndex).forEach((item)=>{
                    if (item['$__path'] !== undefined){
                        ids.push(item.id)
                    }
                })
                this.ids = ids
                return ids
            })
            .then(ids => {
                this.props.falcor.get(['building', 'byId', ids, ATTRIBUTES])
                    .then(response => {
                        return response
                    })
            })

    }

    componentDidUpdate(oldProps){
        if(oldProps.geoid !== this.state.geoid){
            this.fetchFalcorDeps()
        }
    }

    render(){

       let arrayCOsubs = [];
       let buildingData = [];
       let buildingIds = this.ids;
       let countyName = '';
       let cousubsName = [];
       Object.keys(this.props.cousubs).forEach((item)=>
       {
           if(this.props.geoid.includes(parseInt(item))){

               countyName = this.props.cousubs[item].name;
               this.props.cousubs[item].cousubs.value.forEach(cousub => arrayCOsubs.push(cousub))
           }
           else{
               cousubsName.push(this.props.cousubs[item].name)
           }
       });
       if( this.props.buildingData !== undefined && buildingIds !== undefined){
           Object.values(this.props.buildingData).forEach((building,i) =>{
                   if(buildingIds.includes(building.id)){
                       buildingData.push(Object.values(building))
                   }

           })
       }
        return (
            <div>
                <Element>
                    <div className='content-i'>
                        <div className='content-box'>
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className='element-wrapper'>
                                        <div className='element-actions'>
                                            <form className='form-inline justify-content-sm-end'>
                                            <h4 className="element-header">Assets For</h4>
                                                <select className="form-control justify-content-sm-end" id='geoid' onChange={this.handleChange} value={this.state.geoid}>
                                                    <option key={1} value={this.props.geoid}>{countyName}</option>
                                                    {arrayCOsubs.map((ac,ac_i) => {
                                                        return (
                                                            <option key={ac_i+2} value={ac}>{cousubsName[ac_i]}</option>
                                                        )
                                                        })}
                                                </select>
                                                <div className="element-box">
                                                    <div className="table-responsive">
                                                        <table className="table table lightBorder">
                                                            <thead>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>NAME</th>
                                                                <th>TYPE</th>
                                                                <th>PARCEL_ID</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                buildingData.map((building) =>{
                                                                    return(
                                                                        <tr>
                                                                            <td>{building[0]}</td>
                                                                            <td>{building[1]}</td>
                                                                            <td>{building[2]}</td>
                                                                            <td>{building[3]}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        geoid : ownProps.geoid,
        cousubs: get(state.graph, 'geo',{}),
        buildingData : get(state.graph,'building.byId',{})

    }
};

const mapDispatchToProps =  {
    //sendSystemMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsTable))

