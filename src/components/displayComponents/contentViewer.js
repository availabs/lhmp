import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {convertFromHTML, convertToRaw} from 'draft-js';
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import styled from "styled-components";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './contentEditor.css'
import get from "lodash.get";
import './contentEditor.css'
const COLS = ['content_id', 'attributes', 'body', 'created_at', 'updated_at'];

const DIV = styled.div`
    display: flex;
    justify-content: space-between;
    .left {float: left !important;}
    .halfWidth {width: 50%;}
    .quarterToFullWidth {width: 75%;}
    .quarterWidth {width: 25%;}
    * {height: fit-content;}
`
const CONTENTDIV = styled.div`
    margin: 0px;
    
`
class ContentViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentFromDB: null,
            currentKey: null
        };
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getCurrentKey = this.getCurrentKey.bind(this)
    }
    getCurrentKey = () =>
        this.props.scope === 'global' ?
            this.props.requirement :
            this.props.requirement + '-' + this.props.user.activePlan + '-' + this.props.user.activeCousubid

    componentDidUpdate(prevProps, prevState){
        if (prevProps.activeCousubid !== this.props.activeCousubid ||
            this.state.currentKey !== this.getCurrentKey()
        ){
            this.fetchFalcorDeps()
        }
    }

    fetchFalcorDeps() {
        if (!this.props.requirement || !this.props.user.activePlan || !this.props.activeCousubid) return Promise.resolve();
        let contentId = this.getCurrentKey();
        return this.props.falcor.get(
            ['content', 'byId', [contentId], COLS]
        ).then(contentRes => {
            if (contentRes.json.content.byId[contentId]) {
                let status = get(contentRes.json.content.byId[contentId], `attributes.status`, '');
                this.setState({'currentKey': contentId,
                    contentFromDB: contentRes.json.content.byId[contentId].body,
                    status: status, statusFromDb: status})
                return contentRes.json.content.byId[contentId].body
            }else{
                this.setState({'currentKey': contentId, contentFromDB: null, status: '', statusFromDb: ''})
            }
            return null
        })
    }
    handleSubmit(e) {
        e.preventDefault()
        if (!this.props.requirement || !this.props.user.activePlan || !this.props.user.activeCousubid) return null;
        let html = this.state.contentFromDB;
        let contentId = this.getCurrentKey();
        let attributes = this.state.status ? '{"status": "' + this.state.status +'"}' : '{}';
        if (this.state.statusFromDb !== this.state.status) {
            let args = {'content_id': `${contentId}`, 'attributes': attributes, 'body': `${html}`};
            this.props.falcor.set({
                paths: [
                    ['content', 'byId', [contentId], COLS]
                ],
                jsonGraph: {
                    content: {
                        byId: {
                            [contentId]: args
                        }
                    }
                }
            }).then(response => {
                response.error ?
                    this.props.sendSystemMessage(`Error occurred during editing. Please try again later.`, {type: "danger"}) :
                    this.props.sendSystemMessage(`Content successfully edited.`, {type: "success"});
            })
        }
    }
    renderStatusTracker(){
        return (
            <React.Fragment>
                <DIV className='col-12' style={{marginTop: '50px', paddingRight: '0', display:'flex'}}>
                    <label className='selectLabel'>Status: </label>
                    <select
                        className='dropdownSelect hoverable quarterToFullWidth left btn btn-outline-primary btn-primary step-trigger-btn'
                        id={'status'}
                        value={this.state.status}
                        onChange={(e)=> this.setState({status: e.target.value})}
                    >
                        <option key={0} value={''}></option>
                        <option key={1} value={'Not Started'}>Not Started</option>
                        <option key={1} value={'Started'}>Started</option>
                        <option key={2} value={'Ready for review'}>Ready for review</option>
                        {this.props.user.authLevel > 5 ?
                            <React.Fragment>
                                <option key={3} value={'Requirement not met'}>Requirement not met</option>
                                <option key={4} value={'Requirement met'}>Requirement met</option>
                            </React.Fragment> : null
                        }
                    </select>
                    <a className='hoverable left quarterWidth btn btn-primary step-trigger-btn'
                       onClick={this.handleSubmit}
                    >Submit</a>
                </DIV>
                <CONTENTDIV>
                    {this.renderContent()}
                </CONTENTDIV>
            </React.Fragment>
        )
    }

    renderCallout(){
        return (
            <React.Fragment>
                <DIV className='col-12' style={{marginTop: '50px', paddingRight: '0', display:'flex'}}>
                    <label className='selectLabel'>Callout: </label>
                </DIV>
                <CONTENTDIV>
                    {this.renderContent()}
                </CONTENTDIV>
            </React.Fragment>
        )
    }
    renderContent(){
        return (
            <div style={{display:'inline-block', textAlign: 'justify'}}
                 dangerouslySetInnerHTML={{ __html: this.state.contentFromDB ? this.state.contentFromDB :
                         this.props.requirement.includes('callout') ? null : '<i>Content not available.</i>'
                 }} />
        )
    }
    render() {
        let {editorState} = this.state;
        return (
            //this.props.type === 'contentEditor' ? (
                <React.Fragment>
                    {this.props.showStatusTracker && this.props.requirement.slice(-7) !== 'callout' ? this.renderStatusTracker() :
                        this.renderCallout()}

                </React.Fragment>
            //) : ''
        )
    }
}

const mapDispatchToProps = {sendSystemMessage};

const mapStateToProps = (state, ownProps) => {
    return {
        isAuthenticated: !!state.user.authed,
        geoGraph: state.graph,
        activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ContentViewer))
