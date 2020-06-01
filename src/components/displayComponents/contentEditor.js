import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import get from 'lodash.get'
import {Editor} from 'react-draft-wysiwyg';
import {ContentState, convertToRaw, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {sendSystemMessage} from 'store/modules/messages';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './contentEditor.css'
import styled from "styled-components";

const COLS = ['content_id', 'attributes', 'body', 'created_at', 'updated_at'];
const DIV = styled.div`
    * {
        ${props => props.theme.scrollBar}
    }
`
class ContentEditor extends Component {
    constructor(props) {
        super(props);
        // each value to be an array of objects. each object to be key:value pair where key is curent key
        // while setting the state, first filter then assign new value / append new obj
        // while getting the state, filter by current content id
        this.state = {
            editorState: EditorState.createEmpty(),
            contentFromDB: null,
            currentKey: null
        };
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.loadEditor = this.loadEditor.bind(this)
        this.getCurrentKey = this.getCurrentKey.bind(this)

    }
    getCurrentKey = () =>
        this.props.scope === 'global' ?
        this.props.requirement :
        this.props.requirement + '-' + this.props.user.activePlan + '-' + this.props.user.activeCousubid

    fetchFalcorDeps() {
        if (!this.props.requirement || !this.props.user.activePlan || !this.props.user.activeCousubid) return Promise.resolve();
        let contentId = this.getCurrentKey();
        return this.props.falcor.get(
            ['content', 'byId', [contentId], COLS]
        ).then(contentRes => {
            if (contentRes.json.content.byId[contentId]) {
                this.setState({contentFromDB: contentRes.json.content.byId[contentId].body})
                this.setState({'currentKey': contentId});

                let content = contentRes.json.content.byId[contentId].body;
                let status = get(contentRes.json.content.byId[contentId], `attributes.status`, '');

                if (content) {
                    const contentBlock = htmlToDraft(content);
                    if (contentBlock) {
                        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                        let editorState = EditorState.createWithContent(contentState);
                        this.setState({'editorState': editorState, status: status, statusFromDb: status})
                    }
                }
            }else{
                this.setState({'editorState': EditorState.createEmpty(), status: '', statusFromDb: ''})
                this.setState({contentFromDB: null})
                this.setState({'currentKey': contentId});
            }
            return contentRes
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.currentKey !== this.getCurrentKey()){
            this.fetchFalcorDeps();
        }
    }

    onEditorStateChange(editorState) {
        this.setState({
            editorState,
        });
    };

    handleSubmit(e) {
        e.preventDefault()
        if (!this.props.requirement || !this.props.user.activePlan || !this.props.user.activeCousubid) return null;
        let html = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
        let contentId = this.getCurrentKey();
        let attributes = this.state.status ? '{"status": "' + this.state.status +'"}' : '{}';
        if (html !== this.state.contentFromDB || this.state.statusFromDb !== this.state.status) {
            if (this.state.contentFromDB) {
                // update
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
            } else {
                // insert
                this.props.falcor.call(
                    ['content', 'insert'], [contentId, attributes, html], [], []
                ).then(response => {
                    response.error ?
                        this.props.sendSystemMessage(`Error occurred. Please try again later.`, {type: "danger"}) :
                        this.props.sendSystemMessage(`Content successfully added.`, {type: "success"})
                    }
                )
            }
        }
    }

    loadEditor(editorState){
        return (
            <DIV>
                <Editor
                    editorState={editorState}
                    toolbarClassName="toolbar"
                    wrapperClassName="wrapper"
                    editorClassName={this.props.requirement.includes('callout') ? 'editorSmall' : 'editor'}
                    onEditorStateChange={this.onEditorStateChange}
                />
                <a className='hoverable btn btn-primary step-trigger-btn'
                   onClick={this.handleSubmit}
                >Submit</a>
                <div style={{width: 'fit-content', float: 'right'}}>
                    <label className='selectLabel'>Status: </label>
                    <select
                        className='dropdownSelect hoverable btn btn-outline-primary btn-primary step-trigger-btn'
                        id={'status'}
                        value={this.state.status}
                        onChange={(e)=> this.setState({status: e.target.value})}
                    >
                        <option key={0} value={''}></option>
                        <option key={1} value={'Started'}>Started</option>
                        <option key={2} value={'Ready for review'}>Ready for review</option>
                    </select>
                </div>
            </DIV>
        )
    }
    render() {
        let currentKey = this.getCurrentKey();
        console.log('props?', this.props)

        let editorState;
        if (this.state.currentKey !== currentKey){
            this.fetchFalcorDeps();
            return <div> Loading... </div>
        }else {
            editorState = this.state.editorState;
            return this.loadEditor(editorState)
        }
    }
}

const mapDispatchToProps = {sendSystemMessage};

const mapStateToProps = state => {
    return {
        isAuthenticated: !!state.user.authed,
        geoGraph: state.graph.content || {},
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ContentEditor))
