import React from 'react'

class DateComponent extends React.PureComponent{
    constructor(props){
        super(props);

    }

    render() {
        return (
            <div className="col-sm-12">
                <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}</label><span style={{'float': 'right'}}>
                    {this.props.prompt(this.props.title)}<span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span></span>
                    <input id={this.props.title} onChange={this.props.handleChange} className="form-control" placeholder={this.props.label} type={this.props.type} value={this.props.state[this.props.title] || ''}/>
                </div>
                <br/>
            </div>


        )
    }

}

export default DateComponent;