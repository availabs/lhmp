import React from 'react';
import {connect} from "react-redux";
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import Element from 'components/light-admin/containers/Element'
import AvlFormsNewData from 'components/AvlForms/editComponents/newData.js'
import get from "lodash.get";
import ViewConfig from './view_config.js'

class ActionsWorksheetFormsNew extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let config = ViewConfig.config;
        console.log('data in saveRoute', this.props.geom)
        return(
            <AvlFormsNewData
                json = {config}
                id = {[]}
                data = {{geom: JSON.stringify(this.props.geom)}}
            />
        )
    }
}

const mapDispatchToProps = {
    sendSystemMessage
};

const mapStateToProps = state => {
    return {
        activePlan: state.user.activePlan,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        countyData: get(state.graph,'geo',{})

    };
};

export default connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ActionsWorksheetFormsNew))