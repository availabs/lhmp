import React, { Component } from 'react';
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import {Link as Link2} from "react-router-dom";


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

import {
    sidebarScheme,
    sidebarStyle,
    sidebarColor,
    sidebarLayout
} 
from 'pages/Public/theme/components'

const FORMAT = format("$,.0f");
let GraphIcon = styled.i`
    margin-right: 0 auto;
    color: ${props => props.color || '#5c6587'};
    background-color: #fff;
    border-radius: 25px;
    font-size: 25px;
    padding-left: 10px;
    padding-right: 10px;
    transition: all 80ms linear;
    flex: 0 0 25px;
`;

const DIV = styled.div`
    ${props => props.theme.sidePanelScrollBar}
`
class SideMenu extends React.Component {
    
    componentDidUpdate(prevProps) {
        if (prevProps.geoid !== this.props.geoid){
            this.fetchFalcorDeps(this.props)
        }
    }

    fetchFalcorDeps({ dataType, geoid }=this.props) {
        const cols = [
            'num_events',
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

    render(){
        let counter = 1;
        const rows = this.processData().sort((a,b) => {
            if(a.label < b.label) { return -1; }
            if(a.label > b.label) { return 1; }
            return 0;
        });
        const allHazards = {
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
        console.log('render', rows)
        return(
         <DIV style={{height: '100%', paddingTop: 20, overflow: 'auto'}}
            className={`menu-w 
                color-scheme-${sidebarScheme} 
                color-style-${sidebarStyle} 
                menu-position-side 
                menu-side-left 
                menu-layout-${sidebarLayout} 
                sub-menu-style-inside
            `}>

            <ul className="main-menu" style={{paddingRight: 0}}>
                <li onClick={this.props.changeHazard.bind(this,{target:{value:''}})} style={{cursor:'pointer', paddingTop: '30px'}}>
                               
                        <div style={{display:'flex'}}>
                            
                            <GraphIcon 
                                color='red'
                                className={`fi fa-wind`}
                            /> 

                            <span style={{fontSize: '1em', letterSpacing: '2px', paddingTop:10}}>All Hazards</span>
                        </div>
                </li>
                {
                    rows

                        .map((hazard,i) => {
                        return (

                            <li 
                                key={hazard.title}
                                onClick={this.props.changeHazard.bind(this,{target:{value:hazard.hazard}})}
                                style={{ backgroundColor: this.props.hazard === hazard.hazard ? get(hazardMeta[hazard.hazard], `color`, 'red') : '#fff'}}
                            >
                               
                                    <div style={{display:'flex', cursor:'pointer'}}>
                                        
                                        <GraphIcon 
                                            color={get(hazardMeta[hazard.hazard], `color`, 'red')}
                                            className={`fi fa-${get(hazardMeta[hazard.hazard], `icon`, 'wind')}`}
                                        /> 

                                        <span  style={{fontSize: '1em', letterSpacing: '2px', paddingTop:10}}>{hazard.label}</span>
                                    </div>
                            </li>
                            
                
                        )
                    })
                } 
            </ul>

        </DIV>
        )

    }

}

const mapStateToProps = state => ({
    riskIndex: state.graph.riskIndex,
    router: state.router,
    severeWeather: state.graph.severeWeather
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(SideMenu))

