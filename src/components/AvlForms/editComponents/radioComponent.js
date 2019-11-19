import React from 'react'
import PromptModal from "../../light-admin/prompt/promptModal";

class RadioComponent extends React.PureComponent{
    constructor(props){
        super(props);

    }

    render() {
        let title = this.props.title.split('_').join(' ');
        return (
            <div className="col-sm-12">
                <div className="form-group"><label htmlFor>{title.charAt(0).toUpperCase() + title.slice(1)}</label><span style={{'float': 'right'}}>{this.props.prompt(this.props.title)}</span>
                    {
                        this.props.values.map(value =>{
                            return (
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                id={this.props.title}
                                                className="form-check-input"
                                                type={this.props.type}
                                                value={value}
                                                onChange={this.props.handleChange}/><span><label>{value}</label></span>
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

export default RadioComponent;