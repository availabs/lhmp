import React from 'react'
import Element from "../../light-admin/containers/Element";
const TDStyle = {wordBreak: 'break-word', width: '50%'};
class TextComponent extends React.PureComponent{
    renderSection(section,data){
        return (
            <Element>
                <h4>{section.sub_title}</h4>
                <div className='table-responsive'>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ATTRIBUTE</th>
                            <th>VALUE</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            Object.keys(data).filter( d => d!== 'type')
                                .filter(d => data[d].section === section.id)
                                .map(d =>{
                                    return (
                                        <tr>
                                            <td style={TDStyle}>{`${data[d].label}`} :</td>
                                            <td style={TDStyle}>{data[d].value || 'None'}</td>
                                        </tr>
                                    )
                                })
                        }
                        </tbody>
                    </table>
                </div>
            </Element>
        )
    }
    render() {
        const data = this.props.data;
        if(!data.length) return null
        return (
            <React.Fragment>
                {this.props.config[0].sections.length ?
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap'
                    }}>
                        <div className={this.props.config[0].sections.length > 1 ? "col-md-6" : 'col-md-12'} style={{paddingLeft: 0}}>
                            <div className='element-wrapper'>
                                <div className='element-box'>
                                    {
                                        this.props.config[0].sections.filter((s,sI) => sI % 2 === 0).map(section => this.renderSection(section, data))
                                    }
                                </div>
                            </div>

                        </div>

                        {
                            this.props.config[0].sections.length > 1 ?
                                <div className="col-md-6" style={{paddingRight: 0}}>
                                    <div className='element-wrapper'>
                                        <div className='element-box'>
                                            {
                                                this.props.config[0].sections.filter((s,sI) => sI % 2 !== 0).map(section => this.renderSection(section, data))
                                            }
                                        </div>
                                    </div>

                                </div> : null
                        }
                    </div> :
                    (
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='element-wrapper'>
                                    <div className='element-box'>
                                        <div className='table-responsive'>
                                            <table className="table table lightBorder">
                                                <thead>
                                                <tr>
                                                    <th>ATTRIBUTE</th>
                                                    <th>VALUE</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    Object.keys(data).filter(d => d !== 'type').map(d =>
                                                        <tr>
                                                            <td style={TDStyle}>{`${data[d].label}`} :</td>
                                                            <td style={TDStyle}>{data[d].value || 'None'}</td>
                                                        </tr>
                                                    )
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    )
                }
            </React.Fragment>
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