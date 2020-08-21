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

class HazardEventsControl extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedGeos: [],
            data: []
        }
    }

    componentDidMount() {
        return Object.keys(get(this.props, `geoRelations`, {}))
            .filter(geoid => geoid.toString() === this.props.activeGeoid.toString() && this.props.geoRelations[geoid].length)
            .reduce((a, geo) => a.then(() => this.props.falcor.get(['geo', this.props.geoRelations[geo], ['name']])), Promise.resolve())
            .then(() => {
                Object.keys(get(this.props, `geoData`, {}))
                    .filter(geoid =>
                        Object.keys(this.props.geoRelations)
                        .filter(county => county.toString() === this.props.activeGeoid.toString())
                        .reduce((a, county) => [...a, ...this.props.geoRelations[county]], [])
                        .includes(geoid.toString())
                    )
                    .forEach(geoid => this.state.data.push({value: geoid, name: functions.formatName(this.props.geoData[geoid].name, geoid)}))
            })
    }

    handleChange(e) {
    };

    render() {
        let data = this.state.data;

        return (
            <React.Fragment>
                <div className='row' style={{marginRight: 0}}>
                    <div className='col-sm-6'>
                        <div className="icon-w">
                            <div className="os-icon os-icon-home"> Shelter</div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="icon-w">
                            <div className="os-icon os-icon-alert-circle"> Critical Infrastructure</div>
                        </div>
                    </div>
                </div>
                <MultiSelectFilter
                    filter={{
                        domain: this.props.addAll === 'true' ?
                            data ? ['Select All', 'Select None', ...data] : ['Select All', 'Select None'] :
                            data || [],
                        value: this.state.selectedGeos
                    }}
                    setFilter={(e) => {
                        this.props.layer.layer.criticalInfrastructureLayer.setGeoFilter(e)
                        this.setState({selectedGeos: [...e]})
                    }}
                    placeHolder={this.props.placeholder}
                />
                <table className='table table-sm table-hover'>
                    <thead key={`criticalInfrastructureTableHeader`}>
                    <tr>
                        <th>Critical Infrastructure Type</th>
                        <th>#</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        Object.keys(get(this.props.layer, `layer.criticalInfrastructureLayer.criticalCodes`, {}))
                            .map(code =>
                                <tr key={`criticalInfrastructureTable${code}`}>
                                    <td>{`${code.slice(0, 3)} - ${criticalInfrastructureByCode[`${code.slice(0, 3)}00`]}`}</td>
                                    <td>
                                        {
                                            Object.keys(get(this.props.layer, `layer.criticalInfrastructureLayer.criticalCodes`, {}))
                                                .filter(codeToSum => codeToSum.slice(0, 3) === code.slice(0, 3))
                                                .reduce((a, codeToSum) => a + get(this.props.layer, `layer.criticalInfrastructureLayer.criticalCodes.${codeToSum}`, 0), 0)
                                        }
                                    </td>
                                </tr>)
                    }
                    </tbody>
                </table>
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
            zonesList: get(state.graph, ['forms', 'byId'], {}),
            assetsData: get(state.graph, ['building', 'byGeoid'], {}),
            geoData: get(state.graph, ['geo'], {}),
            geoRelations: state.geo.geoRelations
        });

const
    mapDispatchToProps = {
        sendSystemMessage, setActiveYear, setActiveHazard
    };

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardEventsControl))