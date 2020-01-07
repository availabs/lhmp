import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { falcorChunkerNice } from "store/falcorGraph"
import store from "store"
import { fnum } from "utils/sheldusUtils"
import capability_config from "pages/Public/Home/components/Strategy/Capabilities/tempConfig.js"
import test_config from 'pages/Public/Home/components/Strategy/Capabilities/testConfig.js'
import get from "lodash.get";
import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBoxOriginal'
var _ = require('lodash')

const counties = ["36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];

class CapabilityStrategy extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            form_ids : [],
            required_capabilities:{}
        }
    }


    fetchFalcorDeps(){
        let ids = []
        return this.props.falcor.get(['forms',['capabilities'],'byPlanId',this.props.activePlan,'length'])
            .then(response =>{
                let length = response.json.forms['capabilities'].byPlanId[this.props.activePlan].length;
                if(length > 0){
                    this.props.falcor.get(['forms',['capabilities'],'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}],['capability_category','capability_type','capability_name','county','municipality']])
                        .then(response =>{
                            let graph = response.json.forms['capabilities'].byPlanId[this.props.activePlan].byIndex;
                            Object.keys(graph).filter(d => d !== '$__path').forEach(id =>{
                                if(graph[id]){
                                    ids.push(graph[id].id)
                                }

                            })
                            this.setState({
                                form_ids : ids
                            })
                            return response
                        })
                }
            })
    }

    componentDidMount(){
        let result= {}
        capability_config.forEach(capability =>{
            if(capability['required'] === 'yes'){
                result[capability['capability_category']] = (result[capability['capability_category']] || 0) + 1
            }

        });
        this.setState({
            required_capabilities:result
        })
        return this.props.falcor.get(['geo',counties,'cousubs'],
            ['geo',counties,['name']])
            .then(response =>{
                let graph = response.json.geo;
                let cousubs = []
                Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                    cousubs.push(graph[item].cousubs)
                })
                this.props.falcor.get(['geo',cousubs.flat(1),['name']])
                    .then(response =>{
                        return response
                    })
            })
    }

    processData(){
        if(this.props.capabilityData && this.props.geoData){
            let data = [];
            let required = 0;
            let result = {
                'Education and outreach':0,
                'Planning/Regulatory':0,
                'Financial':0,
                'Administrative and Technical':0
            }
            Object.keys(this.props.capabilityData).forEach((item,i) =>{
                capability_config.forEach(capability =>{
                    if(this.props.capabilityData[item].value.attributes['capability_category'] === capability['capability_category']){
                        if(this.props.capabilityData[item].value.attributes['capability_type'] === capability['capability_type']){
                            if(capability['required'] === 'yes'){
                                required = required + 1;
                                result[this.props.capabilityData[item].value.attributes['capability_category']] = required
                            }

                        }
                    }
                })
            });
            Object.keys(result).forEach(item =>{
                data.push({
                    'Capability Category':item,
                    'Required Capability Percentage':result[item] !== 0 ? (result[item]/this.state.required_capabilities[item] * 100).toFixed(0) + '%' : 0 + '%'
                })
            });
            return {
                data : data,
                columns : ['Capability Category','Required Capability Percentage']
            }
        }
    }


    render(){
        try {
            return (
                <TableBox { ...this.processData() }
                          pageSize={ 10 }
                          title={ this.props.title }
                          columnFormats= { {
                              "total losses": ",d",
                              "closed losses": ",d",
                              "open losses": ",d",
                              "cwop losses": ",d",
                              "total payments": "a"
                          } }/>
            )
        }
        catch (e) {
            return <ElementBox>Loading...</ElementBox>;
        }

    }
}

CapabilityStrategy.defaultProps = {
    geoid: '36',
    geoLevel: 'cousubs',
    title: "Capability Strategy"
}

const mapStateToProps = state => {
    return {
        router: state.router,
        geoGraph: state.graph.geo,
        activePlan:state.user.activePlan,
        geoData:get(state.graph,['geo']),
        capabilityData:get(state.graph,['forms','byId'])
    }}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CapabilityStrategy));