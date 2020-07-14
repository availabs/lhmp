import React from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'
import {falcorChunkerNice} from "store/falcorGraph"
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import styled from 'styled-components'
import get from 'lodash.get'

import { format } from "d3-format"

import hazardMeta from './HazardMeta'

import {
    getHazardName, fnum
} from 'utils/sheldusUtils'


const FORMAT = format("$,.0f");
let GraphIcon = styled.i`
    margin-right: 0 auto;
    background-color: ${props => props.color || '#5c6587'};
    color: #fff;
    border-radius: 50%;
    font-size: 65px;
    height: 45px;
    padding: 15px;
    transition: all 80ms linear;
    flex: 0 0 40px;
`;

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
                    const value = +this.props[dataType][geoid][hazard].allTime.annualized_damage;
                    const dailyProb = +this.props[dataType][geoid][hazard].allTime.daily_event_prob;
                    const annualNumEvents = +this.props[dataType][geoid][hazard].allTime.annualized_num_events;
                    const totalDamage = +this.props[dataType][geoid][hazard].allTime.total_damage;
                    if (value) {
                        data.push({
                            label: this.getHazardName(hazard),
                            hazard: hazard,
                            value: {main:FORMAT(value),
                            sub:{
                                'Total Loss': totalDamage,
                                'Daily Probability': (dailyProb*100).toFixed(2) + '%',
                                'Annual Avg Number of Events': annualNumEvents}},
                            sort: value
                        })
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
            <SideInfoProjectBox 
                rows={ rows }
                changeHazard={this.props.changeHazard}
                activeHazard={this.props.hazard}
            />
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


const BoxRow = ({ value, label, hazard, changeHazard, onClick, i , activeHazard}) => (
    <div className="col-sm"  key={ i } style={{textAlign:'center', border: activeHazard === hazard ? '1px solid blue' : ''}}
         value={hazard} onClick={changeHazard.bind(this,{target:{value:hazard}})}>
        <div className="el-tablo highlight">
            <div className="label" style={{'font-size': '1.2em', fontWeight: 400}}>{ label }</div>
            
            <div className="label" style={{'font-size': '1em'}}>
                <GraphIcon 
                    color={get(hazardMeta[hazard], `color`, 'red')}
                    className={`fi fa-${get(hazardMeta[hazard], `icon`, 'wind')}`}
                />
            </div>
            <div className="value" style={{'font-size': 'x-large', color: get(hazardMeta[hazard], `color`, 'red')}}>
                {'Annual Average Loss'} :
                { fnum(typeof value.main === "string" ? value.main.replace(/[$]/g, '').replace(/,/g,'') : value.main) }
            </div>
            <div style={{'font-size': 'small'}}>
                {hazard !== '' ? Object.keys(value.sub).map(s =>
                    <label className="label">
                        {s} : {['Total Loss'].includes(s) ? fnum(value.sub[s]) : value.sub[s] }
                    </label>) : null}
            </div>
            
        </div>
    </div>
)

const SideInfoProjectBox =  ({ title, rows, changeHazard, content=null, activeHazard }) => (
    <ProjectBox title={ title } style={ {  width:'100%' } }>
        <div className="row align-items-center">
            { rows.length ?
                rows.map((r,i) => (<BoxRow {...r} changeHazard={changeHazard} i={i} activeHazard={activeHazard}/>))
                : content
            }
        </div>
        <div className="row align-items-center">
            { rows.length ?
                <BoxRow value={{main: rows.reduce((a,c) =>
                        a+parseInt(typeof c.value.main === "string" ? c.value.main.replace(/[$]/g, '').replace(/,/g,'') : c.value.main || 0), 0)}}
                        label={'All Hazards'}
                        hazard={''}
                        changeHazard={changeHazard} i={'allHaz'} activeHazard={activeHazard}/>
                : content
            }
        </div>
    </ProjectBox>
)