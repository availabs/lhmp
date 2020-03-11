import React from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'
import {falcorChunkerNice} from "store/falcorGraph"
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import styled from 'styled-components'

import { format } from "d3-format"

import hazardMeta from './HazardMeta'

import {
    getHazardName
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
                    if (value) {
                        data.push({
                            label: this.getHazardName(hazard),
                            hazard: hazard,
                            value: {main:FORMAT(value),
                            sub:{'Daily Probability': (dailyProb*100).toFixed(2) + '%', 'Annual Avg Number of Events': annualNumEvents}},
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
                title="Annualized Damages"
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


const BoxRow = ({ value, label, hazard, onClick, i }) => (
    <div className="col-sm"  key={ i } style={{textAlign:'center'}}>
        <div className="el-tablo highlight">
            <div className="label" style={{'font-size': '1.2em', fontWeight: 400}}>{ label }</div>
            
            <div className="label" style={{'font-size': '1em'}}>
                <GraphIcon 
                    color={hazardMeta[hazard].color}
                    className={`fi fa-${hazardMeta[hazard].icon}`}
                />
            </div>
            <div className="value" style={{'font-size': 'x-large', color: hazardMeta[hazard].color}}>{ value.main }</div>
            <div style={{'font-size': 'small'}}>
                {Object.keys(value.sub).map(s => <label className="label">{s} : {value.sub[s] }</label>)}
            </div>
            
        </div>
    </div>
)

const SideInfoProjectBox =  ({ title, rows, onClick, content=null }) => (
    <ProjectBox title={ title } style={ {  width:'100%' } }>
        <div className="row align-items-center">
            { rows.length ?
                rows.map((r,i) => (<BoxRow {...r} onClick={onClick} i={i} />))
                : content
            }            
        </div>
    </ProjectBox>
)