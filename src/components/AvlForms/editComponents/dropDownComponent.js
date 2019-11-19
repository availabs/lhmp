import React from 'react'
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import {connect} from "react-redux";
import Element from 'components/light-admin/containers/Element'
import get from "lodash.get";
var _ = require("lodash");

class DropDownComponent extends React.Component{
    constructor(props){
        super(props);

        this.populateDropDowns = this.populateDropDowns.bind(this);
    }

    populateDropDowns(){
        let title = this.props.title.split('_').join(' ');
        if(title === 'county' && this.props.depend_on === undefined){ // for county and cousubs
            return (
                <div className="col-sm-12">
                    <div className="form-group"><label htmlFor>{title.charAt(0).toUpperCase() + title.slice(1)}</label><span style={{'float': 'right'}}>{this.props.prompt(this.props.title)}</span>
                        <select className="form-control justify-content-sm-end" id={this.props.title} onChange={this.props.handleChange} value={this.props.state[this.props.title] || ''} onClick={this.props.onClick}>
                            <option className="form-control" key={0} value={'None'}>--No {title.charAt(0).toUpperCase() + title.slice(1)} Selected--</option>
                            {
                                this.props.meta ?
                                    this.props.meta.map((item,i) =>{
                                        return(<option  className="form-control" key={i+1} value={item.value}>{item.name}</option>)
                                    })
                                    :
                                    null
                            }
                        </select>
                    </div>
                    <br/>
                </div>
            )
        }else if(title === 'municipality' && this.props.state[this.props.depend_on] !== undefined){
            if(this.props.state[this.props.depend_on] !== 'None'){
                return (
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>{title.charAt(0).toUpperCase() + title.slice(1)}</label><span style={{'float': 'right'}}>{this.props.prompt(this.props.title)}</span>
                            <select className="form-control justify-content-sm-end" id={this.props.title} onChange={this.props.handleChange} value={this.props.state[this.props.title] || ''}>
                                <option className="form-control" key={0} value={'None'}>--No {title.charAt(0).toUpperCase() + title.slice(1)} Selected--</option>
                                {
                                    this.props.meta ?
                                        this.props.meta.map((item,i) =>{
                                            return(<option  className="form-control" key={i+1} value={item.value}>{item.name}</option>)
                                        })
                                        :
                                        null
                                }
                            </select>
                        </div>
                        <br/>
                    </div>
                )
            }else{
                return null
            }
        }

        else if(this.props.state[this.props.depend_on] !== undefined && title !== 'municipality'){
            if(this.props.state[this.props.depend_on] !== 'None'){
                return(
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>{title.charAt(0).toUpperCase() + title.slice(1)}</label><span style={{'float': 'right'}}>{this.props.prompt(this.props.title)}</span>
                            <select className="form-control justify-content-sm-end" id={this.props.title} onChange={this.props.handleChange} value={this.props.state[this.props.title] || ''}>
                                <option className="form-control" key={0} value={''}>--No {title.charAt(0).toUpperCase() + title.slice(1)} Selected--</option>
                                {
                                    this.props.meta.map((item,i) =>{
                                        if(item.category === this.props.state[this.props.depend_on]){
                                            return(<option  className="form-control" key={i+1} value={item.type}>{item.type}</option>)
                                        }

                                    })
                                }
                            </select>
                        </div>
                        <br/>
                    </div>
                )
            }else{
                return null
            }
        }else if(this.props.depend_on === undefined && title !== 'municipality'){ // for category drop downs
            let meta = _.uniqBy(this.props.meta,'category')
            return (
                <div className="col-sm-12">
                    <div className="form-group"><label htmlFor>{title.charAt(0).toUpperCase() + title.slice(1)}</label><span style={{'float': 'right'}}>{this.props.prompt(this.props.title)}</span>
                        <select className="form-control justify-content-sm-end" id={this.props.title} onChange={this.props.handleChange} value={this.props.state[this.props.title] || ''}>
                            <option className="form-control" key={0} value='None'>--No {title.charAt(0).toUpperCase() + title.slice(1)} Selected--</option>
                            {
                                meta.map((item,i) =>{
                                    if(item.category && item.type ){// if not a standalone dropdown
                                        return(<option  className="form-control" key={i+1} value={item.category}>{item.category}</option>)
                                    }else{
                                        return null
                                    }

                                })
                            }
                        </select>
                    </div>
                    <br/>
                </div>
            )
        }else{
            return null
            // for stand alone drop downs
        }
    }

    render() {
        return (
            this.populateDropDowns()

        )

    }

}

export default DropDownComponent;