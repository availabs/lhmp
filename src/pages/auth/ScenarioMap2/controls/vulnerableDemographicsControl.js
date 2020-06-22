import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import censusIndicatorConfig from '../components/censusIndicatorConfig'
import {setActiveIndicator} from "../../../../store/modules/demographics";
import {zoom} from "leaflet/src/control/Control.Zoom";
import {getColorRange} from "../../../../constants/color-ranges";
import Legend from "../../../../components/AvlMap/components/legend/Legend";
import {format as d3format} from "d3-format/src/defaultLocale";
var _ = require('lodash')

class VulnerableDemographicsControl extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selected_indicator : []
        }
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
        this.props.setActiveIndicator(defaultIndicator.map(d => d.value))
    }
    componentDidUpdate(oldProps,oldState){
        if(_.isEqual(oldState.selected_indicator,this.state.selected_indicator)){
            this.props.setActiveIndicator(this.state.indicator)
        }
    }
    handleChange(e){
        console.log('---',e.target.id,e.target.value,this.state);
        this.props.setActiveIndicator([JSON.parse(e.target.value)])
        this.setState({ ...this.state, [e.target.id]: JSON.parse(e.target.value) });
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
                        value={JSON.stringify(this.state.selected_indicator)}
                >
                    <option key={0} value ={JSON.stringify(indicators_list[0].value)}>{indicators_list[0].label}</option>
                    {indicators_list ? indicators_list.filter( d=> d.label !== "Percentage Poverty").map((item,i) =>{
                            return( <option key={i+1} value={JSON.stringify(item.value)}>{item.label}</option>)

                        })
                        :
                        null
                    }
                </select>
            </div>
        )
    }

    addVulnerableDemographicsLayer(){
        if(this.props.layer.layer.vulnerableDemographicsLayer){
            return (
                <div>
                    <Legend
                        title ={"Vulnerable Demographics Data"}
                        vertical ={false}
                        type={"quantile"}
                        domain = {this.props.layer.layer.vulnerableDemographicsLayer.legend.domain}
                        format ={d3format(".0%")}
                        range = {getColorRange(7, "Reds")}
                    />
                    {this.renderIndicatorDropDown()}
                </div>
            )
        }
    }
    render(){
        return (
            <div>
                {this.addVulnerableDemographicsLayer()}
            </div>
        )
    }
}

const mapStateToProps = state => (
    {
        activePlan : state.user.activePlan,
        activeGeoid:state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        assetsData : get(state.graph,['building','byGeoid'],{})
    });

const mapDispatchToProps = {
    sendSystemMessage,
    setActiveIndicator
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(VulnerableDemographicsControl))