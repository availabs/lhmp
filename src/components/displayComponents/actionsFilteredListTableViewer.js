import React, {Component} from 'react';
import get from 'lodash.get'
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'
import {authProjects} from "store/modules/user";
import TableSelector from "components/light-admin/tables/tableSelector"
import _ from "lodash";
import Element from "../light-admin/containers/Element";
import config from "../../pages/auth/Plan/config/guidance-config";
import ProjectConfig from 'pages/auth/actions/actions_project_forms/config.js'

import {Link} from "react-router-dom";
import {sendSystemMessage} from "../../store/modules/messages";

const counties = ["36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];

const ATTRIBUTES = [
    'shelter_id',
    'shelter_name',
    'evacuation_capacity',
    'post_impact_capacity',
    'ada_compliant',
    'wheelchair_accessible',
    'generator_onsite',
    'self_suffienct_electricty',
]

class inventoryTableViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.activeGeoid,
        };
        this.formsListTable = this.formsListTable.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    fetchFalcorDeps() {
        let formType = ProjectConfig.map(d => d.type)
        let formAttributes = Object.keys(get(ProjectConfig, `[0].attributes`, {}))
        let ids = [];
        return this.props.falcor.get(
            ['forms', [...formType, 'action_status_update'], 'byPlanId', this.props.activePlan, 'length']
        )
            .then(response => {
                let length = (key) => response.json.forms[key].byPlanId[this.props.activePlan].length;
                if (length(formType[0]) > 0) {
                    this.props.falcor.get(
                        ['forms', formType, 'byPlanId', this.props.activePlan, 'byIndex', [{
                            from: 0,
                            to: length(formType[0]) - 1
                        }], ...formAttributes],
                        ['forms', 'action_status_update', 'byPlanId',
                            this.props.activePlan, 'byIndex', [{
                            from: 0,
                            to: length('action_status_update') - 1
                        }], ['status']]
                    )
                        .then(response => {
                            let graph = response.json.forms[formType].byPlanId[this.props.activePlan].byIndex;
                            let graph_action_status = response.json.forms['action_status_update'].byPlanId[this.props.activePlan].byIndex,
                                values_action_status = Object.values(graph_action_status).reduce((a, c) => {
                                    a.push({id: c.id, ...c.attributes});
                                    return a;
                                }, []),
                                allowed_action_status = values_action_status
                                    .filter(f => get(this.props, `filterBy`, []).includes(f.status))
                                    .map(f => f.id)
                            Object.keys(graph).filter(d => d !== '$__path').forEach(id => {
                                if (_.intersection(get(graph, `[${id}].attributes.action_status_update`, []),
                                    allowed_action_status).length){
                                    ids.push(graph[id].id)
                                }

                            })
                            this.setState({
                                form_ids: ids
                            })
                            return response
                        })
                }

            })
    }

    componentDidMount() {
        return this.props.falcor.get(['geo', counties, 'cousubs'],
            ['geo', counties, ['name']])
            .then(response => {
                let graph = response.json.geo;
                let cousubs = []
                Object.keys(graph).filter(d => d !== '$__path').forEach(item => {
                    cousubs.push(graph[item].cousubs)
                })
                this.props.falcor.get(['geo', cousubs.flat(1), ['name']])
                    .then(response => {
                        return response
                    })
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activeCousubid !== this.props.activeCousubid || prevState.geoid !== this.state.geoid) {
            this.setState({geoid: this.props.activeCousubid !== "undefined" ? this.props.activeCousubid : this.props.activeGeoid})
        }
    }

    deleteItem(e) {
        e.persist()
        let id = e.target.id;
        this.props.sendSystemMessage(
            `Are you sure you want to delete this form with id "${id}"?`,
            {
                onConfirm: () => this.props.falcor.call(['forms', 'remove'], [id])
                    .then(() => this.fetchFalcorDeps()),
                id: `delete-content-${id}`,
                type: "danger",
                duration: 0
            }
        )
    }

    formsListTable() {
        let geo = this.props.geoData
        let graph = this.props.formsListData;
        let formAttributes = Object.keys(get(ProjectConfig, `[0].attributes`, {}))
        let combine_list_attributes = ProjectConfig.map(d => d.combine_list_attributes);
        let listViewData = [];
        let formType = ProjectConfig.map(d => d.type);

        if (graph) {
            if (combine_list_attributes[0] === undefined) {
                Object.keys(graph).forEach(item => {
                    let data = {};
                    formAttributes.forEach(attribute => {
                        if (graph[item].value && graph[item].value.attributes) {
                            if (this.state.form_ids && this.state.form_ids.includes(item)) {
                                data['id'] = item;
                                data[attribute] = graph[item].value.attributes[attribute] || ' ';
                                ['view', 'edit']
                                    .filter(f => this.props[f + 'Button'] === true || this.props[f + 'Button'] === undefined)
                                    .forEach(f => {
                                        data[f] = graph[item].value.attributes['sub_type'] ?
                                            (f === 'view' ?
                                                `/${formType[0]}/${f}/${graph[item].value.attributes['sub_type']}/${item}` :
                                                `/${formType[0]}/${graph[item].value.attributes['sub_type']}/${f}/${item}`) :
                                            `/${formType[0]}/${f}/${item}`;
                                    })
                                if (this.props.deleteButton === true || this.props.deleteButton === undefined) {
                                    data['delete'] =
                                        <button id={item} className="btn btn-sm btn-outline-danger"
                                                onClick={this.deleteItem}> Delete </button>
                                }
                            }

                        }
                    });
                    listViewData.push(data)

                });
            } else {
                Object.keys(graph).forEach(item => {
                    let initial_data = {}
                    let data = {};
                    combine_list_attributes[0].attributes.forEach((attribute, i) => {
                        Object.keys(geo).filter(d => d !== 'S__path').forEach(g => {
                            if (this.state.form_ids.includes(item)) {
                                initial_data['id'] = item;
                                initial_data[attribute] = geo[graph[item].value.attributes[attribute]] ?
                                    geo[graph[item].value.attributes[attribute]].name || '' :
                                    graph[item].value.attributes[attribute];
                            }

                        })
                    });

                    formAttributes.filter(d => !combine_list_attributes[0].attributes.includes(d)).forEach(attribute => {
                        if (graph[item].value && graph[item].value.attributes) {
                            if (this.state.form_ids.includes(item)) {
                                data['id'] = item
                                data[attribute] = graph[item].value.attributes[attribute] || ' '
                                let value = Object.keys(initial_data).filter(d => d !== 'id').map(function (k) {
                                    if (initial_data['id'] === item)
                                        return initial_data[k]
                                });
                                data[combine_list_attributes[0].result] = !value.includes("") ? value.join(",") : value;
                                ['view', 'edit']
                                    .filter(f => this.props[f + 'Button'] === true || this.props[f + 'Button'] === undefined)
                                    .forEach(f => {
                                        data[f] = graph[item].value.attributes['sub_type'] ?
                                            (f === 'view' ?
                                                `/${formType[0]}/${f}/${graph[item].value.attributes['sub_type']}/${item}` :
                                                `/${formType[0]}/${graph[item].value.attributes['sub_type']}/${f}/${item}`) :
                                            `/${formType[0]}/${f}/${item}`;
                                    });
                                if (this.props.deleteButton === true || this.props.deleteButton === undefined) {
                                    data['delete'] =
                                        <button id={item} className="btn btn-sm btn-outline-danger"
                                                onClick={this.deleteItem}> Delete </button>
                                }
                            }
                        }
                    })
                    listViewData.push(data)

                })
            }
            return listViewData
        }

    }

    render() {
        let formAttributes = [];
        let listViewData = [];
        let listAttributes = Object.keys(get(ProjectConfig, `[0].attributes`, {}))
        let data = this.formsListTable();
        listViewData = data.filter(value => Object.keys(value).length !== 0)
        let formType = ProjectConfig.map(d => d.type);
        if (listViewData && listViewData.length > 0) {
            if (!_.isEqual(Object.keys(...listViewData).sort(), listAttributes.sort())) {
                formAttributes = Object.keys(...listViewData).filter(d => !['id', 'view', 'edit', 'delete'].includes(d))
            } else {
                formAttributes = listAttributes
            }
        }
        return (
            listViewData.length > 0 ?
                <div className="element-box">
                    <div className="table-responsive">
                        <TableSelector
                            data={listViewData}
                            columns={formAttributes
                                .filter(f => get(ProjectConfig, `[0].list_attributes`, [])
                                    .map(la => typeof la === 'object' ? Object.keys(la)[0].toString() : la)
                                    .includes(f)
                                )
                                .map(f => {
                                    let tmpAttr =
                                        get(ProjectConfig, `[0].list_attributes`, [])
                                            .filter(la => typeof la === 'object' && Object.keys(la)[0] === f)
                                            .map(la => la[f])
                                    return ({
                                        Header: f,
                                        accessor: f,
                                        filter: get(tmpAttr, `[0].filter`, null) === 'true' ? 'default' :
                                            get(tmpAttr, `[0].filter`, null),
                                        sort: get(tmpAttr, `[0].sort`, 'true') === 'true',
                                        expandable: get(ProjectConfig, `[0].attributes.${f}.expandable`, null)
                                    })
                                })}
                            flex={this.props.flex ? this.props.flex : false}
                            height={this.props.height ? this.props.height : ''}
                            width={this.props.width ? this.props.width : ''}
                            tableClass={this.props.tableClass ? this.props.tableClass : null}
                            actions={
                                this.props.edit ?
                                    {edit: true, view: true, delete: true} : null
                            }
                            csvDownload={this.props.edit ? ProjectConfig[0].csv_download : []}
                        />
                    </div>
                </div>
                :
                <div className="element-box">No data found...</div>
        )
    }
}

const mapStateToProps = state => {
    return {
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        graph: state.graph,
        activePlan: state.user.activePlan,
        formsListData: get(state.graph, ['forms', 'byId'], {}),
        geoData: get(state.graph, ['geo'], {}),
        user: get(state, 'user', null)
    }
};
const mapDispatchToProps = ({authProjects, sendSystemMessage});
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(inventoryTableViewer))