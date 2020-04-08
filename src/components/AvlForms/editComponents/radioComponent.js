import React from 'react'
import PromptModal from "../../light-admin/prompt/promptModal";

class RadioComponent extends React.PureComponent{
    constructor(props){
        super(props);

    }

    render() {
        if(this.props.display_condition !== '' && this.props.display_condition){
            return (
                <div className="col-sm-12">
                    <div className="form-group" style ={{display : this.props.display_condition.check.includes(this.props.state[this.props.display_condition.attribute]) ? 'block' :'none' }}>
                        <label htmlFor>{this.props.label}
                            <span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span>
                        </label><span style={{'float': 'right'}}>{this.props.prompt(this.props.title)}</span>
                        {
                            this.props.values.map((value,i) =>{
                                return (
                                    <div className='col-sm-5'>
                                        <div className='form-inline'>
                                            <label className='mb-2 mr-sm-2 mb-sm-0'>
                                                <input
                                                    checked={this.props.state[this.props.title] === value}
                                                    id={this.props.title}
                                                    className="form-check-input"
                                                    type={this.props.type}
                                                    value={value}
                                                    onChange={(e) => this.props.handleChange(e)}/><span><label>{value}</label></span>
                                            </label>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <br/>
                </div>

            )
        }else{
            return (
                <div className="col-sm-12">
                    <div className="form-group" >
                        <label htmlFor>{this.props.label}</label><span style={{'float': 'right'}}>{this.props.prompt(this.props.title)}</span>
                        {
                            this.props.values.map((value,i) =>{
                                return (
                                    <div className='col-sm-5'>
                                        <div className='form-inline'>
                                            <label className='mb-2 mr-sm-2 mb-sm-0'>
                                                <input
                                                    checked={this.props.state[this.props.title] === value}
                                                    id={this.props.title}
                                                    className="form-check-input"
                                                    type={this.props.type}
                                                    value={value}
                                                    onChange={(e) => this.props.handleChange(e)}/><span><label>{value}</label></span>
                                            </label>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <br/>
                </div>

            )
        }

    }

}

export default RadioComponent;