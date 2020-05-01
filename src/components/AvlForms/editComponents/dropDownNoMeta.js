import React from 'react'

class DropDownNoMetaComponent extends React.PureComponent{
    render(){
        return (
            <div className="col-sm-12">
                <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}
                    <span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span>
                </label><span style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                    <select className="form-control justify-content-sm-end" id={this.props.title}
                            onChange={(e) => this.props.handleChange(e)}
                            value={this.props.state[this.props.title] || ''}
                            disabled={this.props.disable_condition ? this.props.state[this.props.disable_condition.attribute] !== this.props.disable_condition.check : null}
                            >

                        <option className="form-control" key={0} value={this.props.defaultValue || 'None'}>
                            {this.props.defaultValue ? this.props.defaultValue : `None Selected`}
                        </option>

                        {this.props.dropDownData ? this.props.dropDownData.map((item,i) =>{
                            return( <option className="form-control" key={i+1} value={item}>{item}</option>)
                        }):
                        null
                        }

                    </select>
                </div>
                <br/>
            </div>
        )
    }
}

export default DropDownNoMetaComponent