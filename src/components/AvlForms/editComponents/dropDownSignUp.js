import React from 'react'
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import {connect} from "react-redux";
import Element from 'components/light-admin/containers/Element'
import get from "lodash.get";
var _ = require("lodash");

class DropDownSignUpComponent extends React.Component{
    constructor(props){
        super(props);

        this.populateDropDowns = this.populateDropDowns.bind(this);
    }

    populateDropDowns(){
        console.log('props',this.props.meta)
        if(this.props.area === 'true'){ // for county and cousubs
            if(this.props.signup_county && this.props.signup_county.length > 0){
                return (
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}</label><span style={{'float': 'right'}}>{this.props.prompt(this.props.title)}</span>
                            <select className="form-control justify-content-sm-end"
                                    id={this.props.title}
                                    onChange={this.props.handleChange}
                                    value={this.props.state[this.props.title] || ''}
                                    data-error = {this.props.data_error ? this.props.data_error : ""}
                                    required = {this.props.required ? this.props.required : ""}
                                    onClick={this.props.onClick}>
                                {
                                    this.props.meta ?
                                        this.props.meta.map((item,i) =>{
                                            if(this.props.signup_county === item.value){
                                                return(<option  className="form-control" key={i+1} value={item.value}>{item.name}</option>)
                                            }

                                        })
                                        :
                                        null
                                }
                            </select>
                            <div className="help-block form-text with-errors form-control-feedback">{this.props.required}</div>
                        </div>
                        <br/>
                    </div>
                )
            }else{
                return (
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}</label><span style={{'float': 'right'}}>{this.props.prompt(this.props.title)}</span>
                            <select className="form-control justify-content-sm-end"
                                    id={this.props.title}
                                    onChange={this.props.handleChange}
                                    value={this.props.state[this.props.title] || ''}
                                    data-error = {this.props.data_error ? this.props.data_error : ""}
                                    required = {this.props.required ? this.props.required : ""}
                                    onClick={this.props.onClick}>
                                <option className="form-control" key={0} value={'None'}>--No {this.props.label} Selected--</option>
                                {
                                    this.props.meta ?
                                        this.props.meta.map((item,i) =>{
                                            return(<option  className="form-control" key={i+1} value={item.value}>{item.name}</option>)
                                        })
                                        :
                                        null
                                }
                            </select>
                            <div className="help-block form-text with-errors form-control-feedback">{this.props.required}</div>
                        </div>
                        <br/>
                    </div>
                )
            }

        }else{
            return null
            // for stand alone drop downs
        }
    }

    render() {
        console.log('in componenet')
        return (
            this.populateDropDowns()

        )

    }

}

export default DropDownSignUpComponent;

/*

else if(this.props.depend_on === undefined && this.props.area === undefined && this.props.state[this.props.depend_on] === undefined){ // for category drop downs
            let meta = _.uniqBy(this.props.meta,'category');
            return (
                <div className="col-sm-12">
                    <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}</label><span style={{'float': 'right'}}>{this.props.prompt(this.props.title)}</span>
                        <select className="form-control justify-content-sm-end"
                                id={this.props.title} onChange={this.props.handleChange}
                                value={this.props.state[this.props.title] || ''}
                                required={this.props.required ? this.props.required : ""}
                                disabled = {this.props.disable_condition !== '' && this.props.disable_condition ? this.props.state[this.props.disable_condition.attribute] !== this.props.disable_condition.check : null}
                        >
                            <option className="form-control" key={0} value='None'>--No {this.props.label} Selected--</option>
                            {this.props.title === 'name_of_associated_hazard_mitigation_plan' ?
                                <option className="form-control" key={1} value={' '}>Add new plan</option>
                                :
                                null
                            }
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
                        <div className="help-block form-text with-errors form-control-feedback">{this.props.required}</div>
                    </div>
                    <br/>
                </div>
            )
        }

else if(this.props.state[this.props.depend_on] !== undefined && this.props.area ==='true'){
            if(this.props.state[this.props.depend_on] !== 'None'){
                return (
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}</label><span style={{'float': 'right'}}>{this.props.prompt(this.props.title)}</span>
                            <select className="form-control justify-content-sm-end" id={this.props.title} onChange={this.props.handleChange} value={this.props.state[this.props.title] || ''}>
                                <option className="form-control" key={0} value={'None'}>--No {this.props.label} Selected--</option>
                                {
                                    this.props.meta ?
                                        this.props.meta.map((item,i) =>{
                                            if(item.value.slice(0,5) === this.props.state[this.props.depend_on]){
                                                return(<option  className="form-control" key={i+1} value={item.value}>{item.name}</option>)
                                            }

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

        else if(this.props.state[this.props.depend_on] !== undefined && this.props.area === undefined){
            if(this.props.state[this.props.depend_on] !== 'None'){
                let meta = _.uniqBy(this.props.meta,'type');
                return(
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}</label><span style={{'float': 'right'}}>{this.props.prompt(this.props.title)}</span>
                            <select className="form-control justify-content-sm-end" id={this.props.title} onChange={this.props.handleChange} value={this.props.state[this.props.title] || ''}>
                                <option className="form-control" key={0} value={''}>--No {this.props.label} Selected--</option>
                                {
                                    meta.map((item,i) =>{
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
        }
 */