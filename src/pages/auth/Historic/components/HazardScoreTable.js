import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { format as d3format } from "d3-format"

import { fnum } from 'utils/sheldusUtils'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBoxHistoric'
import geo from "../../../../store/modules/geo";

class HazardScoreTable extends Component {

    fetchFalcorDeps() {
        const { geoid, geoLevel, dataType, hazard } = this.props;
        return this.props.falcor.get(
            ['geo', geoid, geoLevel]
        ).then(data => {
            const geoids = data.json.geo[geoid][geoLevel];
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
                ['riskIndex','meta', hazard , ['id', 'name']],
                ['geo', geoids, ['name']],
                [dataType, geoids, hazard, "allTime", cols]
            )
                .then(d => {
                    console.log('read this ', d);
                    return d
                })
        })
    }

    modifyResponse (geoid, dataType, allhaz) {
        const cols = ['num_events',
            'total_damage',
            'annualized_damage',
            'annualized_num_events',
            'num_severe_events',
            'annualized_num_severe_events',
            'daily_event_prob',
            'daily_severe_event_prob'
        ]
        if (Object.keys(allhaz).length > 0){
            let flipData = {};
                    Object.keys(allhaz[geoid])
                        .filter( f => f !== '$__path' && f !== '0')
                        .forEach( geoLevelHazes => {
                            if (!flipData[geoLevelHazes]){
                                flipData[geoLevelHazes] = {};
                                cols.forEach(col => {
                                    //console.log('geo haz 1', allhaz[geoid][geoLevelHazes].allTime[col], allhaz[geoid][geoLevelHazes], col, geoLevelHazes)
                                    flipData[geoLevelHazes][col] = allhaz[geoid][geoLevelHazes].allTime[col];
                                })
                            }else{
                                cols.forEach(col => {
                                    //console.log('geo haz 2', allhaz[geoid][geoLevelHazes].allTime[col])
                                    flipData[geoLevelHazes][col] += allhaz[geoid][geoLevelHazes].allTime[col];
                                })
                            }
                        });
            return flipData;
        }else{
            return null;
        }
    }

    renderEventsTable() {
        const { geoid, geoLevel, dataType, hazard } = this.props;
        let { pageSize } = this.props;
        let tableData = [],
            keys = [
                "hazard",
                "damage",
                "annualized damage",
                "events",
                "annualized events",
                "severe events",
                "annualized severe events"
            ];

        try {
            let updatedResponse = this.modifyResponse(geoid, dataType, this.props[dataType]);
            tableData = hazard
                .map((h,i) => {
                    const data = updatedResponse[h];
                    return {
                        "hazard": h,
                        "damage": fnum(data.total_damage),
                        "annualized damage": fnum(data.annualized_damage),
                        "events": data.num_events,
                        "annualized events": data.annualized_num_events,
                        "severe events": data.num_severe_events,
                        "annualized severe events": data.annualized_num_severe_events,
                        "sort": data.annualized_damage
                    }
                })
                .sort((a, b) => b.sort - a.sort)
        }
        catch (e) {
// console.log(e);
            return <ElementBox>Loading...</ElementBox>
        }

        return (
            <TableBox
                data={ tableData }
                pageSize={ pageSize }
                columns={ keys }
            />
        )

    }

    renderProbTable() {
        const { geoid, geoLevel, dataType, hazard, pageSize } = this.props;

        let tableData = [],
            keys = [
                "county",
                "daily event chance",
                "daily severe event chance"
            ];

        try {
            const format = d3format(".2f");
            tableData = this.props.geoGraph[geoid][geoLevel].value
                .map((geoid,i) => {
                    const data = this.props[dataType][geoid][hazard].allTime;
                    return {
                        "county": this.props.geoGraph[geoid].name,
                        "daily event chance": format(data.daily_event_prob * 100) + "%",
                        "daily severe event chance": format(data.daily_severe_event_prob * 100) + "%",
                        "sort": data.sort_damage
                    }
                })
                .sort((a, b) => b.sort - a.sort);

        }
        catch (e) {
// console.log(e);
            return <ElementBox>Loading...</ElementBox>
        }

        return (
            <TableBox
                data={ tableData }
                columns={ keys }
            />
        )
    }

    render () {
        const { tableType } = this.props;
        return tableType == "events" ? this.renderEventsTable()
            : this.renderProbTable()
    }
}

HazardScoreTable.defaultProps = {
    //geoid: '36001',
    geoLevel: 'cousubs',
    dataType: 'severeWeather',
    hazard: 'riverine',
    sumTime: 10,
    pageSize: 12,
    tableType: "events" // or "prob"
}

const mapDispatchToProps = { };

const mapStateToProps = state => {
    return {
        riskIndexGraph: state.graph.riskIndex || {},
        sheldus: state.graph.sheldus || {},
        severeWeather: state.graph.severeWeather || {},
        geoGraph: state.graph.geo || {},
        router: state.router,

    };
};


export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardScoreTable))