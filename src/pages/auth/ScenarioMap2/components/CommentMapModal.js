import ElementBox from "../../../../components/light-admin/containers/ElementBox";
import {falcorGraph} from "../../../../store/falcorGraph";
import mapboxgl from "mapbox-gl";
import {connect} from "react-redux";
import React, {Component} from 'react';
import get from "lodash.get";
import {reduxFalcor} from 'utils/redux-falcor'
import commentMapLayer from "../../CommentMap/layers/commentMapLayer";

class commentMapModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            title : '',
            type:'',
            comment:'',

        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        console.log('---',e.target.id,e.target.value,this.state);
        this.setState({ ...this.state, [e.target.id]: e.target.value });
    };

    fetchFalcorDeps(){
        return this.props.falcor.get(['forms','map_comment','meta'])
            .then(response =>{
                return response
            })
    }

    render(){

        return(
            <ElementBox>
                <div className="form-group">
                    <div className="col-sm-12">
                        <div className="form-group"><h6>Title</h6>
                            <input id='title' className="form-control"
                                   placeholder="Title"
                                   type="text"
                                   onChange={this.handleChange}
                                   value ={this.state.title}
                            /></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><h6>Type</h6>
                            <select className="form-control justify-content-sm-end" id='type' onChange={this.handleChange} value={this.state.type}>
                                <option className="form-control" key={0} value={''}>--No Type Selected--</option>
                                {
                                    this.props.typeMeta.map((meta,i) =>{
                                        return(<option  className="form-control" key={i+1} value={meta.category}>{meta.category}</option>)
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><h6>Comment</h6>
                            <textarea id='comment' onChange={this.handleChange} className="form-control" placeholder="Comment" type="textArea" value={this.state.comment}/></div>
                    </div>
                    <div className="col-sm-12">
                        <button
                            className="mr-2 mb-2 btn btn-primary btn-sm"
                            type="button"
                            onClick = {(e) =>{

                                e.persist()
                                let args = [];
                                let attributes = {};
                                attributes['title'] = this.state.title || ""
                                attributes['type'] = this.state.type || ""
                                attributes['comment'] = this.state.comment || ""
                                this.props.layer.markers.map((n,i) => {
                                    if(typeof n === 'object' && n._lngLat){
                                        attributes['point'] = [n._lngLat]
                                    }
                                })
                                args.push('map_comment',this.props.activePlan,attributes)
                                return falcorGraph.call(['forms','insert'],args,[],[])
                                    .then(response =>{
                                        alert("Map Comment has been saved")
                                        this.props.layer.markers.push(...attributes.point.map((p, i) => {
                                            new mapboxgl.Marker({
                                                draggable: false,
                                                color: this.props.typeMeta.reduce((a,c) => c.category === this.state.type ? c.type : a,'rgb(129, 126, 125)').toString()
                                            })
                                                .setLngLat(p)
                                                .addTo(this.props.layer.map)
                                                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
                                                    '<div>'
                                                    + '<b>'+ 'Title: ' +'</b>'+ this.state.title + '<br>'
                                                    + '<b>'+ 'Type: ' +'</b>'+ this.state.type + '<br>'
                                                    + '<b>'+ 'Comment: ' +'</b>'+ this.state.comment +
                                                    '</div>'
                                                ))
                                                .on("dragend", e => this.props.layer.calcRoute());
                                        }))
                                        this.props.layer.doAction([
                                            "dismissMessage",
                                            {id:'commentMap'}
                                        ])
                                        this.props.layer.mode = ""
                                        this.props.layer.modals.comment.show = false
                                        this.props.layer.forceUpdate()
                                    })
                            }}>
                            Save
                        </button>
                        <button
                            className="mr-2 mb-2 btn btn-danger btn-sm"
                            type="button"
                            onClick = {(e) =>{
                                e.persist()
                                this.props.layer.markers.pop().remove()
                                this.props.layer.modals.comment.show = false
                                this.props.layer.doAction([
                                    "dismissMessage",
                                    {id:'commentMap'}
                                ])
                                this.props.layer.forceUpdate()
                            }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </ElementBox>
        )
    }


}


const mapStateToProps = (state, { id }) => ({
    activeGeoid:state.user.activeGeoid,
    activePlan : state.user.activePlan,
    typeMeta : get(state.graph,['forms','map_comment','meta','value'],[])
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(commentMapModal))