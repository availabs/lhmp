import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "../../../../store/falcorGraph";

class BuildingByLandUseTable extends React.Component{
    constructor(props){
        super(props)
    }

    fetchFalcorDeps(){
        console.log('props',this.props.filters,this.props.geoid)
        return this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',[100],'sum',['count','replacement_value']])
    }

    render(){
        return (
            <div>Table</div>
        )
    }

    static defaultProps = {
        geoid : [36001],
        filters : [100]
    }
}

const mapStateToProps = (state,ownProps) => {
    //console.log('state',state)
    return {
        isAuthenticated: !!state.user.authed,
        activePlan: state.user.activePlan,
        data : get(state.graph,'building.byGeoid')
    }
};

const mapDispatchToProps =  {
    //sendSystemMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(BuildingByLandUseTable))