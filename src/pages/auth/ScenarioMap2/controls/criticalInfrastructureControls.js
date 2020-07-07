import React from 'react';
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import MultiSelectFilter from "../../../../components/filters/multi-select-filter";
import COLOR_RANGES from "constants/color-ranges"
import {setActiveYear, setActiveHazard} from 'store/modules/hazardEvents'

var _ = require("lodash")

class HazardEventsControl extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    handleChange(e) {
    };

    render() {
        return (
            <div>
            </div>

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
            zonesList: get(state.graph, ['forms', 'byId'], {}),
            assetsData: get(state.graph, ['building', 'byGeoid'], {})
        });

    const
    mapDispatchToProps = {
        sendSystemMessage, setActiveYear, setActiveHazard
    };

    export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardEventsControl))