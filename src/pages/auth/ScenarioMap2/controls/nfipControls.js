import React from 'react';
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import MultiSelectFilter from 'components/filters/multi-select-filter.js'
import {setActiveHazard, setActiveYear} from 'store/modules/hazardEvents'
import criticalInfrastructureByCode from 'pages/auth/ScenarioMap2/components/criticalInfrastructureByCode'
import functions from "../../Plan/functions";

var _ = require("lodash")

class NfipControl extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }


    handleChange(e) {
    };

    render() {
        return (
            <React.Fragment>
                <div className='row' style={{marginRight: 0}}>
                </div>
            </React.Fragment>

        )
    }
}

const
    mapStateToProps = state => (
        {
            activePlan: state.user.activePlan,
            activeGeoid: state.user.activeGeoid,
            isAuthenticated: !!state.user.authed,
            attempts: state.user.attempts,
            geoData: get(state.graph, ['geo'], {}),
            geoRelations: state.geo.geoRelations
        });

const
    mapDispatchToProps = {
        sendSystemMessage, setActiveYear, setActiveHazard
    };

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NfipControl))