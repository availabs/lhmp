import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { format as d3format } from "d3-format"

import { fnum } from 'utils/sheldusUtils'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBoxHistoric'
import {falcorChunkerNice} from "store/falcorGraph"
import geo from "store/modules/geo";
import get from 'lodash.get'
import styled from "styled-components";

const TABLE = styled.div`
    table {
        font-size: 1.5em;
        overflow: auto;
    }
`;
class HazardScoreTable extends Component {

    fetchFalcorDeps() {
        const { geoid, geoLevel, dataType, hazard, hazards } = this.props;
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
            let haz = hazard ? hazard :
                hazards && hazards.length > 0 ?
                    hazards : null;
            if (haz){
                return this.props.falcor.get(
                    ['riskIndex','meta', haz , ['id', 'name']]
                )
                    .then(d => falcorChunkerNice(['geo', geoids, ['name']]))
                    .then(d => falcorChunkerNice([dataType, geoids, haz, "allTime", cols]))
            }else return Promise.resolve()

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
            keys = [],
            rows = {
                "total_damage":"Damage",
                "annualized_damage":"Annualized Damage",
                "num_events":"Events",
                "annualized_num_events":"Annualized Events",
                "num_severe_events":"Severe Events",
                "annualized_num_severe_events":"Annualized Severe Events"};

        try {

            Object.keys(this.props[dataType][geoid])
                .filter(hazard =>
                    ((this.props.hazard && this.props.hazard === hazard) ||
                        (!this.props.hazard && this.props.hazards && this.props.hazards.length > 0 && this.props.hazards.includes(hazard)))
                    && get(this.props[dataType], `${geoid}.${hazard}.allTime.total_damage`, 0) !== 0)
                .forEach(hazard => {
                    keys.push(hazard); //columns
            });
            tableData = Object.keys(rows)
                .map((k,i) => {
                    let tmpObj = {};
                    //tmpObj[hazard] = {};
                    tmpObj['keys'] = rows[k];
                    keys.forEach(hazard => {
                        tmpObj[hazard] = ["total_damage", "annualized_damage"].includes(k) ?
                            fnum(this.props[dataType][geoid][hazard].allTime[k]) :
                            this.props[dataType][geoid][hazard].allTime[k];
                    })
                    return tmpObj
                })
        }
        catch (e) {
            return <ElementBox>Loading...</ElementBox>
        }
        return (
            <TABLE>
                <TableBox
                    data={ tableData }
                    pageSize={ pageSize }
                    columns={ ['keys',...keys] }
                />
            </TABLE>
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
    hazard: null,
    hazards: [],
    sumTime: 10,
    pageSize: 6,
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