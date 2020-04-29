import React from 'react'

class NumberComponent extends React.PureComponent{
    constructor(props){
        super(props);

    }

    render() {
        return (
            <div className="col-sm-12">
                <div className="form-group"><label htmlFor>{this.props.label}
                    <span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span>
                </label><span style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                    <input id={this.props.title} onChange={this.props.handleChange} className="form-control" placeholder={this.props.label} type={this.props.type} value ={this.props.state[this.props.title] || ''}/>
                </div>
                <br/>
            </div>

        )
    }

}

export default NumberComponent;