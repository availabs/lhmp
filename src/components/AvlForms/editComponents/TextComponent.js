import React from 'react'

class TextComponent extends React.PureComponent{
    constructor(props){
        super(props);

    }

    render() {
        let title = this.props.title.split('_').join(' ');
        return (
            <div className="col-sm-12">
                <div className="form-group"><label htmlFor>{title.charAt(0).toUpperCase() + title.slice(1)}</label><span style={{'float': 'right'}}>{this.props.prompt(this.props.title)}</span>
                    <input id={this.props.title} onChange={this.props.handleChange} className="form-control" placeholder={title.charAt(0).toUpperCase() + title.slice(1)} type={this.props.type} value ={this.props.state[this.props.title] || ''}/>
                </div>
                <br/>
            </div>

        )
    }

}

export default TextComponent;