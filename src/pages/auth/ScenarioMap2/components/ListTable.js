import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick"
import {push} from "react-router-redux";
import mapboxgl from "mapbox-gl";
var _ = require('lodash')
const counties = ["36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];

class AvlFormsListTable extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            form_ids : [],
            data : []

        }
        this.formsListTable = this.formsListTable.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
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

    fetchFalcorDeps(){
        let formType = this.props.config.map(d => d.type)
        let formAttributes = this.props.config.map(d => d.list_attributes);
        let ids = [];
        return this.props.falcor.get(['forms',formType,'byPlanId',this.props.activePlan,'length'],
            ['forms','map_comment','meta'],
            )
            .then(response =>{
                let length = response.json.forms[formType].byPlanId[this.props.activePlan].length;
                if(length > 0){
                    this.props.falcor.get(['forms',formType,'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}],...formAttributes])
                        .then(response =>{
                            let graph = response.json.forms[formType].byPlanId[this.props.activePlan].byIndex;
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
        let graph = this.props.formsListData;
        let geo = this.props.geoData;
        let meta = this.props.typeMeta
        let formAttributes = this.props.config.map(d => d.list_attributes);
        let combine_list_attributes = this.props.config.map(d => d.combine_list_attributes);
        let listViewData = [];
        if(graph){
            if(combine_list_attributes[0] === undefined){
                Object.keys(graph).forEach(item =>{
                    let data = {};
                    formAttributes[0].forEach(attribute =>{
                        if(graph[item].value && graph[item].value.attributes){
                            if(this.state.form_ids.includes(item)){
                                data['id'] = item
                                data[attribute] = attribute === 'type' ?
                                    meta.reduce((a,c) => graph[item].value.attributes[attribute] === c.category ? c.type:a,null)
                                    :
                                    graph[item].value.attributes[attribute] || ' '
                            }

                        }
                    });
                    listViewData.push(data)

                });
            }else{
                Object.keys(graph).forEach(item =>{
                    let initial_data = {}
                    let data = {};
                    combine_list_attributes[0].attributes.forEach((attribute,i) =>{
                        Object.keys(geo).filter(d => d !== 'S__path').forEach(g =>{
                            if(this.state.form_ids.includes(item)){
                                initial_data['id'] = item;
                                initial_data[attribute] = geo[graph[item].value.attributes[attribute]] ? geo[graph[item].value.attributes[attribute]].name || '' : graph[item].value.attributes[attribute]
                            }

                        })
                    });

                    formAttributes[0].filter(d=> !combine_list_attributes[0].attributes.includes(d)).forEach(attribute =>{
                        if(graph[item].value && graph[item].value.attributes){
                            if(this.state.form_ids.includes(item)){
                                data['id'] = item
                                data[attribute] = graph[item].value.attributes[attribute] || ' '
                                let value = Object.keys(initial_data).filter(d => d !== 'id').map(function(k)
                                {
                                    if(initial_data['id'] === item)
                                        return initial_data[k]
                                })
                                data[combine_list_attributes[0].result] = !value.includes("") ? value.join(",") : value
                            }
                        }
                    })
                    listViewData.push(data)

                })
            }

        }
        return listViewData

    }

    render(){
        let formAttributes = [];
        let listViewData = [];
        let data = this.formsListTable();
        listViewData = data.filter(value => Object.keys(value).length !== 0)
        let formType = this.props.config.map(d => d.type);
        if(listViewData && listViewData.length > 0){
            if(!_.isEqual(Object.keys(...listViewData).sort(),this.props.config[0].list_attributes.sort())){
                formAttributes = Object.keys(...listViewData).filter(d => d !== 'id')
            }else{
                formAttributes = this.props.config[0].list_attributes
            }
            //this.props.onViewClick({viewAll: true, data:listViewData, initLoad: true});

        }

        return (
            <div>
                {
                    listViewData.length > 0 ?
                        <div className="table-responsive" >
                            <table className="table table-sm table-hover">
                                <thead>
                                <tr>
                                    {
                                        formAttributes ? formAttributes
                                                .filter(f => get(this.props.config[0], `attributes[${f}].hidden`, "false") === "true" ? false : true)
                                                .map((item,i) => {
                                                    return (
                                                        <th key ={i}>{item}</th>
                                                    )
                                                })
                                            :
                                            null
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    listViewData.map((item,i) =>{
                                        if(Object.keys(item).length > 0){
                                            return (
                                                <tr key={i}>
                                                    {formAttributes ? formAttributes
                                                        .filter(f => get(this.props.config[0], `attributes[${f}].hidden`, "false") === "true" ? false : true)
                                                        .map((attribute,i) =>{
                                                            if(attribute === 'type'){
                                                                return (
                                                                    <td key={i}><span style={{fontSize:'50px',color:item[attribute]}}>&#8226;</span></td>
                                                                )
                                                            }else{
                                                                return (
                                                                    <td key={i} onClick={(e) =>{
                                                                        let type = this.props.typeMeta.reduce((a,c) => c.type === item.type ? c.category : a,null)
                                                                        let layer = this.props.layer
                                                                        let activeGeoid = this.props.activeGeoid
                                                                        this.props.layer.map.flyTo({center:item.point.reduce((a,c) => c ? [c.lng,c.lat]:a,null), zoom: 12})
                                                                        let popup = new mapboxgl.Popup({ offset: 25 })
                                                                            .setHTML(
                                                                                '<div>'
                                                                                + '<b>'+ 'Title: ' +'</b>'+ item.title + '<br>'
                                                                                + '<b>'+ 'Type: ' +'</b>'+ type + '<br>'
                                                                                + '<b>'+ 'Comment: ' +'</b>'+ item.comment +
                                                                                '</div>')
                                                                            .addTo(this.props.layer.map)
                                                                        popup.on('close', function(e){
                                                                            return falcorGraph.get(['geo',activeGeoid,'boundingBox'])
                                                                                .then(response =>{
                                                                                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                                                                                    let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                                                                                    layer.map.resize()
                                                                                    layer.map.fitBounds(bbox)
                                                                                    layer.forceUpdate()
                                                                                })
                                                                        });
                                                                        return new mapboxgl.Marker({
                                                                            draggable: false,
                                                                            color: item.type
                                                                        })
                                                                            .setLngLat(item.point.reduce((a,c) => c ? c:a,null))
                                                                            .addTo(this.props.layer.map)
                                                                            .setPopup(popup)
                                                                            .on("dragend", e => this.props.layer.calcRoute())
                                                                    }

                                                                    }

                                                                    >
                                                                        {item[attribute]}</td>
                                                                )
                                                            }

                                                        }):null}
                                                    {this.props.editButton === true ?
                                                        <td>
                                                            {(formType[0] === 'actions' || formType[0] === 'participation') ?
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
                                                        :
                                                        null}
                                                    {this.props.viewButton === true ?
                                                        <td>
                                                            {formType[0] === 'actions' || formType[0] === 'participation' ?

                                                                <Link className="btn btn-sm btn-outline-primary"
                                                                      to={ `/${formType[0]}/view/${item['sub_type']}/${item['id']}` }>
                                                                    View
                                                                </Link>
                                                                :
                                                                formType[0] === 'evacuation_route' ?
                                                                    <button className="btn btn-sm btn-outline-primary"
                                                                            onClick={(e) => this.props.onViewClick(item)}>
                                                                        View
                                                                    </button> :
                                                                    <Link className="btn btn-sm btn-outline-primary"
                                                                          to={ `/${formType[0]}/view/${item['id']}` }>
                                                                        View
                                                                    </Link>
                                                            }

                                                        </td>
                                                        :null}
                                                    {
                                                        this.props.deleteButton === true ?
                                                            <td>
                                                                <button id= {item['id']} className="btn btn-sm btn-outline-danger"
                                                                        onClick={this.deleteItem}>
                                                                    Delete
                                                                </button>
                                                            </td>
                                                            : null
                                                    }



                                                </tr>
                                            )
                                        }

                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                        :
                        <div className="element-box">No data found...</div>
                }
            </div>

        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        config: ownProps.json,
        geoData : get(state.graph,['geo'],{}),
        formsListData : get(state.graph,['forms','byId'],{}),
        typeMeta : get(state.graph,['forms','map_comment','meta','value'],[]),
        formsByIdData: get(state.graph,['forms'])

    }
};

const mapDispatchToProps = {
    sendSystemMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsListTable))