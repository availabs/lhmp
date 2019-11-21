import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick"

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

    deleteItem (e){
        e.persist()
        let id = e.target.id;
        this.props.sendSystemMessage(
            `Are you sure you want to delete this Capability with id "${ id }"?`,
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
        let graph = this.props.formsListData;
        let formAttributes = this.props.config.map(d => d.list_attributes);
        let listViewData = [];
        if(graph){
            Object.keys(graph).forEach(item =>{
                let data = {};
                formAttributes[0].forEach(attribute =>{
                    if(graph[item].value && graph[item].value.attributes[attribute]){
                        data['id'] = item
                        data[attribute] = graph[item].value.attributes[attribute] || ' '
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
                        <Link
                            className="btn btn-sm btn-primary"
                            to={ `/${this.props.config.map(d=> d.type)}/new` } >
                                Create New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                        </Link>
                        {this.props.config.map(d => {
                            if(d.type === 'actions'){
                                return (
                                    <button
                                        className="btn btn-sm btn-primary"
                                    >
                                        Create {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))} Planner
                                    </button>
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
                                                            <Link className="btn btn-sm btn-outline-primary"
                                                                  to={ `/${formType[0]}/edit/${item['id']}` } >
                                                                Edit
                                                            </Link>
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
        formsListData : get(state.graph,['forms','byId'],{})
    }
};

const mapDispatchToProps = {
    sendSystemMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsListTable))
