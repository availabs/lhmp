import React from 'react';
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import MultiSelectFilter from "../../../../components/filters/multi-select-filter";
import COLOR_RANGES from "constants/color-ranges"
import {setActiveYear, setActiveHazard} from 'store/modules/hazardEvents'
import criticalInfrastructureByCode from 'pages/auth/ScenarioMap2/components/criticalInfrastructureByCode'

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
                <div style={{paddingBottom: '5px'}}>
                    <div className="icon-w">
                        <div className="os-icon os-icon-home"> Shelter </div>
                    </div>
                </div>
                <div>
                    <div className="icon-w">
                        <div className="os-icon os-icon-alert-circle"> Critical Infrastructure</div>
                    </div>
                </div>
                <table className='table table-sm table-hover'>
                    <thead>
                    <th>Code</th>
                    <th>Name</th>
                    <th>#</th>
                    </thead>
                    <tbody>
                    {
                        Object.keys(get(this.props.layer, `layer.criticalInfrastructureLayer.criticalCodes`, {}))
                            .map(code =>
                                <tr>
                                    <td>{ code.slice(0,3) }</td>
                                    <td>{ criticalInfrastructureByCode[`${code.slice(0,3)}00`] }</td>
                                    <td>
                                        {
                                            Object.keys(get(this.props.layer, `layer.criticalInfrastructureLayer.criticalCodes`, {}))
                                                .filter(codeToSum => codeToSum.slice(0,3) === code.slice(0,3))
                                                .reduce((a,codeToSum) => a + get(this.props.layer, `layer.criticalInfrastructureLayer.criticalCodes.${codeToSum}`, 0), 0)
                                        }
                                    </td>
                                </tr>)
                    }
                    </tbody>
                </table>
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