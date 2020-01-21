import React from 'react'
import {connect} from 'react-redux'
import {reduxFalcor} from 'utils/redux-falcor'

import styled from "styled-components";

import {fnum} from "utils/sheldusUtils"
import COLOR_RANGES from "constants/color-ranges"


// <i class="os-icon os-icon-phone-21"></i>

const getColor = (name) => COLOR_RANGES[5].reduce((a, c) => c.name === name ? c.colors : a).slice();


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
    color: ${props => props.color || '#5c6587'};
    font-size: 35px;
    height: 40px;
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

    renderHazardSelector(data) {
        let barTotal = 300;// data.reduce(a,d)
        data
            .map(bar => {
                const name = bar.name;
                console.log('name', name);
                return (
                    <GraphListItem onClick={this.props.onClick.bind(this, name)}>
                        {/*
                        <GraphIcon color={bar.name} className="fi flaticon-007-flood" />
                        */}
                        <BarContainer>
                            <GraphLabel>
                                <NameLabel>
                                    {name}
                                </NameLabel>
                                <NumberLabel>
                                    {fnum(bar.value)}
                                </NumberLabel>
                            </GraphLabel>
                            <Bar>
                                <BarValue
                                    width={((bar.value / barTotal) * 100)}
                                    color={bar.color}
                                />
                            </Bar>
                        </BarContainer>
                    </GraphListItem>
                )
            })
    }

    catch(e) {
        return "Loading..."
    }

    render() {


        return (
            <ul style={{paddingLeft: 50, paddingRight: '2em'}}>
                {this.renderHazardSelector(this.props.data)}
            </ul>
        )
    }
}


HazardList.defaultProps = {
    geoid: '36',
    hazard: 'riverine',
    threeD: true,
    standardScale: true,
    data: [
        {
            name: 'Parrots',
            value: 235,
            color: 'chartreuse'
        },
        {
            name: 'Elephants',
            value: 70,
            color: 'pink'
        }
    ],
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