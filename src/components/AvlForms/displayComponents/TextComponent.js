import React from 'react'
import Element from "../../light-admin/containers/Element";
import _ from 'lodash'
import get from 'lodash.get'
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import ImageViewer from "./imageViewer";
import AvlFormsJoin from '../editComponents/AvlFormsJoin'
import listNewComp from 'components/AvlForms/editComponents/formTypeToConfig.js'
import ContentViewer from "./contentViewer";
import config from "../../../pages/auth/Plan/config/guidance-config";
import {Link} from "react-router-dom";

const TDStyle = {wordBreak: 'break-word', width: '50%'};

class TextComponent extends React.PureComponent {
    renderSection(section, data) {
        const specialDataTypes = (location) => {
            return (
                <React.Fragment>
                    {
                        Object.keys(data).filter(d => d !== 'type')
                            .filter(d => data[d].section === section.id && data[d].displayType === 'form_view' &&
                                ((location === 'outside_table' && data[d].display_location_in_table === 'false') ||
                                location !== 'outside_table')
                            )
                            .map(d => {
                                // showTable = false;
                                return (
                                    get(data, `[${d}].value`, '').split(',')
                                        .map((value,i) =>
                                            <AvlFormsViewData
                                                json = {listNewComp[data[d].formType]}
                                                id = {[value]}
                                                showHeader={false}
                                                autoLoad={this.props.autoLoad}
                                                key={i}
                                            />
                                        )
                                )
                            })
                    }
                    {
                        Object.keys(data).filter(d => d !== 'type')
                            .filter(d => data[d].section === section.id && data[d].displayType === 'imageViewer'  &&
                                ((location === 'outside_table' && data[d].display_location_in_table === 'false') ||
                                    location !== 'outside_table'))
                            .map(d => {
                                // showTable = false;
                                return (
                                    get(data, `[${d}].value`, '').split(',')
                                        .map((value,i) =>
                                            <ImageViewer
                                                image={value}
                                                key={i}
                                            />
                                        )
                                )
                            })
                    }
                    {
                        Object.keys(data).filter(d => d !== 'type')
                            .filter(d => data[d].section === section.id && data[d].displayType === 'AvlFormsJoin'  &&
                                ((location === 'outside_table' && data[d].display_location_in_table === 'false') ||
                                    location !== 'outside_table'))
                            .map(d => {
                                // showTable = false;
                                return (
                                    get(data, `[${d}].value`, '').split(',')
                                        .map((value,i) =>
                                            <AvlFormsJoin
                                                id={value}
                                                key={i}
                                                {...data[d]}
                                            />
                                        )
                                )
                            })
                    }
                    {
                        Object.keys(data).filter(d => d !== 'type')
                            .filter(d => data[d].section === section.id && data[d].displayType === 'contentViewer'  &&
                                ((location === 'outside_table' && data[d].display_location_in_table === 'false') ||
                                    location !== 'outside_table'))
                            .map(d => {
                                // showTable = false;
                                return (
                                    get(data, `[${d}].value`, '').split(',')
                                        .map((value,i) =>
                                            <ContentViewer
                                                state={{[data[d].label]: value}}
                                                title={data[d].label}
                                            />
                                        )
                                )
                            })
                    }
                </React.Fragment>
            )
        }
        let showTable = true;
        return (
            <Element>
                <h4>{section.sub_title}</h4>
                {specialDataTypes('outside_table')}
                {
                    showTable ? (
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
                                    Object.keys(data).filter(d => d !== 'type')
                                        .filter(d => data[d].section === section.id
                                            && !(
                                                ['form_view', 'imageViewer', 'AvlFormsJoin', 'contentViewer'].includes(data[d].displayType) &&
                                                data[d].display_location_in_table === 'false'
                                            )
                                        )
                                        .map((d,i) => {
                                            return (
                                                <tr key={i}>
                                                    <td style={TDStyle}>{`${data[d].label}`} :</td>
                                                    {
                                                        ['form_view', 'imageViewer', 'AvlFormsJoin', 'contentViewer'].includes(data[d].displayType) &&
                                                            data[d].display_location_in_table !== 'false' ?
                                                            <td style={TDStyle}>{specialDataTypes()}</td> :
                                                            <td style={TDStyle}>{data[d].value || 'None'}</td>
                                                    }
                                                </tr>
                                            )
                                        })
                                }
                                </tbody>
                            </table>
                        </div>
                    ) : null
                }
            </Element>
        )
    }

    render() {
        const data = this.props.data;
        if (!data.length) return null;

        return (
            <React.Fragment>
                {
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
                }

                {this.props.config[0].sections.length ?
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap'
                    }}>
                        <div className={this.props.config[0].sections.length > 1 ? "col-md-6" : 'col-md-12'}
                             style={{paddingLeft: 0}}>
                            <div className='element-wrapper'>
                                <div className='element-box'>
                                    {
                                        this.props.config[0].sections.filter((s, sI) => sI % 2 === 0).map(section => this.renderSection(section, data))
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
                                                this.props.config[0].sections.filter((s, sI) => sI % 2 !== 0).map((section,i) => this.renderSection(section, data))
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
                                                    Object.keys(data).filter(d => d !== 'type').map((d,i) =>
                                                        <tr key ={i}>
                                                            <td style={TDStyle}>{`${data[d].label}`} :</td>
                                                            <td style={TDStyle}>
                                                                {
                                                                    data[d].displayType === 'imageViewer' ?
                                                                        <ImageViewer image={data[d].value} {...data[d]}/> :
                                                                        data[d].displayType === 'AvlFormsJoin' ?
                                                                            get(data, `[${d}].value`, '').split(',')
                                                                                .map((value,i) =>
                                                                                    <AvlFormsJoin
                                                                                        id={value}
                                                                                        key={i}
                                                                                        {...data[d]}
                                                                                    />
                                                                                ) :
                                                                            data[d].displayType === 'contentViewer' ?
                                                                                <ContentViewer
                                                                                    state={{[data[d].label]: data[d].value}}
                                                                                    title={data[d].label}
                                                                                /> :
                                                                        (data[d].value || 'None')
                                                                }
                                                            </td>
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