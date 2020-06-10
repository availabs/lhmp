import React from 'react'
import get from 'lodash.get'
import moment from "moment";
import config from "../../../pages/auth/Plan/config/guidance-config";
import {Link} from "react-router-dom";
import styled from "styled-components";

const DIV = styled.div`
    .type {font-weight: bold;}
    .created_at {font-style: oblique;}
`
class TextComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
        this.renderHeader = this.renderHeader.bind(this)
    }

    renderHeader(data) {
        return (
            this.props.showHeader ?
                get(this.props.config[0], `page_title`, null) &&
                get(data.filter(f => f.attribute === this.props.config[0].page_title), `[0].value`, null) ?
                    <h4 className="element-header" style={{textTransform: 'capitalize'}}>
                        <label>
                            {get(data.filter(f => f.attribute === this.props.config[0].page_title), `[0].value`, null)}
                            {config[this.props.config[0].type] ?
                                <Link
                                    className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded"
                                    to={
                                        get(this.props.config, `[0].guidance`, `/guidance/${config[this.props.config[0].type][0].requirement}/view`)
                                    } target={'_blank'}
                                >?</Link>
                                : null}
                        </label>
                        {get(this.props.config[0], `sub_title`, null) ?
                            <h6>{get(data.filter(f => f.attribute === this.props.config[0].sub_title), `[0].value`, null)}</h6> : null}
                    </h4> :
                    <h4 className="element-header" style={{textTransform: 'capitalize'}}>
                        {get(this.props.config[0], `default_title`,
                            `${get(this.props.config, `[0].type`, '')} ${get(this.props.config, `[0].sub_type`, '')}`)}
                        {config[this.props.config[0].type] ?
                            <Link
                                className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded"
                                to={
                                    get(this.props.config, `[0].guidance`, `/guidance/${config[this.props.config[0].type][0].requirement}/view`)
                                } target={'_blank'}
                            >?</Link>
                            : null}
                    </h4> : null
        )
    }

    render() {
        const data = this.props.data;
        console.log('data?', data)
        if (!data.length) return null;

        return (
            <React.Fragment>
                {this.renderHeader(data)}
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='element-wrapper'>
                            <div className='element-box'>
                                {
                                    Object.keys(data).filter(d => d !== 'type').map((d, i) =>
                                        <DIV>
                                            <div className={data[d].attribute}>
                                                {
                                                    data[d].attribute === 'created_at' ?
                                                        moment(data[d].value).calendar() :
                                                        data[d].value
                                                }
                                            </div>
                                        </DIV>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
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