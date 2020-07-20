import React, {Component} from 'react';
import AvlMap from "../../AvlMap";
import config from 'pages/auth/Zones/config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import _ from 'lodash'
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import sociallyVulnerableDemographicsMapLayer from "./components/sociallyVulnerableDemographicsMapLayer";
import censusIndicatorConfig from "../../../pages/auth/ScenarioMap2/components/censusIndicatorConfig";
import Legend from "../../AvlMap/components/legend/Legend";
import {format as d3format} from "d3-format/src/defaultLocale";
import {getColorRange} from "../../../constants/color-ranges";
import vulnerableDemographicsLayer from "./components/sociallyVulnerableDemographicsMapLayer";



class developementZonesFilteredTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.activeGeoid,
            selected_indicator : []
        };
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount(){
        let defaultIndicator = []
        Object.keys(censusIndicatorConfig).forEach(item =>{
            if (item === "Percentage Poverty"){
                defaultIndicator.push({
                    "label":item,
                    "value":censusIndicatorConfig[item]
                })
            }
        })
        this.setState({selected_indicator: defaultIndicator.map(d => d.label)})
    }
    componentDidUpdate(oldProps,oldState){
        if(!_.isEqual(oldState.selected_indicator,this.state.selected_indicator)){
            this.forceUpdate()
        }
    }
    handleChange(e) {
        this.setState({...this.state, [e.target.id]: [e.target.value]});
    }

    indicatorsList(){
        let indicatorsList = []
        Object.keys(censusIndicatorConfig).forEach(item =>{
            indicatorsList.push({
                "label":item,
                "value":censusIndicatorConfig[item]
            })
        })

        return indicatorsList
    }

    renderIndicatorDropDown(){
        let indicators_list = this.indicatorsList()
        return (
            <div style={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",align:"auto"}}>
                <h6>Pick Indicator :</h6>
                <select className="form-control justify-content-sm-end"
                        id = "selected_indicator"
                        onChange={this.handleChange}
                        value={this.state.selected_indicator}
                >
                    {indicators_list ? indicators_list
                            .map((item,i) =>{
                            return( <option key={i+1} value={item.label}>{item.label}</option>)

                        })
                        :
                        null
                    }
                </select>
            </div>
        )
    }

    addVulnerableDemographicsLayer(){
        return (
            <div>
                {this.renderIndicatorDropDown()}
                <Legend
                    title ={"Vulnerable Demographics Data"}
                    vertical ={false}
                    type={"quantile"}
                    domain = {vulnerableDemographicsLayer.legend.domain}
                    format ={d3format(".1%")}
                    range = {getColorRange(7, "Reds")}
                />
            </div>
        )
    }

    render(){
        return (
            <React.Fragment>
                <div>
                    {this.addVulnerableDemographicsLayer()}
                </div>
                <div style={{width: '100%', height: '50vh'}}>
                    <AvlMap
                        zoom={18}
                        mapactions={false}
                        scrollZoom={false}
                        center={[-73.7749, 42.6583]}
                        styles={[
                            { name: "Terrain", style: "mapbox://styles/am3081/cjhi0xntt5ul52snxcbsnaeii" },
                            { name: 'Dark Streets', style: 'mapbox://styles/am3081/ck3rtxo2116rr1dmoppdnrr3g'},
                            { name: 'Light Streets', style: 'mapbox://styles/am3081/ck3t1g9a91vuy1crzp79ffuac'}
                        ]}
                        sidebar={false}
                        layers={[sociallyVulnerableDemographicsMapLayer]}
                        layerProps={{
                            [sociallyVulnerableDemographicsMapLayer.name]: {
                                selected_indicator: censusIndicatorConfig[this.state.selected_indicator[0]],
                            }
                        }}
                    />
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        activeGeoid: state.user.activeGeoid,
        activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid,
        graph: state.graph,
        activePlan: state.user.activePlan,
        formsListData: get(state.graph, ['forms', 'byId'], {}),
        geoData: get(state.graph, ['geo'], {}),
        user: get(state, 'user', null),
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        formsByIdData: get(state.graph,['forms']),
    }
};
const mapDispatchToProps = ({sendSystemMessage});
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(developementZonesFilteredTable))