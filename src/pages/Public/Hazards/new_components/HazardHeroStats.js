import React from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import styled from 'styled-components'
import get from 'lodash.get'
import _ from 'lodash'

import { format } from "d3-format"

import hazardMeta from './HazardMeta'

import {
    getHazardName, fnum
} from 'utils/sheldusUtils'


const FORMAT = format("$,.0f");
let GraphIcon = styled.i`
    margin-right: 0 auto;
    color: ${props => props.color || '#5c6587'};
    background-color: #fff;
    border-radius: 25px;
    font-size: 25px;
    padding: 10px;
    transition: all 80ms linear;
    flex: 0 0 25px;
`;

class CountyHeroStats extends React.Component {
    componentDidUpdate(prevProps) {
        if (prevProps.geoid !== this.props.geoid){
            this.fetchFalcorDeps(this.props)
        }
    }

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
            .then(hazards => this.props.falcor.get(['riskIndex', 'meta', hazards, 'name'], [dataType, geoid, hazards, 'allTime', cols]))
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
                    if (true) {
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
            return data.sort((a, b) => a.hazard !== '' ? b.sort - a.sort : 1);
        }
    }

    render() {
        const rows = this.processData();
        return (
            <SideInfoProjectBox 
                rows={ rows }
                changeHazard={this.props.changeHazard}
                activeHazard={this.props.hazard}
                firstLoad={this.props.firstLoad}
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
    <div className="col-sm"  key={ i } style={{ paddingBottom: 0, paddingTop: 10,  textAlign:'center', cursor: 'pointer'}}
         value={hazard} onClick={changeHazard.bind(this,{target:{value:hazard}})}>
        <div style={{backgroundColor: '#fff', borderBottom: '1px solid #ccc', borderRadius: '5px', paddingBottom:'10px'}}>
            <div style={{'font-size': '2em', padding: '2px', paddingBottom: '4px', borderRadius: '25px', fontWeight: 600, minWidth: '270px', textAlign:'left', color: '#efefef', backgroundColor: get(hazardMeta[hazard], `color`, 'red')}}>
                <GraphIcon 
                    color={get(hazardMeta[hazard], `color`, 'red')}
                    className={`fi fa-${get(hazardMeta[hazard], `icon`, 'wind')}`}
                /> 
                <span style={{letterSpacing: '4px', paddingLeft: '20px'}}>{ label }</span>
            </div>
            <div style={{display: 'flex',  flexWrap: 'wrap'}}>
                
                <div style={{minWidth: '100%', flex: 1}}>
                    <div style={{fontSize:'2.5em', lineHeight: '1em', paddingTop:10, fontWeight:400}}>
                        { fnum(get(value, `sub['Total Loss']`, 0)) }

                    </div>
                    <div style={{fontWeight:300, fontSize:'1.0em'}}>Total Loss</div>
                    
                </div>
                {
                    get(value, `sub['Total Loss']`, 0) > 0 ?
                    <React.Fragment>
                        <div style={{ minWidth: '30%', flex:1}}>
                            <div style={{fontSize:'1.5em',lineHeight: '1em', paddingTop:10, fontWeight:400}}>
                                { fnum(typeof value.main === "string" ? value.main.replace(/[$]/g, '').replace(/,/g,'') : value.main) }
                            </div>
                            <div style={{ fontWeight:300, fontSize:'0.9em'}}>Avg Loss/Year</div>
                            
                        </div>
                        <div style={{minWidth: '30%', flex:1}}>
                            <div style={{fontSize:'1.5em',lineHeight: '1em', paddingTop:10, fontWeight:400}}>
                                { get(value, `sub['Daily Probability']`, 0) }

                            </div>
                            <div style={{ fontWeight:300, fontSize:'0.9em'}}>Daily Probability</div>
                            
                        </div>
                         <div style={{minWidth: '30%', flex:1}}>
                            <div style={{fontSize:'1.5em',lineHeight: '1em', paddingTop:10, fontWeight:400}}>
                                { get(value, `sub['Annual Avg Number of Events']`, 0) }

                            </div>
                            <div style={{ fontWeight:300, fontSize:'0.9em'}}>Avg Events/Year</div>
                            
                        </div> 
                    </React.Fragment>: ''
                }
                
            </div>
            
            
        </div>
    </div>
)

const SideInfoProjectBox =  ({ title, rows, changeHazard, content=null, activeHazard, firstLoad }) => (
    <ProjectBox title={ title } style={ {  width:'100%' } }>
        <div className="row align-items-center">
            { rows.length && activeHazard === '' ?
                <BoxRow value={{
                            main: rows.reduce((a,c) => {
                                //console.log('hi', c, c.value.main, a, get(c, `value.main`,'$0').substr(1).replace(/,/g, ''))
                                return a + +get(c, `value.main`,'$0').substr(1).replace(/,/g, '')
                            }, 0),
                            sub: {
                                'Total Loss': rows.reduce((a,c) => a+get(c, `value.sub['Total Loss']`,0),0),
                                'Daily Probability': rows.reduce((a,c) => a+ +get(c, `value.sub['Daily Probability']`,0).replace(/%/g, ''),0).toFixed(2)+'%',
                                'Annual Avg Number of Events': rows.reduce((a,c) => a+get(c, `value.sub['Annual Avg Number of Events']`,0),0)
                            }
                            
                        }
                        }
                        label={'All Hazards'}
                        hazard={''}
                        changeHazard={changeHazard} i={'allHaz'} activeHazard={activeHazard}/>
                : content
            }
            {firstLoad ? changeHazard({target:{value:''}}) : null}
        </div>
        <div className="row align-items-center">
            { rows.length ?
                rows
                    .filter(r => activeHazard === r.hazard || activeHazard === '' )
                    .filter(r => get(r, `value.sub['Total Loss']`,0) > 0 || activeHazard === r.hazard)
                    .map((r,i) => (
                    <BoxRow 
                        {...r} 
                        changeHazard={changeHazard} 
                        i={i} 
                        activeHazard={activeHazard}
                    />
                ))
                : content
            }
        </div>
        
    </ProjectBox>
)