import React from 'react'

class TextComponent extends React.PureComponent{
    render() {
        const data = this.props.data;
        if(!data.length) return null
        console.log('data', data, this.props.config[0].sections)
        return (
            <div className="container">
                {this.props.config[0].sections.length ?
                    this.props.config[0].sections.map(section =>
                        <div className='row'>
                            <div className='col-sm-12'><h4>{section.sub_title}</h4></div>
                            {
                                Object.keys(data).filter( d => d!== 'type')
                                    .filter(d => data[d].section === section.id)
                                    .map(d =>{
                                    return (
                                        <React.Fragment>
                                            <div className = 'col-sm-6'>
                                                <h6>{`${data[d].label}`} :</h6>
                                            </div>
                                            <div className = 'col-sm-6'>
                                                <label>{data[d].value || 'None'}</label>
                                            </div>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </div>
                    ) :
                    (Object.keys(data).filter( d => d!== 'type').map(d =>{
                        console.log('checkinh', d, data[d])
                            return (
                                <div className='row'>
                                    <div className = 'col-sm-6'>
                                        <h6>{`${data[d].label}`} :</h6>
                                    </div>
                                    <div className = 'col-sm-6'>
                                        <label>{data[d].value || 'None'}</label>
                                    </div>
                                </div>
                            )
                        }))
                }
            </div>
        )
    }
}
/*{Object.keys(this.props.config[0].attributes)
    .filter(attr => this.props.config[0].attributes[attr].section === section.id)
    .map(attr =>{
        let tmpData = data.filter(f => f.attribute === attr).pop();
        return (
            <React.Fragment>
                <div className = 'col-sm-6'>
                    <h6>{tmpData ? tmpData.attribute : attr} :</h6>
                </div>
                <div className = 'col-sm-6'>
                    <label>{tmpData ? tmpData.value : 'None'}</label>
                </div>
            </React.Fragment>
        )
    })}*/
export default TextComponent;