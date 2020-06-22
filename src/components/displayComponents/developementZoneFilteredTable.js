import React, {Component} from 'react';
import AvlFormsListTable from 'components/AvlForms/displayComponents/listTable.js';
import config from 'pages/auth/Zones/config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';



class developementZonesFilteredTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.activeGeoid,
        };
    }

    render(){
        return(
            <div className='container'>
                <Element>
                    <AvlFormsListTable
                        json = {[Object.assign({}, config[0], {list_attributes: ['name', 'zone_type', 'comment']})]}
                        filterBy = {this.props.filterBy}
                        createButtons = {false}
                        editButton = {true}
                        viewButton = {true}
                        deleteButton = {false}
                    />
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        activeGeoid: state.user.activeGeoid,
        activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid,
        graph: state.graph,
        activePlan: state.user.activePlan,
        formsListData: get(state.graph, ['forms', 'byId'], {}),
        geoData: get(state.graph, ['geo'], {}),
        user: get(state, 'user', null),
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
    }
};
const mapDispatchToProps = ({sendSystemMessage});
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(developementZonesFilteredTable))