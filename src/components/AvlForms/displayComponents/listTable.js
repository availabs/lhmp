import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick"

const counties = ["36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];

class AvlFormsListTable extends React.Component{
    constructor(props){
        super(props);

        this.formsListTable = this.formsListTable.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    fetchFalcorDeps(){
        let formType = this.props.config.map(d => d.type)
        let formAttributes = this.props.config.map(d => d.list_attributes)
        return this.props.falcor.get(['forms',formType,'byPlanId',this.props.activePlan,'length'])
            .then(response =>{
                let length = response.json.forms[formType].byPlanId[this.props.activePlan].length
                this.props.falcor.get(['forms',formType,'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}],...formAttributes])
                    .then(response =>{
                        return response
                    })
            })
    }

    componentDidMount(){
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

    deleteItem (e){
        e.persist()
        let id = e.target.id;
        this.props.sendSystemMessage(
            `Are you sure you want to delete this form with id "${ id }"?`,
            {
                onConfirm: () => this.props.falcor.call(['forms','remove'],[id])
                    .then(() => this.fetchFalcorDeps()),
                id: `delete-content-${ id }`,
                type: "danger",
                duration: 0
            }
        )
    }

    formsListTable(){
        let geo = this.props.geoData
        let graph = this.props.formsListData;
        let formAttributes = this.props.config.map(d => d.list_attributes);
        let combine_list_attributes = this.props.config.map(d => d.combine_list_attributes);
        let listViewData = [];
        if(graph){
            Object.keys(graph).forEach(item =>{
                let data = {};
                formAttributes[0].forEach(attribute =>{
                    if(graph[item].value && graph[item].value.attributes){
                        if(Object.keys(graph[item].value.attributes).filter(d => d!=='sub_type').includes(attribute)){
                            data['id'] = item
                            data[attribute] = graph[item].value.attributes[attribute] || ' '
                        }

                        }
                })
                listViewData.push(data)
            });

            return listViewData
        }

    }

    render(){
        let formAttributes = this.props.config.map(d => d.list_attributes);
        let listViewData = this.formsListTable();
        let formType = this.props.config.map(d => d.type)
        return (
                <div className='container'>
                    <Element>
                        <h4 className="element-header">{this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                            <span style={{float:'right'}}>
                        {formType[0] === 'actions'?
                            <Link
                                className="btn btn-sm btn-primary"
                                to={ `/${this.props.config.map(d=> d.type)}/worksheet/new` } >
                                Create New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                            </Link>
                            :
                            <Link
                                className="btn btn-sm btn-primary"
                                to={ `/${this.props.config.map(d=> d.type)}/new` } >
                                Create New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                            </Link>
                        }

                        {this.props.config.map(d => {
                            if(d.type === 'actions'){
                                return (
                                    <Link
                                        className="btn btn-sm btn-primary"
                                        to={ `/${this.props.config.map(d=> d.type)}/project/new` } >
                                        Create New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))} Planner
                                    </Link>
                                )
                            }else{
                                return (
                                    <button
                                        disabled
                                        className="btn btn-sm btn-disabled"
                                    >
                                        Create {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))} Planner
                                    </button>
                                )
                            }
                        })}

                        <button
                            disabled
                            className="btn btn-sm btn-disabled"
                        >
                                Create HMGP {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                        </button>
                    </span>
                        </h4>
                        <div className="element-box">
                            <div className="table-responsive" >
                                <table className="table table lightBorder">
                                    <thead>
                                    <tr>
                                        {formAttributes[0].map((item) => {
                                            return (
                                                <th>{item}</th>
                                            )
                                        })
                                        }
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        listViewData.map(item =>{
                                            if(Object.keys(item).length > 0){
                                                return (
                                                    <tr>
                                                        {formAttributes[0].map(attribute =>{
                                                            return (
                                                                <td>{item[attribute]}</td>
                                                            )
                                                        })}
                                                        <td>
                                                            {formType[0] === 'actions' ?
                                                                <Link className="btn btn-sm btn-outline-primary"
                                                                      to={ `/${formType[0]}/${item['sub_type']}/edit/${item['id']}` }>
                                                                    Edit
                                                                </Link>
                                                                :
                                                                <Link className="btn btn-sm btn-outline-primary"
                                                                      to={ `/${formType[0]}/edit/${item['id']}` } >
                                                                    Edit
                                                                </Link>
                                                            }

                                                        </td>
                                                        <td>
                                                            {formType[0] === 'actions' ?

                                                                <Link className="btn btn-sm btn-outline-primary"
                                                                    to={ `/${formType[0]}/view/${item['sub_type']}/${item['id']}` }>
                                                                     View
                                                                </Link>
                                                                :
                                                                <Link className="btn btn-sm btn-outline-primary"
                                                                      to={ `/${formType[0]}/view/${item['id']}` }>
                                                                    View
                                                                </Link>
                                                            }

                                                        </td>
                                                        <td>
                                                            <button id= {item['id']} className="btn btn-sm btn-outline-danger"
                                                                    onClick={this.deleteItem}>
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            }

                                        })
                                    }
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </Element>
                </div>

        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        config: ownProps.json,
        formsListData : get(state.graph,['forms','byId'],{}),
        geoData : get(state.graph,['geo'],{})

    }
};

const mapDispatchToProps = {
    sendSystemMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsListTable))

/*
if(combine_list_attributes.length > 0 && combine_list_attributes[0].attributes ){
                            /*
                            let value = '';
                            combine_list_attributes[0].attributes.forEach(attribute =>{
                                Object.keys(geo).forEach(g =>{
                                    if(g === graph[item].value.attributes[attribute]){
                                        data['id'] = item
                                        data[combine_list_attributes[0].result] = geo[g].name
                                    }
                                })
                                console.log('checking',item,graph[item].value.attributes[attribute])
                            })
                            /*
                            data['id'] = item
                            data[combine_list_attributes[0].result] = graph[item].value.attributes[combine_list_attributes] || ' '
                             */


