import React from 'react';
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import MultiSelectFilter from "../../../../components/filters/multi-select-filter";
import COLOR_RANGES from "constants/color-ranges"
import {setActiveYear, setActiveHazard} from 'store/modules/hazardEvents'

var _ = require("lodash")
const getColor = (name) => COLOR_RANGES[5].reduce((a, c) => c.name === name ? c.colors : a).slice();

const hazardMeta = [
    {value: 'all', name: 'All Haz'},
    {value: 'wind', name: 'Wind', description: '', sheldus: "Wind", colors: getColor('Greys')},
    {value: 'wildfire', name: 'Wildfire', description: '', sheldus: "Wildfire", colors: getColor('Blues')},
    {value: 'tsunami', name: 'Tsunami/Seiche', description: '', sheldus: "Tsunami/Seiche", colors: getColor('Blues')},
    {value: 'tornado', name: 'Tornado', description: '', sheldus: "Tornado", colors: getColor('Blues')},
    {value: 'riverine', name: 'Flooding', description: '', sheldus: "Flooding", colors: getColor('PuBuGn')},
    {value: 'lightning', name: 'Lightning', description: '', sheldus: "Lightning", colors: getColor('Blues')},
    {value: 'landslide', name: 'Landslide', description: '', sheldus: "Landslide", colors: getColor('Blues')},
    {value: 'icestorm', name: 'Ice Storm', description: '', sheldus: "", colors: getColor('Blues')},
    {
        value: 'hurricane',
        name: 'Hurricane',
        description: '',
        sheldus: "Hurricane/Tropical Storm",
        colors: getColor('Purples')
    },
    {value: 'heatwave', name: 'Heat Wave', description: '', sheldus: "Heat", colors: getColor('Blues')},
    {value: 'hail', name: 'Hail', description: '', sheldus: "Hail", colors: getColor('Blues')},
    {value: 'earthquake', name: 'Earthquake', description: '', sheldus: "Earthquake", colors: getColor('Blues')},
    {value: 'drought', name: 'Drought', description: '', sheldus: "Drought", colors: getColor('Blues')},
    {value: 'avalanche', name: 'Avalanche', description: '', sheldus: "Avalanche", colors: getColor('Blues')},
    {value: 'coldwave', name: 'Coldwave', description: '', colors: getColor('Blues')},
    {value: 'winterweat', name: 'Snow Storm', description: '', sheldus: "Winter Weather", colors: getColor('Blues')},
    {value: 'volcano', name: 'Volcano', description: '', colors: getColor('Blues')},
    {value: 'coastal', name: 'Coastal Hazards', description: '', sheldus: "Coastal Hazards", colors: getColor('Blues')}
];
let years = []
const start_year = 1996
const end_year = 2019
for (let i = start_year; i <= end_year; i++) {
    years.push(i)
}
years.push('allTime')
class HazardEventsControl extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            year: 'allTime',
            hazard: undefined
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        this.props.setActiveYear('allTime')
        this.props.setActiveHazard(undefined)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.year !== this.state.year){
            this.props.setActiveYear(this.state.year)
        }

        if (prevState.hazard !== this.state.hazard){
            this.state.hazard === 'all' ?
                this.props.setActiveHazard(hazardMeta.map(f => f.value)) :
                this.props.setActiveHazard(this.state.hazard)
        }
    }

    handleChange(e) {
        this.setState({...this.state, [e.target.id]: e.target.value});

    };

    render() {
        return (
            <div style={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",align:"auto"}}>
                <h6>Year :</h6>
                <select className="form-control justify-content-sm-end"
                        id = "year"
                        onChange={this.handleChange}
                        value={this.state.year}>
                    {years ? years.map((item,i) =>{
                            return( <option key={i+1} value={item}>{item}</option>)
                        })
                        :
                        null
                    }
                </select>
                <br/>
                <h6>Hazard :</h6>
                <select className="form-control justify-content-sm-end"
                        id = "hazard"
                        onChange={this.handleChange}
                        value={this.state.hazard}>
                    {hazardMeta ? hazardMeta.map((item,i) =>{
                            return( <option key={i+1} value={item.value}>{item.name}</option>)
                        })
                        :
                        null
                    }
                </select>
            </div>

        )
    }
}

    const
    mapStateToProps = state => (
        {
            activePlan: state.user.activePlan,
            activeGeoid: state.user.activeGeoid,
            isAuthenticated: !!state.user.authed,
            attempts: state.user.attempts,
            zonesList: get(state.graph, ['forms', 'byId'], {}),
            assetsData: get(state.graph, ['building', 'byGeoid'], {})
        });

    const
    mapDispatchToProps = {
        sendSystemMessage, setActiveYear, setActiveHazard
    };

    export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardEventsControl))