import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import {Editor} from 'react-draft-wysiwyg';
import {ContentState, convertToRaw, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './contentEditor.css'

const COLS = ['content_id', 'attributes', 'body', 'created_at', 'updated_at'];

class ContentEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            contentFromDB: null
        };
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    fetchFalcorDeps() {
        if (!this.props.requirement || !this.props.user.activePlan || !this.props.user.activeGeoid) return Promise.resolve();
        let contentId = this.props.requirement + '-' + this.props.user.activePlan + '-' + this.props.user.activeGeoid;
        return this.props.falcor.get(
            ['content', 'byId', [contentId], COLS]
        ).then(contentRes => {
            console.log('content res', contentRes);
            if (contentRes.json.content.byId[contentId]) {
                this.setState({contentFromDB: contentRes.json.content.byId[contentId].body})
                return contentRes.json.content.byId[contentId].body
            }
            return null
        }).then( content => {
            if (content) {
                    const contentBlock = htmlToDraft(content);
                    if (contentBlock) {
                        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                        let editorState = EditorState.createWithContent(contentState);
                        this.setState({'editorState': editorState})
                    }
                }
            return content
        })
    }

    onEditorStateChange(editorState) {
        this.setState({
            editorState,
        });
    };

    handleSubmit() {
        // if this.state.contentFromDB === current content : do nothing
        // else if this.contentFromDB === null : insert?
        // else update
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
                    console.log('edit res', response)
                    response.error ?
                        this.props.sendSystemMessage(`Error occurred during editing. Please try again later.`, {type: "danger"}) :
                        this.props.sendSystemMessage(`Content successfully edited.`, {type: "success"});
                })
            } else {
                // insert
                this.props.falcor.call(
                    ['content', 'insert'], [contentId, '{}', html], [], []
                ).then(response => {
                    console.log('insert res', response)
                    response.error ?
                        this.props.sendSystemMessage(`Error occurred. Please try again later.`, {type: "danger"}) :
                        this.props.sendSystemMessage(`Content successfully added.`, {type: "success"})
                    }
                )
            }
        }
    }

    render() {
        let {editorState} = this.state;
        /*const contentFromDB = this.state.contentFromDB;  // get content data if available
        console.log('editor props',
            contentFromDB, draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
            contentFromDB === draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())));
        if (contentFromDB) {
            if (contentFromDB === draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())).toString()){
                const contentBlock = htmlToDraft(contentFromDB);
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    editorState = EditorState.createWithContent(contentState);
                }
            }

        }*/
        return (
            this.props.type === 'content' ? (
                <div>
                    <Editor
                        editorState={editorState}
                        toolbarClassName="toolbar"
                        wrapperClassName="wrapper"
                        editorClassName="editor"
                        onEditorStateChange={this.onEditorStateChange}
                    />
                    <a className='btn btn-primary step-trigger-btn'
                       href='#'
                       onClick={this.handleSubmit}
                       style={{width: '100%'}}
                    >Submit</a>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <Element>
                                <h6>Prompt</h6>
                                <div className='element-box'>
                                    {this.props.prompt}
                                </div>
                            </Element>
                        </div>
                        <div className='col-sm-6'>
                            <Element>
                                <h6>Intent</h6>
                                <div className='element-box'>
                                    {this.props.intent}
                                </div>
                            </Element>
                        </div>
                    </div>
                </div>

            ) : ''
        )
    }
}

const mapDispatchToProps = {sendSystemMessage};

const mapStateToProps = state => {
    return {
        isAuthenticated: !!state.user.authed,
        geoGraph: state.graph,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ContentEditor))
