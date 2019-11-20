import React from 'react'
import {connect} from 'react-redux'
import {reduxFalcor} from 'utils/redux-falcor'
import store from "store"
import styled from "styled-components";

import {fnum} from "utils/sheldusUtils"
import COLOR_RANGES from "constants/color-ranges"


// <i class="os-icon os-icon-phone-21"></i>

const getColor = (name) => COLOR_RANGES[5].reduce((a, c) => c.name === name ? c.colors : a).slice();

const hazardMeta = {
    'wind': {color: getColor('Greys'), icon: 'wind'},
    'wildfire': {color: getColor('Blues'), icon: 'forest-fire'},
    'tsunami': {color: getColor('Blues'), icon: 'tsunami'},
    'tornado': {color: getColor('Oranges'), icon: 'tornado'},
    'riverine': {color: getColor('PuBuGn'), icon: 'flood'},
    'lightning': {color: getColor('YlOrRd'), icon: 'storm'},
    'landslide': {color: getColor('BrBG'), icon: 'landslide'},
    'icestorm': {color: getColor('BuPu'), icon: 'snow'},
    'hurricane': {color: getColor('Purples'), icon: 'flood-1'},
    'heatwave': {color: getColor('YlOrBr'), icon: 'drought'},
    'hail': {color: getColor('Blues'), icon: 'hail'},
    'earthquake': {color: getColor('Blues'), icon: 'earthquake'},
    'drought': {color: getColor('Blues'), icon: 'drought'},
    'avalanche': {color: getColor('Blues'), icon: 'avalanche'},
    'coldwave': {color: getColor('Blues'), icon: 'snow'},
    'winterweat': {color: getColor('Blues'), icon: 'snow'},
    'volcano': {color: getColor('Blues'), icon: 'flood'},
    'coastal': {color: getColor('Blues'), icon: 'flood'},
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
                            <GraphIcon color={hazardMeta[hazard].color[3]}
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
                                        color={hazardMeta[hazard].color[3]}
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