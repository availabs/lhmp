import React from 'react';
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import MultiSelectFilter from 'components/filters/multi-select-filter.js'
import {setActiveHazard, setActiveYear} from 'store/modules/hazardEvents'
import BuildingsByAgencyConfig from 'pages/auth/Assets/components/BuildingsByAgencyConfig'
import styled from 'styled-components'
import SearchableDropDown from "../../../../components/filters/searchableDropDown";
import FloodPlainTable from "../components/floodPlainTable";
var _ = require("lodash")

const DIV = styled.div`
    *{
        background-color: #efefef;
    }
`
class NfipControl extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {}

    handleChange(e) {};

    render() {
        return 'Actions Layer'
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