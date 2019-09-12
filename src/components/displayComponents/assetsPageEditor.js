import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import {EditorState} from "draft-js";
import {Link} from "react-router-dom";
import get from "lodash.get"
var numeral = require('numeral')


class assetsPageEditor extends Component {
    constructor(props) {
        super(props);

        this.renderTableBoxes= this.renderTableBoxes.bind(this)
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(
                ['building','byGeoid'
                    ,this.props.activeGeoid,
                    this.props.filter_type,this.props.filter_value,'sum',['count','replacement_value']])
            .then(response =>{
                return response
            })
    }

    getData() {
        let data = []
        let propClasses = this.props.filter_value;
        if(this.props.buildingByPropClassData[this.props.activeGeoid] !== undefined){
            let graph = this.props.buildingByPropClassData[this.props.activeGeoid].propType
            Object.keys(graph).forEach(item =>{
                propClasses.forEach(propClass =>{
                    if (item === propClass){
                        console.log('check',numeral(parseInt(graph[item].sum.replacement_value.value)).format('0,0a'))
                        data.push({
                            'prop_class':item,
                            'sum_replacement_value':numeral(parseInt(graph[item].sum.replacement_value.value)).format('0,0a') || 0,
                            'count': numeral(parseInt(graph[item].sum.count.value)).format('0,0a') || 0
                        })
                    }
                })

            })
        }
        return data
    }
    renderTableBoxes() {
        let propClasses = this.props.prop_class;
        let data = this.getData();

        console.log('data',data)
        return data.map(item => {
                return (
                    <div>
                        <h4 >{item.prop_class}</h4>
                        <div className={'row'}>

                            <div className={'col-4'}>
                                <a className="element-box el-tablo" href={"#"}>
                                    <div>
                                        <div className="label">Replacement Value</div>
                                        <div className="value" style={{font:'8px'}}>
                                            ${item.sum_replacement_value}<br/>

                                        </div>
                                        <div className="label">{item.count} buildings</div>
                                    </div>
                                </a>
                            </div>
                            <div className={'col-4'}>
                                <a className="element-box el-tablo" href={"#"}>
                                    <div>
                                        <div className="label">Replacement Value</div>
                                        <div className="value" style={{font:'8px'}}>
                                            ${item.sum_replacement_value}<br/>

                                        </div>
                                        <div className="label">{item.count} buildings</div>
                                    </div>
                                </a>
                            </div>
                            <div className={'col-4'}>
                                <a className="element-box el-tablo" href={"#"}>
                                    <div>
                                        <div className="label">Replacement Value</div>
                                        <div className="value" style={{font:'8px'}}>
                                            ${item.sum_replacement_value}<br/>

                                        </div>
                                        <div className="label">{item.count} buildings</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                )



            })

    }

    render() {
        return (
            <Element>
                {this.renderTableBoxes()}
            </Element>

        )

    }

}

const mapStateToProps = (state, ownProps) => {
    return ({
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        prop_class: ownProps.prop_class,
        buildingByPropClassData: get(state.graph,'building.byGeoid',{})
    })
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(assetsPageEditor))
