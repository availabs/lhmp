import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Editor from '@draft-js-plugins/editor';

import 'draft-js/dist/Draft.css';
import {
    EditorState,
    CompositeDecorator,
    convertToRaw,
    convertFromRaw, ContentState
} from 'draft-js';
import { useTheme, imgLoader, showLoading } from "@availabs/avl-components"
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import styled from "styled-components";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './contentEditor/contentEditor.css'
import get from "lodash.get";
import ElementBox from "../light-admin/containers/ElementBox";
import makeButtonPlugin from './contentEditor/buttons';
import createLinkDecorator from './contentEditor/linkDecorator'
import makeImagePlugin from "./contentEditor/image"
import makeLinkItPlugin from "./contentEditor/linkify-it"
import makeSuperSubScriptPlugin from "./contentEditor/super-sub-script"
import makePositionablePlugin from "./contentEditor/positionable"
import makeStuffPlugin from "./contentEditor/stuff"
import makeResizablePlugin from "./contentEditor/resizable"
import functions from "../../pages/auth/Plan/functions";
import addLinkPlugin from "./contentEditor/addLink";
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

const ANNEX_DIV = styled.div`
    text-align: right;
    color: #047bf8 !important;
    font-weight: 600;
    border-bottom: 1px solid #9dc9ea;
    padding-bottom: 4px;
`

const decorator = createLinkDecorator();
const positionablePlugin = makePositionablePlugin();
const resizablePlugin = makeResizablePlugin();

const imagePlugin = makeImagePlugin({
    wrappers: [
        positionablePlugin.wrapper,
        resizablePlugin.wrapper
    ]
});

const plugins = [
    // makeButtonPlugin(),
    imagePlugin,
    addLinkPlugin,
    makeSuperSubScriptPlugin(),
    positionablePlugin,
    resizablePlugin,
    makeStuffPlugin()
];

class ContentViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentFromDB: null,
            currentKey: null,
            pulledFromCounty: false
        };
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getCurrentKey = this.getCurrentKey.bind(this)
    }
    getCurrentKey = (county = false) =>
        this.props.scope === 'global' ?
            this.props.requirement :
            this.props.requirement + '-' + this.props.user.activePlan + '-' + `${county ? this.props.user.activeGeoid : this.props.user.activeCousubid}`

    componentDidUpdate(prevProps, prevState){
        if (prevProps.activeCousubid !== this.props.activeCousubid ||
            this.state.currentKey !== this.getCurrentKey()
        ){
            this.fetchFalcorDeps()
        }
    }
    isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    fetchFalcorDeps() {
        if (!this.props.requirement || !this.props.user.activePlan || !this.props.activeCousubid) return Promise.resolve();
        let contentId = this.getCurrentKey();
        let countyContentId = this.getCurrentKey(true);
        let emptyBody = ['<p></p>', '']
        if(this.state.pulledFromCounty){
            this.setState({pulledFromCounty: false})
        }
        return this.props.falcor.get(
            ['content', 'byId', [contentId], COLS],
            ['content', 'byId', [countyContentId], COLS],
        ).then(contentRes => {
            let contentBody = get(contentRes, ['json', 'content', 'byId', contentId,'body'], null);
            let countyContentBody = get(contentRes, ['json', 'content', 'byId', countyContentId,'body'], null);
            // countyContentBody = convertFromRaw(JSON.parse(countyContentBody))
            if (contentBody && !emptyBody.includes(contentBody.trim())) {
                let status = get(contentRes.json.content.byId[contentId], `attributes.status`, '');
                this.setState(
                    {'currentKey': contentId,
                        contentFromDB: this.isJsonString(contentBody) ?
                            EditorState.createWithContent(convertFromRaw(JSON.parse(contentBody)), decorator) : contentBody,
                        simpleText: !this.isJsonString(contentBody),
                        status: status, statusFromDb: status
                })
                // return contentRes.json.content.byId[contentId].body
            }/*else if (this.props.pullCounty && countyContentBody && !emptyBody.includes(countyContentBody.trim())){
                let status = get(contentRes.json.content.byId[countyContentId], `attributes.status`, '');
                this.setState({'currentKey': contentId,
                    pulledFromCounty: true,
                    contentFromDB: contentRes.json.content.byId[countyContentId].body,
                    status: status, statusFromDb: status})
                return contentRes.json.content.byId[countyContentId].body
            }*/else if(this.props.hideIfNull){
                this.setState({'currentKey': contentId, contentFromDB: null, simpleText: true, status: '', statusFromDb: ''})
            }else{
                this.setState({'currentKey': contentId, contentFromDB: this.props.nullMessage || null, simpleText: true, status: '', statusFromDb: ''})
            }
            if (countyContentBody){
                this.setState({
                    countyContentFromDB: this.isJsonString(countyContentBody) ?
                        EditorState.createWithContent(convertFromRaw(JSON.parse(countyContentBody)), decorator) :
                        countyContentBody,
                simpleText: !this.isJsonString(countyContentBody)})
            }
            return null
        })
    }
    handleSubmit(e) {
        e.preventDefault()
        if (!this.props.requirement || !this.props.user.activePlan || !this.props.user.activeCousubid) return null;
        let html = typeof this.state.contentFromDB === 'string' ? this.state.contentFromDB : JSON.stringify(convertToRaw(this.state.contentFromDB.getCurrentContent()));
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
                        <option key={2} value={'Started'}>Started</option>
                        <option key={3} value={'Ready for review'}>Ready for review</option>
                        {/*{this.props.user.authLevel > 5 ?*/}
                        {/*    <React.Fragment>*/}
                        {/*        <option key={4} value={'Requirement not met'}>Requirement not met</option>*/}
                        {/*        <option key={5} value={'Requirement met'}>Requirement met</option>*/}
                        {/*    </React.Fragment> : null*/}
                        {/*}*/}
                    </select>
                    <a className='hoverable left quarterWidth btn btn-primary step-trigger-btn'
                       onClick={this.handleSubmit}
                    >Submit</a>
                </DIV>
            </React.Fragment>
        )
    }

    renderCallout(){
        return (
            <React.Fragment>
                <DIV className='col-12' style={{marginTop: '50px', paddingRight: '0', display:'flex'}}>
                    <label className='selectLabel'> </label>
                </DIV>
            </React.Fragment>
        )
    }
    renderContent(renderCounty = false){
        let editorState =
            renderCounty ? this.state.countyContentFromDB :
                this.state.contentFromDB ? this.state.contentFromDB : null

        if (typeof editorState === "string"){
            const contentBlock = htmlToDraft(editorState);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                editorState = EditorState.createWithContent(contentState, decorator);
            }
        }
        return (
        editorState ?
            <Editor
                spellCheck={true}
                editorState={editorState}
                plugins={plugins}
                toolbarClassName="toolbar"
                wrapperClassName="wrapper"
                editorClassName={this.props.requirement.includes('callout') ? 'editorSmall' : 'editor'}
                readOnly={ true }
            /> :
            this.props.requirement.includes('callout') ? null : '')

    }
    render() {
        let {editorState} = this.state;

        return (
            //this.props.type === 'contentEditor' ? (
                <React.Fragment>
                    {this.props.showCMSFlagNotes ?
                        this.state.pulledFromCounty ?
                        <i className='text-muted'> The content in this element is pulled from the county because  no unique jurisdictional context was required. </i> :
                        <i className='text-muted'> Content in this element is unique to the selected jurisdiction. </i>
                        : null
                    }

                        {/*{*/}
                        {/*    this.props.showCMSFlagNotesPublic ?*/}
                        {/*        this.state.pulledFromCounty ? null :*/}
                        {/*        <i className='text-muted'> This content is unique to the selected jurisdiction. </i> : null*/}
                        {/*}*/}

                    {this.props.showStatusTracker && this.props.requirement.slice(-7) !== 'callout' ? this.renderStatusTracker() :
                        this.props.requirement.slice(-7) === 'callout' ? this.renderCallout() : null
                    }
                    {
                        !this.props.hideCounty || get(this.props.activeCousubid, ['length'], 0) === 5 ?
                            <CONTENTDIV>
                                {this.renderContent(true)}
                            </CONTENTDIV> : null
                    }
                    {
                        !this.props.hideJurisdictionAnnex && get(this.props.activeCousubid, ['length'], 0) > 5 && this.state.contentFromDB ?
                            <ElementBox style={{backgroundColor: 'aliceblue'}}>
                                <ANNEX_DIV> {functions.formatName(get(this.props.allGeo, [this.props.user.activeCousubid]), this.props.user.activeCousubid)} Jurisdictional Annex</ANNEX_DIV>
                                {this.renderContent()}
                            </ElementBox> : null
                    }
                </React.Fragment>
            //) : ''
        )
    }
}
const LoadingOptions = {
    position: "absolute",
    className: "rounded"
}
const mapDispatchToProps = {sendSystemMessage};

const mapStateToProps = (state, ownProps) => {
    return {
        isAuthenticated: !!state.user.authed,
        geoGraph: state.graph,
        activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid,
        allGeo: state.geo.allGeos,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(imgLoader(showLoading(ContentViewer, LoadingOptions))))
