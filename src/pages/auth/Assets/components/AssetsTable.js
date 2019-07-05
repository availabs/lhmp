import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'

const ATTRIBUTES =[
    'id',
    'name',
    'type',
    'parcel_id'
]
class AssetsTable extends React.Component{
    constructor(props){
        super(props)
    }



    fetchFalcorDeps(){

        this.props.falcor.get(['geo',this.props.geoid,'cousubs'])
            .then(res => {
                return res.json.geo[this.props.geoid].cousubs
            })
        //length.json.building.byGeoid[this.props.geoid].length-1
        return this.props.falcor.get(['building','byGeoid',this.props.geoid,'length'])
            .then(length => this.props.falcor.get(['building','byGeoid',this.props.geoid,'byIndex',{from:0,to:10},'id']))
            .then(response => {
                const ids =[];
                Object.values(response.json.building.byGeoid[this.props.geoid].byIndex).forEach((item)=>{
                    if (item['$__path'] !== undefined){
                        ids.push(item['$__path'][4])
                    }
                })

                return ids
            })
            .then(ids =>{
                this.props.falcor.get(['building','byId',ids,ATTRIBUTES])
                    .then(response => console.log('response',response))
            })



    }

    render(){
           let arrayCOsubs = [];
           Object.values(this.props.cousubs).forEach((item)=>
           {item.cousubs.value.forEach(cousub => arrayCOsubs.push(cousub))});
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
                                                <select className="form-control justify-content-sm-end" >
                                                    <option key={1} value='county'>{this.props.geoid}</option>
                                                    {arrayCOsubs.map((ac,ac_i) => {
                                                        return (
                                                            <option key={ac_i+2} value={ac}>{ac}</option>
                                                        )
                                                        })}
                                                </select>
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
        cousubs: get(state.graph, 'geo',{})
    }
};

const mapDispatchToProps =  {
    //sendSystemMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsTable))

/*
<form className="form-inline">


                    </form>
 */