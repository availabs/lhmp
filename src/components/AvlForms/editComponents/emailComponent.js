import React from 'react'

class EmailComponent extends React.PureComponent{
    constructor(props){
        super(props);

    }

    render() {
        return (
            <div className="col-sm-12">
                <div className="form-group">
                    <label htmlFor={this.props.label}>{this.props.label}
                        <span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span>
                    </label><span style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                    <input
                        className="form-control"
                        autoFocus
                        id={this.props.title}
                        data-error={this.props.data_error ? this.props.data_error : ""}
                        onChange={this.props.handleChange}
                        placeholder={this.props.label}
                        type={this.props.type}
                        value ={this.props.state[this.props.title] || ''}
                    />
                    <div className="help-block form-text with-errors form-control-feedback"></div>
                </div>
                <br/>
            </div>



        )
    }

}

export default EmailComponent;