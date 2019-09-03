import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Editor} from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { convertFromRaw } from 'draft-js';
import Element from 'components/light-admin/containers/Element'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './contentEditor.css'

class ContentEditor extends Component {
    constructor(props) {
        super(props);
            this.state = {
                editorState: EditorState.createEmpty(),
                contentId: this.props.requirement + this.props.user.activePlan + this.props.user.activeGeoid
            };

        this.onEditorStateChange = this.onEditorStateChange.bind(this)

    }

    onEditorStateChange(editorState) {
        console.log('EditorChange',draftToHtml(convertToRaw(editorState.getCurrentContent())))
        this.setState({
                editorState,
        });
    };

    handleSubmit(){

    }
    render() {
        console.log('editor props', this.props);
        let { editorState } = this.state;
        const contentFromDB = '<p>Hey this <strong>editor</strong> rocks 😀</p>';  // get content data if available
        if (contentFromDB){
            const contentBlock = htmlToDraft(contentFromDB);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                editorState = EditorState.createWithContent(contentState);
            }
        }
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

const mapDispatchToProps = {};

const mapStateToProps = state => {
    return {
        isAuthenticated: !!state.user.authed,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentEditor)
