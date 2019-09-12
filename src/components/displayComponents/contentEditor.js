import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import {Editor} from 'react-draft-wysiwyg';
import {ContentState, convertToRaw, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {sendSystemMessage} from 'store/modules/messages';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './contentEditor.css'

const COLS = ['content_id', 'attributes', 'body', 'created_at', 'updated_at'];

class ContentEditor extends Component {
    constructor(props) {
        super(props);
        let contentId = this.props.requirement + '-' + this.props.user.activePlan + '-' + this.props.user.activeGeoid;
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

    }

    fetchFalcorDeps() {
        console.log('FFD',this.props.requirement, this.props.user.activePlan, this.props.user.activeGeoid)
        if (!this.props.requirement || !this.props.user.activePlan || !this.props.user.activeGeoid) return Promise.resolve();
        let contentId = this.props.requirement + '-' + this.props.user.activePlan + '-' + this.props.user.activeGeoid;
        return this.props.falcor.get(
            ['content', 'byId', [contentId], COLS]
        ).then(contentRes => {
            if (contentRes.json.content.byId[contentId]) {
                console.log('setting everything',contentRes.json.content.byId[contentId])
                this.setState({contentFromDB: contentRes.json.content.byId[contentId].body})
                this.setState({'currentKey': contentId});

                let content = contentRes.json.content.byId[contentId].body;
                if (content) {
                    console.log('new content', content)
                    const contentBlock = htmlToDraft(content);
                    if (contentBlock) {
                        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                        let editorState = EditorState.createWithContent(contentState);
                        this.setState({'editorState': editorState})
                    }
                }
            }else{
                console.log('in else: no content from db for id ', contentId, contentRes)
                this.setState({'editorState': EditorState.createEmpty()})
                this.setState({contentFromDB: null})
                this.setState({'currentKey': contentId});
            }
            return contentRes
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdate');
        if (this.state.currentKey !== this.props.requirement + '-' + this.props.user.activePlan + '-' + this.props.user.activeGeoid){
            this.fetchFalcorDeps();
        }
    }

    onEditorStateChange(editorState) {
        this.setState({
            editorState,
        });
    };

    handleSubmit() {
        if (!this.props.requirement || !this.props.user.activePlan || !this.props.user.activeGeoid) return null;
        let html = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
        let contentId = this.props.requirement + '-' + this.props.user.activePlan + '-' + this.props.user.activeGeoid;
        if (html !== this.state.contentFromDB) {
            if (this.state.contentFromDB) {
                // update
                let args = {'content_id': `${contentId}`, 'attributes': '{}', 'body': `${html}`};
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
                    ['content', 'insert'], [contentId, '{}', html], [], []
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
            <div>
                <Editor
                    editorState={editorState}
                    toolbarClassName="toolbar"
                    wrapperClassName="wrapper"
                    editorClassName="editor"
                    onEditorStateChange={this.onEditorStateChange}
                />
                <a className='hoverable btn btn-primary step-trigger-btn'
                   href='#'
                   onClick={this.handleSubmit}
                >Submit</a>
            </div>
        )
    }
    render() {
        let currentKey = this.props.requirement + '-' + this.props.user.activePlan + '-' + this.props.user.activeGeoid;

        console.log('contentEditor Render', this.state.currentKey, currentKey, (this.state.currentKey === currentKey));

        let editorState;
        if (this.state.currentKey !== currentKey){
            console.log('calling FFD from render');
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
    console.log('content', state.graph.content);
    return {
        isAuthenticated: !!state.user.authed,
        geoGraph: state.graph.content || {},
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ContentEditor))
