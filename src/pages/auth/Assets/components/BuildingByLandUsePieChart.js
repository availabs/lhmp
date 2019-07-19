import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import { ResponsiveSunburst } from '@nivo/sunburst'

const ATTRIBUTES =[
    "prop_class",
    "replacement_value"
];

class BuildingByLandUsePieChart extends React.Component{
    constructor(props){
        super(props)

    }

    fetchFalcorDeps(){
        if(this.props.geoid !== undefined){
            let geoid = this.props.geoid.map((geoid) => geoid)
            return this.props.falcor.get(['building','byGeoid',this.props.geoid,'length'])
                .then(length => this.props.falcor.get(['building','byGeoid',this.props.geoid,'byIndex',{from:0,to:100},'id']))
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
                    this.props.falcor.get(['building', 'byId', ids,["prop_class","replacement_value"]])
                        .then(response => {
                            console.log('response',response)
                            return response
                        })
                })

        }

    }

    render(){
        return (
            <div>Land use Pie Chart</div>
        )
    }




}

const mapStateToProps = (state,ownProps) => {
    //console.log('state',state.graph)
    return {
        isAuthenticated: !!state.user.authed,
        activePlan: state.user.activePlan
    }
};

const mapDispatchToProps =  {
    //sendSystemMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(BuildingByLandUsePieChart))