import React from 'react'
import {connect} from 'react-redux'
import {reduxFalcor} from 'utils/redux-falcor'
import store from "store"
import styled from "styled-components";

import {fnum} from "utils/sheldusUtils"
import COLOR_RANGES from "constants/color-ranges"
import hazardcolors from "../../../../../../constants/hazardColors";


// <i class="os-icon os-icon-phone-21"></i>

const getColor = (name) => COLOR_RANGES[5].reduce((a, c) => c.name === name ? c.colors : a).slice();

const hazardMeta = {
    'wind': {color: hazardcolors['wind'], icon: 'wind'},
    'wildfire': {color: hazardcolors['wildfire'], icon: 'forest-fire'},
    'tsunami': {color: hazardcolors['tsunami'], icon: 'tsunami'},
    'tornado': {color: hazardcolors['tornado'], icon: 'tornado'},
    'riverine': {color: hazardcolors['riverine'], icon: 'flood'},
    'lightning': {color: hazardcolors['lightning'], icon: 'storm'},
    'landslide': {color: hazardcolors['landslide'], icon: 'landslide'},
    'icestorm': {color: hazardcolors['icestorm'], icon: 'snow'},
    'hurricane': {color: hazardcolors['hurricane'], icon: 'flood-1'},
    'heatwave': {color: hazardcolors['heatwave'], icon: 'drought'},
    'hail': {color: hazardcolors['hail'], icon: 'hail'},
    'earthquake': {color: hazardcolors['earthquake'], icon: 'earthquake'},
    'drought': {color: hazardcolors['drought'], icon: 'drought'},
    'avalanche': {color: hazardcolors['avalanche'], icon: 'avalanche'},
    'coldwave': {color: hazardcolors['coldwave'], icon: 'snow'},
    'winterweat': {color: hazardcolors['winterweat'], icon: 'snow'},
    'volcano': {color: hazardcolors['volcano'], icon: 'flood'},
    'coastal': {color: hazardcolors['coastal'], icon: 'flood'},
};


let GraphListItem = styled.li`
	display: flex;
    flex-flow: row nowrap;
    cursor: pointer;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: .59975em;
    color: #5c6587;
    transition: all 80ms linear;
`;

let GraphIcon = styled.i`
	margin-right: .8em;
    background-color: ${props => props.color || '#5c6587'};
    color: #fefefe;
    border-radius: 50%;
    font-size: 35px;
    height: 45px;
    padding: 5px;
    transition: all 80ms linear;
    flex: 0 0 40px;
`;

let BarContainer = styled.div`
	display: flex;
    flex-flow: column nowrap;
    flex: 1 0 auto;
    max-width: calc(100% - (40px + 1.333em));
`;
let GraphLabel = styled.div`
	display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
`;
let NameLabel = styled.span`
	font-size: .6667em;
    font-weight: 900;
    line-height: 1.25;
    letter-spacing: .1em;
    text-transform: uppercase;
    font-weight: 500;
`;

let NumberLabel = styled.span`
	font-feature-settings: "tnum";
    text-align: right;
    font-size: .6667em;
    font-weight: 900;
    line-height: 1.25;
    letter-spacing: .1em;
    text-transform: uppercase;
    font-weight: 500;
`;

let Bar = styled.div`
	position: relative;
    margin-top: .25em;
    width: 100%;
    height: .5em;
    border-radius: .25em;
    background-color: rgba(92,101,135,.6);
`;
let BarValue = styled.div`
	height: .5em;
    border-radius: .25em;
	width: ${props => props.width || 0}%;
    left: ${props => props.left || 0}%;
    background-color: ${props => props.color || 'rgb(39, 216, 136)'};
`;

const ListItem = ({hazard, name, onClick, active, annualized_damage}) =>
    <li className={active ? " active" : ""}
        key={hazard}>
        <a onClick={onClick}>
            <i className="os-icon os-icon-arrow-right2"></i>
            <span>{name} </span>
            <span className="float-right"
                  style={{paddingRight: "10px"}}>
				{fnum(annualized_damage)}
			</span>
        </a>

    </li>;

class HazardList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hazard: props.hazard,
            geoid: props.geoid
        }
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(
            ['riskIndex', 'hazards'],
        )
            .then(response => response.json.riskIndex.hazards)
            .then(hazards => this.props.falcor.get(
                ['severeWeather', this.props.geoid, hazards, 'allTime', 'annualized_damage'],
                ['riskIndex', 'meta', hazards, ['name', 'id']]
            )).then(finalData => {
                return finalData
            })
    }

    selectHazard(hazard) {
        this.setState({hazard});
    }

    renderHazardSelector() {
        try {
            let sortedHazards = this.props.riskIndex.hazards.value.slice()
                .sort((a, b) => {
                    const aVal = this.props.severeWeather[this.props.geoid][a].allTime.annualized_damage,
                        bVal = this.props.severeWeather[this.props.geoid][b].allTime.annualized_damage;
                    return bVal < aVal ? -1 : 1;
                });
            let totalLoss = this.props.riskIndex.hazards.value.slice().reduce((sum, curr) => {
                sum += this.props.severeWeather[this.props.geoid][curr].allTime.annualized_damage;
                return sum
            }, 0);
            totalLoss = this.props.severeWeather[this.props.geoid][sortedHazards[0]].allTime.annualized_damage;
            return sortedHazards
                .filter(d => this.props.severeWeather[this.props.geoid][d].allTime.annualized_damage > 1)
                .map(hazard => {
                    const name = this.props.riskIndex.meta[hazard].name;
                    return (
                        <GraphListItem onClick={this.props.setHazard.bind(this, hazard)}>
                            <GraphIcon color={hazardMeta[hazard].color}
                                       className={`fi fa-${hazardMeta[hazard].icon}`}/>
                            <BarContainer>
                                <GraphLabel>
                                    <NameLabel>
                                        {name}
                                    </NameLabel>
                                    <NumberLabel>
                                        {fnum(this.props.severeWeather[this.props.geoid][hazard].allTime.annualized_damage)}
                                    </NumberLabel>
                                </GraphLabel>
                                <Bar>
                                    <BarValue
                                        width={((this.props.severeWeather[this.props.geoid][hazard].allTime.annualized_damage / totalLoss) * 100)}
                                        color={hazardMeta[hazard].color}
                                    />
                                </Bar>
                            </BarContainer>
                        </GraphListItem>
                    )
                })
        } catch (e) {
            return "Loading..."
        }
    }

    render() {


        return (
            <ul style={{paddingLeft: 50, paddingRight: '2em'}}>
                {this.renderHazardSelector()}
            </ul>
        )
    }
}

HazardList.defaultProps = {
    geoid: store.getState().user.activeGeoid || '36',
    hazard: 'riverine',
    threeD: true,
    standardScale: true,
    setHazard: () => {
    }
};

const mapStateToProps = state => ({
    riskIndex: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeWeather: state.graph.severeWeather || {},
    router: state.router
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardList))