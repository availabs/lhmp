import React from 'react'

class TextComponent extends React.PureComponent{
    render() {
        const data = this.props;
        return (
            <div className="container">
                {Object.keys(data).filter( d => d!== 'type').map(d =>{
                    return (
                        <div className='row'>
                            <div className = 'col-sm-6'>
                                <h6>{data[d].attribute || ''} :</h6>
                            </div>
                            <div className = 'col-sm-6'>
                                <label>{data[d].value || 'None'}</label>
                            </div>
                        </div>
                    )
                })}

            </div>
        )
    }
}

export default TextComponent;