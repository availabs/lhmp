import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import _ from 'lodash';
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {Link} from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import TableSelector from "components/light-admin/tables/tableSelector"
import config from 'pages/auth/Plan/config/guidance-config'
import functions from "../../../pages/auth/Plan/functions";

const counties = ["36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];

class AvlFormsListTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            form_ids: [],
            data: []

        }
        this.formsListTable = this.formsListTable.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.renderHeader = this.renderHeader.bind(this)
        this.renderBody = this.renderBody.bind(this)
    }

    fetchFalcorDeps() {
        let formType = this.props.config.map(d => d.type)
        let formAttributes = Object.keys(get(this.props.config, `[0].attributes`, {}))
        let ids = [];
        return this.props.falcor.get(["geo", this.props.activeGeoid, 'municipalities'])
            .then(() =>
                this.props.falcor.get(
                    ['forms', formType, 'byPlanId', this.props.activePlan, 'length'],
                    ['geo',
                        [this.props.activeGeoid, ...get(this.props.geoData, `${this.props.activeGeoid}.municipalities.value`, [])],
                        ['name']]
                )
                    .then(response => {
                        let length = get(response, ['json', 'forms', formType, 'byPlanId', this.props.activePlan, 'length'], 0);
                        if (length > 0) {
                            return this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'byIndex', [{
                                from: 0,
                                to: length - 1
                            }], ...formAttributes])
                                .then(async (response) => {
                                    let graph = response.json.forms[formType].byPlanId[this.props.activePlan].byIndex;
                                    let colToMap = Object.values(graph).map(v => get(v, `attributes.action_status_update`, null))
                                        .filter(f => f)
                                        .map(v => v.slice(1,-1).split(',').slice(-1).pop())
                                        .filter(f => f)
                                    colToMap = await this.props.falcor.get(['forms', 'byId', colToMap])
                                    Object.keys(graph)
                                        .filter(d => {
                                                if (this.props.filterBy) {
                                                    return Object.keys(this.props.filterBy)
                                                        .reduce((a, c) =>
                                                            a && this.props.filterBy[c].includes(get(graph[d], `attributes.${c}`, null)), true)
                                                }
                                                return true
                                            }
                                        )
                                        .filter(d => d !== '$__path').forEach(id => {
                                        if (graph[id]) {
                                            ids.push(graph[id].id)
                                        }

                                    })
                                    this.setState({
                                        form_ids: ids,
                                        colToMap: get(colToMap, `json.forms.byId`, {})
                                    })
                                    return response
                                })
                        }

                    })
            )

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
        let formAttributes = Object.keys(get(this.props.config, `[0].attributes`, {}))
        let combine_list_attributes = this.props.config.map(d => d.combine_list_attributes);
        let listViewData = [];
        let formType = this.props.config.map(d => d.type);
        if (graph) {
            if (combine_list_attributes[0] === undefined) {
                Object.keys(graph).forEach(item => {

                    let data = {};

                    formAttributes.forEach(attribute => {
                        if (graph[item].value && graph[item].value.attributes) {
                            if (this.state.form_ids.includes(item)) {
                                data['id'] = item;
                                if (graph[item].value.attributes[attribute] && typeof graph[item].value.attributes[attribute] === "string") {
                                    if (graph[item].value.attributes[attribute].includes("[")) {
                                        data[attribute] = graph[item].value.attributes[attribute].slice(1,-1).split(',')
                                            .map(geoData =>  this.props.geoData[geoData] ?
                                                functions.formatName(this.props.geoData[geoData].name, geoData) || '' :
                                                geoData).join(', ');
                                    } else {
                                        data[attribute] = geo[graph[item].value.attributes[attribute]] ?
                                            functions.formatName(geo[graph[item].value.attributes[attribute]].name, graph[item].value.attributes[attribute]) || '' :
                                            graph[item].value.attributes[attribute];
                                    }
                                } else {
                                    let getAttribute =get(graph, `${item}.value.attributes[${attribute}]`, null)
                                    //console.log(getAttribute, typeof getAttribute)
                                    if (getAttribute && typeof getAttribute === 'object' && 
                                        Object.keys(getAttribute).length === 1 && 
                                        Object.keys(getAttribute)[0] === '$type'
                                    ){
                                        data[attribute] = null
                                    }else{
                                        data[attribute] =get(graph, `${item}.value.attributes[${attribute}]`,  this.props.config[0].attributes[attribute].defaultValue);
                                    }
                                }
                                if(this.props.config[0].attributes[attribute].meta_filter && this.props.config[0].attributes[attribute].meta_filter.groupName){
                                    let currVal = get(graph, `${item}.value.attributes[${attribute}]`, null);
                                    currVal = currVal && currVal.includes('[') ? currVal.slice(1,-1).split(',') : currVal
                                    data[attribute] = Object.keys(this.props.config[0].attributes[attribute].meta_filter.groupName)
                                        .reduce((a,c) => {
                                            let group = this.props.config[0].attributes[attribute].meta_filter.groupName[c]
                                            if (currVal && group.length === currVal.length && _.isEqual(currVal, group)){
                                                a = c
                                            }
                                            return a
                                        }, currVal ? currVal.join(',') : currVal)
                                }
                                if(graph[item].value.attributes['action_status_update']){
                                    let latestStatus = graph[item].value.attributes['action_status_update'].slice(1,-1).split(',').slice(-1).pop()
                                    data['update status'] = `/action_status_update/edit/${latestStatus}`;
                                }

                                if(attribute === 'action_status_update'){
                                    let latestStatus = get(graph, [item,'value','attributes','action_status_update'], '').slice(1,-1).split(',').slice(-1).pop()
                                    data['action_status_update'] = get(this.state.colToMap, [latestStatus, 'attributes', 'status'], 'None')
                                }

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
                    //console.log('data',data)
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
                                    functions.formatName(geo[graph[item].value.attributes[attribute]].name, graph[item].value.attributes[attribute]) || '' :
                                    graph[item].value.attributes[attribute];
                            }

                        })
                    });

                    formAttributes.filter(d => !combine_list_attributes[0].attributes.includes(d)).forEach(attribute => {
                        if (graph[item].value && graph[item].value.attributes) {
                            if (this.state.form_ids.includes(item)) {
                                data['id'] = item
                                if (graph[item].value.attributes[attribute] && typeof graph[item].value.attributes[attribute] === "string") {
                                    if (graph[item].value.attributes[attribute].includes("[")) {
                                        data[attribute] = graph[item].value.attributes[attribute].slice(1,-1).split(',')
                                            .map(geoData =>  this.props.geoData[geoData] ?
                                                functions.formatName(this.props.geoData[geoData].name, geoData) || '' :
                                                geoData).join(', ')
                                    } else {
                                        data[attribute] = graph[item].value.attributes[attribute]
                                    }
                                } else {
                                    data[attribute] = graph[item].value.attributes[attribute] || ' ';
                                }
                                let value = Object.keys(initial_data).filter(d => d !== 'id').map(function (k) {
                                    if (initial_data['id'] === item)
                                        return initial_data[k]
                                });
                                if(graph[item].value.attributes['action_status_update']){

                                    data['update status'] = `/action_status_update/edit/${graph[item].value.attributes['action_status_update'].slice(1,-1).split(',').slice(-1).pop()}`;
                                }
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

    renderHeader() {
        return this.props.title === false ? null :
            <h4 className="element-header">
                <label>
                    {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                    {config[this.props.config[0].type] ?
                        <Link
                            className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded"
                            to={
                                get(this.props.config, `[0].guidance`, `/guidance/${config[this.props.config[0].type][0].requirement}/view`)
                            } target={'_blank'}
                        >?</Link>
                        : null}
                </label>
                <span style={{float: 'right'}}>
                        {this.props.config.map((d, i) => {
                            if (d.type === 'actions') {
                                if (this.props.createButtons === true || this.props.createButtons === undefined) {
                                    /*return (
                                        <Link
                                            key={i}
                                            className="btn btn-sm btn-primary"
                                            to={`/${this.props.config.map(d => d.type)}/worksheet/new`}>
                                            Create
                                            New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                                        </Link>
                                    )*/
                                } else {
                                    return null
                                }
                            } else if (d.type === 'participation') {
                                if (this.props.createButtons === true || this.props.createButtons === undefined) {
                                    /*return (
                                        <Link
                                            className="btn btn-sm btn-primary"
                                            to={ `/${this.props.config.map(d=> d.type)}/time/new` } >
                                            Create New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                                        </Link>
                                    )*/
                                } else {
                                    return null
                                }
                            } else {
                                if (this.props.createButtons === true || this.props.createButtons === undefined) {
                                    return (
                                        <Link
                                            key={i}
                                            className="btn btn-sm btn-primary"
                                            to={`/${this.props.config.map(d => d.type)}/new`}>
                                            Create
                                            New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                                        </Link>
                                    )
                                } else {
                                    return null
                                }

                            }
                        })
                        }

                    {this.props.config.map((d, i) => {
                        if (d.type === 'actions') {
                            if (this.props.createButtons === true || this.props.createButtons === undefined) {
                                return (
                                    <Link
                                        key={i}
                                        className="btn btn-sm btn-primary"
                                        to={`/${this.props.config.map(d => d.type)}/project/new`}>
                                        Create
                                        New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))} Planner
                                    </Link>
                                )
                            } else {
                                return null
                            }

                        } else if (d.type === 'participation') {
                            if (this.props.createButtons === true || this.props.createButtons === undefined) {
                                return (
                                    <Link
                                        key={i}
                                        className="btn btn-sm btn-primary"
                                        to={`/${this.props.config.map(d => d.type)}/meeting/new`}>
                                        Create
                                        New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))} Meeting
                                    </Link>
                                )
                            } else {
                                return null
                            }

                        } else {
                            if (this.props.createButtons === true || this.props.createButtons === undefined) {
                                return (
                                    <button
                                        key={i}
                                        disabled
                                        className="btn btn-sm btn-disabled"
                                    >
                                        Create {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))} Planner
                                    </button>
                                )
                            } else {
                                return null
                            }

                        }
                    })}
                    {this.props.createButtons === true || this.props.createButtons === undefined ?
                        <button
                            disabled
                            className="btn btn-sm btn-disabled"
                        >
                            Create HMGP {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                        </button>
                        : null}

                    </span>
            </h4>
    }

    renderBody(listViewData, formAttributes) {
        return listViewData.length > 0 ?
            <div className="element-box">
                <div className="table-responsive">
                    <TableSelector
                        data={listViewData}
                        columns={formAttributes
                            .filter(f => get(this.props.config, `[0].list_attributes`, [])
                                .map(la => typeof la === 'object' ? Object.keys(la)[0].toString() : la)
                                .includes(f)
                            )
                            .map(f => {
                                let tmpAttr =
                                    get(this.props.config, `[0].list_attributes`, [])
                                        .filter(la => typeof la === 'object' && Object.keys(la)[0] === f)
                                        .map(la => la[f])
                                return ({
                                    Header: f,
                                    accessor: f,
                                    filter: get(tmpAttr, `[0].filter`, null) === 'true' ? 'default' :
                                        get(tmpAttr, `[0].filter`, null),
                                    sort: get(tmpAttr, `[0].sort`, 'true') === 'true',
                                    expandable: get(this.props.config, `[0].attributes.${f}.expandable`, null)
                                })
                            })}
                        flex={this.props.flex ? this.props.flex : false}
                        height={this.props.height ? this.props.height : ''}
                        width={this.props.width ? this.props.width : ''}
                        tableClass={this.props.tableClass ? this.props.tableClass : null}
                        actions={{'update status':true, edit: true, view: true, delete: true}}
                        csvDownload={this.props.config[0].csv_download}
                    />
                </div>
            </div>
            :
            <div className="element-box">No data found...</div>
    }

    render() {

        let formAttributes = [];
        let listViewData = [];
        let listAttributes = Object.keys(get(this.props.config, `[0].attributes`, {}))
        let data = this.formsListTable();
        listViewData = data.filter(value => Object.keys(value).length !== 0)
        let formType = this.props.config.map(d => d.type);
        if (listViewData && listViewData.length > 0) {
            if (!_.isEqual(Object.keys(...listViewData).sort(), listAttributes.sort())) {
                formAttributes = Object.keys(...listViewData).filter(d => !['id', 'view', 'edit', 'delete'].includes(d))
            } else {
                formAttributes = listAttributes
            }
        }
        return this.props.pureElement ? (
                <React.Fragment>
                    {this.renderHeader()}
                    {this.renderBody(listViewData, formAttributes)}
                </React.Fragment>
            ) :
            (
                <div className='container'>
                    <Element>
                        {this.renderHeader()}
                        {this.renderBody(listViewData, formAttributes)}
                    </Element>
                </div>
            )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        config: ownProps.json,
        formsListData: get(state.graph, ['forms', 'byId'], {}),
        geoData: get(state.graph, ['geo'], {}),
        formsByIdData: get(state.graph, ['forms']),
        user: get(state, 'user', null)

    }
};

const mapDispatchToProps = {
    sendSystemMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsListTable))




