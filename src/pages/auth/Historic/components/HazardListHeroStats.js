import React from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'

import { Link } from "react-router-dom"

import { fnum } from "utils/sheldusUtils"

import { format as d3format } from "d3-format"

const format2f = d3format("$,.2f"),
    percent = d3format("0.2f"),
    formatPercent = dec => percent(+dec * 100);

class HazardListHeroStats extends React.Component {

    fetchFalcorDeps({ hazard, dataType, geoid }=this.props) {
        return this.props.falcor.get(
            ['riskIndex', 'meta', hazard, 'name'],
            [dataType, geoid, hazard, 'allTime',
                ['annualized_damage',
                    'annualized_num_events',
                    'annualized_num_severe_events',
                    'daily_event_prob',
                    'daily_severe_event_prob']
            ]
        )
    }

    render() {
        const { hazard, dataType, geoid } = this.props;
        try {
            const name = this.props.riskIndex.meta[hazard].name,
                data = this.props[dataType][geoid][hazard].allTime;
            return (
                <div className="row">
                    <div className="col-6">
                        <h4><Link style={{color: '#047bf8'}} to={ `/hazards/${ hazard }` }
                                  className="hazard-link">
                            { name } <span style={{fontSize: 10}}>View Hazard Profile</span>
                        </Link></h4>

                    </div>
                    <div className="col-6">
                        <h4>Annualized Damage: { fnum(data.annualized_damage) }</h4>
                    </div>
                    <div className="col-3">
                        <h6>Daily Prob.: { formatPercent(data.daily_event_prob) }%</h6>
                    </div>
                    <div className="col-3">
                        <h6>Daily Severe Prob.: { formatPercent(data.daily_severe_event_prob) }%</h6>
                    </div>
                    <div className="col-3">
                        <h6>Ann. Events: { data.annualized_num_events }</h6>
                    </div>
                    <div className="col-3">
                        <h6>Ann. Severe Events: { data.annualized_num_severe_events }</h6>
                    </div>
                </div>
            )
        }
        catch (e) {
            return <h4 style={ { minHeight: "63px", margin: 0 } }>Loading...</h4>
        }
    }
}

HazardListHeroStats.defaultProps = {
    hazard: "riverine",
    geoid: "36",
    dataType: "severeWeather"
}

const mapStateToProps = state => ({
    riskIndex: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeWeather: state.graph.severeWeather || {},
    router: state.router
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardListHeroStats))