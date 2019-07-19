import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import pick from "lodash.pick"
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "../../../../store/falcorGraph";

const ATTRIBUTES =[
    'id',
    'name',
    'type',
    'parcel_id'
]
class AssetsTable extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            geoid :''
        }

    }

    componentDidUpdate(oldProps){
        if(this.props.geoid !== oldProps.geoid){
            let geoid = this.props.geoid.map((geoid) => geoid)
            return this.props.falcor.get(['building','byGeoid',this.props.geoid,'length'])
                .then(length => this.props.falcor.get(['building','byGeoid',this.props.geoid,'byIndex',{from:0,to:50},'id']))
                .then(response => {
                    const ids = [];
                    Object.values(response.json.building.byGeoid[geoid].byIndex).forEach((item)=>{
                        if (item['$__path'] !== undefined){
                            ids.push(item.id)
                        }
                    })
                    this.ids = ids
                    return ids
                })
                .then(ids => {
                    this.props.falcor.get(['building', 'byId', ids,ATTRIBUTES])
                        .then(response => {
                            return response
                        })
                })
        }


    }

    render(){
       let buildingData = [];
       let buildingIds = this.ids;
       if( this.props.buildingData !== undefined && buildingIds !== undefined){
           Object.values(this.props.buildingData).forEach((building,i) =>{
                   if(buildingIds.includes(building.id)){
                       buildingData.push(Object.values(pick(building,...ATTRIBUTES)))
                   }
           })
       }
        return (
            <div>
            <Element>
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
            </Element>
            </div>
        )
    }

    static defaultProps ={
        geoid : [36001]
    }
}

const mapStateToProps = (state,ownProps) => {
    //console.log('state',state)
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

