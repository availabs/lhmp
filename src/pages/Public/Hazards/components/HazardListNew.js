import React from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'

import { Link } from "react-router-dom"

import get from 'lodash.get'

import ElementBox from 'components/light-admin/containers/ElementBox'

import HazardListHeroStats from "./HazardListHeroStats"
// import HazardMap from "./HazardMap"
import HazardMap from "components/mitigate-ny/HazardMapSimple"
import HazardEventsMapController from "./HazardEventsMapController"

import { fnum } from "utils/sheldusUtils"

import "./HazardList.css"



// <i class="os-icon os-icon-phone-21"></i>

const ListItem = ({ hazard, name, onClick, active, annualized_damage }) =>
    <li className={ active ? " active" : "" }
        key={ hazard }>
        <a onClick={ onClick }>
            <i className="os-icon os-icon-arrow-right2"></i>
            <span>{ name } </span>
            <span className="float-right"
                  style={ { paddingRight: "10px" } }>
				{ fnum(annualized_damage) }
			</span>
        </a>

    </li>

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
            ['riskIndex', 'hazards']
        )
            .then(response => response.json.riskIndex.hazards)
            .then(hazards => this.props.falcor.get(
                ['riskIndex', 'meta', hazards, 'name'],
                ['severeWeather', this.props.geoid, hazards, 'allTime', 'annualized_damage']
            ))
    }

    selectHazard(hazard) {
        this.setState({ hazard });
    }

    renderHazardSelector() {
        try {
            return this.props.riskIndex.hazards.value.slice()
                .sort((a, b) => {
                    const aVal = this.props.severeWeather[this.props.geoid][a].allTime.annualized_damage,
                        bVal = this.props.severeWeather[this.props.geoid][b].allTime.annualized_damage;
                    return bVal < aVal ? -1 : 1;
                })
                .map(hazard => {
                    const name = this.props.riskIndex.meta[hazard].name
                    return (
                        <ListItem onClick={ this.selectHazard.bind(this, hazard) }
                                  key={ hazard }
                                  hazard={ hazard }
                                  name={ name }
                                  active={ hazard === this.state.hazard }
                                  annualized_damage={ this.props.severeWeather[this.props.geoid][hazard].allTime.annualized_damage }/>
                    )
                })
        }
        catch (e) {
            return "Loading..."
        }
    }

    render() {
        return (
            <div className="row m-0">

                <div className="col-3"
                     style={ { minHeight: "500px" } }>
                    <div className='ae-side-menu'>
                        <ul className='ae-main-menu'>
                            { this.renderHazardSelector() }
                        </ul>
                    </div>
                </div>


                <div className="col-9">
                    <div className="row">
                        <div className="col-12">
                            <ElementBox>
                                <HazardListHeroStats
                                    { ...this.state }/>
                            </ElementBox>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <ElementBox>
                                <h5>Damage in Dollars from Events, By Census Tract, 1996-2017</h5>
                                <HazardMap height={ 600 }
                                           { ...this.state }
                                           threeD={ false }
                                           standardScale={ this.props.standardScale }
                                           tractTotals={ true }
                                           highRisk={ 0.0}
                                           thresholds={ [10000, 100000, 500000, 1000000] }
                                />
                            </ElementBox>
                            <i style={{color: '#afafaf'}}>
                                Source: NCDC Storm Events Dataset
                            </i>
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}

HazardList.defaultProps = {
    geoid: '36',
    hazard: 'riverine',
    threeD: true,
    standardScale: true
}

const mapStateToProps = state => ({
    riskIndex: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeWeather: state.graph.severeWeather || {},
    router: state.router
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardList))