import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import {authGeoid} from "store/modules/user";
import {getColorScale} from 'utils/sheldusUtils'
import Element from "../../../components/light-admin/containers/Element";
import ElementBox from "../../../components/light-admin/containers/ElementBox";
import config from "../Plan/config/guidance-config";
import {Link} from "react-router-dom";
import get from "lodash.get";

const TDStyle = {wordBreak: 'break-word', width: '50%'};
const ATTRIBUTES = ['date', 'county', 'municipality', 'geoid', 'cousub_geoid', 'year', 'hazardid', 'property_damage', 'magnitude', 'episode_narrative', 'event_narrative', 'event_id', 'episode_id', 'injuries', 'fatalities', 'crop_damage']

class StormEvents extends React.Component {

    constructor(props) {
        super(props);
        authGeoid(this.props.user);
        this.state = {
            geoid: this.props.geoid,
            geoLevel: this.setGeoLevel(this.props.geoid.length),
            dataType: 'severeWeather',
            colorScale: getColorScale([1, 2]),
            hazards: [],
            hazard: undefined
        }
    }

    setGeoLevel(geoid_len) {
        return geoid_len === 2 ? 'state'
            : geoid_len === 5 ? 'counties'
                : geoid_len === 7 ? 'villages'
                    : geoid_len === 10 ? 'cousubs'
                        : geoid_len === 11 ? 'tracts'
                            : geoid_len === 12 ? 'blockgroup' : ''
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(
            ['severeWeather', 'events', 'byId', this.props.match.params.id, ATTRIBUTES]
        )
    }

    render() {
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">
                        <label>
                            Storm Event : {this.props.match.params.id}
                            {config['stormevents'] ?
                                <Link
                                    className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded"
                                    to={
                                        get(this.props.config, `[0].guidance`, `/guidance/${config['stormevents'].requirement}/view`)
                                    } target={'_blank'}
                                >?</Link>
                                : null}
                        </label>
                    </h4>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='element-wrapper'>
                                <div className='element-box'>
                                    <div className='table-responsive'>
                                        <table className="table table lightBorder">
                                            <thead>
                                            <tr>
                                                <th>ATTRIBUTE</th>
                                                <th>VALUE</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                Object.keys(get(this.props.severeWeather, ['events', 'byId', this.props.match.params.id], {}))
                                                    .map(key =>
                                                        <tr>
                                                            <td style={TDStyle}>{key}</td>
                                                            <td style={TDStyle}>{get(this.props.severeWeather, ['events', 'byId', this.props.match.params.id, key], 'None')}</td>
                                                        </tr>)
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Element>
            </div>
        )
    }


}

const mapStateToProps = (state, ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        planId: state.user.activePlan,
        geoid: ownProps.computedMatch.params.geoid ?
            ownProps.computedMatch.params.geoid
            : state.user.activeCousubid && state.user.activeCousubid !== 'undefined' ?
                state.user.activeCousubid :
                state.user.activeGeoid ?
                    state.user.activeGeoid :
                    localStorage.getItem('geoId'),
        riskIndex: state.graph.riskIndex,
        severeWeather: state.graph.severeWeather
    };
};

const mapDispatchToProps = {authGeoid};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/stormevents/:id',
    exact: true,
    name: 'StormEvents',
    auth: true,
    mainNav: false,
    breadcrumbs: [
        {name: 'StormEvents', path: '/stormevents/'},
        {param: 'id', path: '/stormevents/'}
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(StormEvents))
}];

