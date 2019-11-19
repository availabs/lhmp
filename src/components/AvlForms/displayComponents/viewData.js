import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick"
import GraphFactory from 'components/AvlForms/displayComponents/graphFactory.js'

class AvlFormsViewData extends React.Component{
    constructor(props){
        super(props);
    }

    fetchFalcorDeps(){
        let attributes = this.props.config.map(d => d.attributes);
        let county = '' ;
        let cousub = '';
        return this.props.falcor.get(['forms','byId',this.props.id,'attributes',Object.keys(attributes[0])])
            .then(response =>{
                let graph = response.json.forms.byId;
                Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                    county = graph[item].attributes.county || 'None';
                    cousub = graph[item].attributes.cousub || 'None';
                })
                if(county !== 'None'){
                    this.props.falcor.get(['geo',county,['name']])
                        .then(response =>{
                            return response
                        })
                }
                if(cousub !== 'None'){
                    this.props.falcor.get(['geo',cousub,['name']])
                        .then(response =>{
                            return response
                        })
                }
                return response
            })
    }

    formsViewData(){
        let graph = this.props.formsViewData[this.props.id];
        let geoData = this.props.geoData;
        let data = [];
        if(graph){
            Object.keys(graph.attributes).forEach(item =>{
                if(item === 'county' || item === 'cousub'){
                    data.push({
                        attribute : item,
                        value: geoData[graph.attributes[item].value] ? geoData[graph.attributes[item].value].name : 'None'
                    })
                }else{
                    data.push({
                        attribute:item,
                        value:graph.attributes[item].value || 'None'
                    })
                }
            })

        }
        return data

    }

    render(){
        let data = this.formsViewData();
        return(
            <div className='container'>
                <div className='element-box'>
                    <GraphFactory
                        graph={{type: this.props.config.map(d => d.attributes.county.display_type)}}
                        {...data}
                        isVisible = {true}
                    >
                    </GraphFactory>
                </div>
            </div>

        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        config: ownProps.json,
        formsViewData : get(state.graph,['forms','byId'],{}),
        geoData : get(state.graph,['geo'],{}),
        id : ownProps.id
    }
};

const mapDispatchToProps = {
    sendSystemMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsViewData))

