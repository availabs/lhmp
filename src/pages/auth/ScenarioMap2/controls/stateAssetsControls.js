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
            agencyFilter: {
                domain: BuildingsByAgencyConfig.map(config => ({value: config, name: BuildingsByAgencyConfig[config]})),
                value: []
            },
            floodZones: [
                {value: null, label: '--Select Flood plain--'},
                {value: 'none', label: 'None'},
                {value: '100 Year', label: '100 Year'},
                {value: '500 Year', label: '500 Year'},
            ],
            floodZone: null,
            viewModes: [
                {value: 'Only Agency', label: 'Agency'},
                {value: 'Only Owner type', label: 'Owner type'},
                {value: 'Both', label: 'Both'},
            ],
            viewMode: null,
            selectedAgency: []
        }

        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        this.setState({viewMode: 'Both'})
    }

    handleChange(e) {

    };

    render() {
        return (
            <React.Fragment>
                <h6> View: </h6>
                <SearchableDropDown
                    data={this.state.viewModes}
                    placeholder={'Select View Mode'}
                    id = "viewMode"
                    onChange={e =>{
                        this.props.layer.layer.stateAssetsLayer.setViewModeFilter(e)
                        this.setState({'viewMode': e});
                    }}
                    value={this.state.viewModes.filter(fz => fz.value === this.state.viewMode)[0]}
                />

                <h6>Agency : </h6>
                <MultiSelectFilter
                    filter={{
                        domain: BuildingsByAgencyConfig,
                        value: this.state.selectedAgency
                    }}
                    setFilter={(e) => {
                        this.props.layer.layer.stateAssetsLayer.setAgencyFilter(e.map(e1 => BuildingsByAgencyConfig.filter(bba => bba.value === e1)[0].name))
                        this.setState({selectedAgency: [...e]})
                    }}
                    placeHolder={'Select Agency'}
                />

                <h6>Flood plain :</h6>
                <SearchableDropDown
                    data={this.state.floodZones}
                    placeholder={'Select Flood plain'}
                    id = "floodZone"
                    onChange={e =>{
                        this.props.layer.layer.stateAssetsLayer.setFloodPlainFilter(e)
                        this.setState({'floodZone': e});
                    }}
                    value={this.state.floodZones.filter(fz => fz.value === this.state.floodZone)[0]}
                />

                {this.props.activeGeoid.length === 2 ? '' : <FloodPlainTable
                    scenarioId={localStorage.getItem("scenario_id")}
                    agencyFilter={this.state.selectedAgency.map(e1 => BuildingsByAgencyConfig.filter(bba => bba.value === e1)[0].name)}
                />}
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