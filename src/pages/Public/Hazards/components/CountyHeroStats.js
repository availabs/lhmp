import React from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'
import {falcorChunkerNice} from "store/falcorGraph"

import { format } from "d3-format"

import {
    getHazardName
} from 'utils/sheldusUtils'

import SideInfoProjectBox from "./SideInfoProjectBox"

const FORMAT = format("$,.0f");

class CountyHeroStats extends React.Component {
    fetchFalcorDeps({ dataType, geoid }=this.props) {
        const cols = ['num_events',
            'total_damage',
            'annualized_damage',
            'annualized_num_events',
            'num_severe_events',
            'annualized_num_severe_events',
            'daily_event_prob',
            'daily_severe_event_prob'
        ]
        return this.props.falcor.get(
            ['riskIndex', 'hazards']
        )
            .then(response => response.json.riskIndex.hazards)
            .then(hazards =>
                {
                    hazards = this.props.hazard ?
                        this.props.hazard :
                        this.props.hazards && this.props.hazards.length > 0 ?
                            this.props.hazards : hazards;

                    return this.props.falcor.get(
                        ['riskIndex', 'meta', hazards, 'name']).
                    then(d => falcorChunkerNice([dataType, geoid, hazards, 'allTime', cols]))
                }
            )
    }

    getHazardName(hazard) {
        try {
            return this.props.riskIndex.meta[hazard].name;
        }
        catch (e) {
            return getHazardName(hazard)
        }
    }

    processData() {
        const { dataType, geoid } = this.props;
        let data = [];
        try {
            for (const hazard in this.props[dataType][geoid]) {
                if (
                    (this.props.hazard && this.props.hazard === hazard) ||
                    (!this.props.hazard && this.props.hazards && this.props.hazards.length > 0 && this.props.hazards.includes(hazard))
                ){
                    const value = +this.props[dataType][geoid][hazard].allTime.annualized_damage;
                    const dailyProb = +this.props[dataType][geoid][hazard].allTime.daily_event_prob;
                    const annualNumEvents = +this.props[dataType][geoid][hazard].allTime.annualized_num_events;
                    if (value) {
                        data.push({
                            label: this.getHazardName(hazard),
                            value: {main:FORMAT(value),
                                sub:{'Daily Probability': (dailyProb*100).toFixed(2) + '%', 'Annual Avg Number of Events': annualNumEvents}},
                            sort: value
                        })
                    }
                }
            }
        }
        catch (e) {
            data = [];
        }
        finally {
            return data.sort((a, b) => b.sort - a.sort);
        }
    }

    render() {
        const rows = this.processData();
        return (
            <SideInfoProjectBox rows={ rows }
                                title="Annualized Damages"/>
        )
    }
}

CountyHeroStats.defaultProps = {
    dataType: "severeWeather",
    hazards: []
}

const mapStateToProps = state => ({
    riskIndex: state.graph.riskIndex,
    router: state.router,
    severeWeather: state.graph.severeWeather
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CountyHeroStats))