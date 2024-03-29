import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import get from 'lodash.get'
import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';

import createAlignmentPlugin from '@draft-js-plugins/alignment';

import createFocusPlugin from '@draft-js-plugins/focus';

import createResizeablePlugin from '@draft-js-plugins/resizeable';

import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';

import createDragNDropUploadPlugin from '@draft-js-plugins/drag-n-drop-upload';

import { RichUtils, AtomicBlockUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {
    ContentState,
    EditorState,
    CompositeDecorator,
    convertToRaw,
    convertFromRaw
} from 'draft-js';
import { useTheme, imgLoader, showLoading } from "@availabs/avl-components"
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {sendSystemMessage} from 'store/modules/messages';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './contentEditor.css'
import styled from "styled-components";

import addLinkPlugin from './addLink'
import makeButtonPlugin from './buttons';
import makeToolbarPlugin from "./toolbar"
import makeImagePlugin from "./image"
import makeSuperSubScriptPlugin from "./super-sub-script"
import makePositionablePlugin from "./positionable"
import makeStuffPlugin from "./stuff"
import makeResizablePlugin from "./resizable"

const COLS = ['content_id', 'attributes', 'body', 'created_at', 'updated_at'];
const DIV = styled.div`
    * {
        ${props => props.theme.scrollBar}
    }
    .public-DraftStyleDefault-orderedListItem:before{content:counter(ol0) ". ";counter-increment:ol0}
.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth1:before{content:counter(ol1,lower-alpha) ". ";counter-increment:ol1}
.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth2:before{content:counter(ol2,lower-roman) ". ";counter-increment:ol2}
.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth3:before{content:counter(ol3) ". ";counter-increment:ol3}
.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth4:before{content:counter(ol4,lower-alpha) ". ";counter-increment:ol4}
`
const buttonPlugin = makeButtonPlugin(),
    { BlockQuoteButton,
        CodeBlockButton,
        HeaderOneButton,
        HeaderTwoButton,
        HeaderThreeButton,
        HeaderFourButton,
        HeaderFiveButton,
        HeaderSixButton,
        OrderedListButton,
        UnorderedListButton,
        BoldButton,
        CodeButton,
        ItalicButton,
        StrikeThroughButton,
        SubScriptButton,
        SuperScriptButton,
        UnderlineButton,
        LeftAlignButton,
        CenterAlignButton,
        JustifyAlignButton,
        RightAlignButton,
        TextIndentButton,
        TextOutdentButton
    } = buttonPlugin;

const toolbarPlugin = makeToolbarPlugin(),
    { Toolbar, Separator } = toolbarPlugin;

const positionablePlugin = makePositionablePlugin(),
    resizablePlugin = makeResizablePlugin();

// const imagePlugin =
//         makeImagePlugin({
//         wrappers: [
//             positionablePlugin.wrapper,
//             resizablePlugin.wrapper
//         ]
//     }),
//     { addImage } = imagePlugin;
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
    resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator
);

const imagePlugin = createImagePlugin({ decorator });

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
    handleUpload: (editorState, base64) => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'image',
            'IMMUTABLE',
            { src: base64 },
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
            editorState,
            { currentContent: contentStateWithEntity },
        );
        return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
    },
    addImage: imagePlugin.addImage,
});

const plugins = [
    dragNDropFileUploadPlugin,
    blockDndPlugin,
    focusPlugin,
    alignmentPlugin,
    resizeablePlugin,
    imagePlugin,
    positionablePlugin,
    resizablePlugin,

    buttonPlugin,
    toolbarPlugin,
    addLinkPlugin,
    makeSuperSubScriptPlugin(),

    makeStuffPlugin(),
];

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
        // this.handleDroppedFiles = this.handleDroppedFiles.bind(this)

    }
    getCurrentKey = () =>
        this.props.scope === 'global' ?
        this.props.requirement :
        this.props.requirement + '-' + this.props.user.activePlan + '-' + this.props.user.activeCousubid
    isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
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
                    let editorState = this.isJsonString(content) ? EditorState.createWithContent(convertFromRaw(JSON.parse(content))) : content;
                    this.setState({'editorState': editorState, status: status, statusFromDb: status})
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
        let html = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
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

    // handleDroppedFiles(selection, files, { getEditorState }) {
    //     if (this.props.disabled || !files.length) return "not-handled";
    //
    //     const file = files[0];
    //
    //     if (!/^image[/]/.test(file.type)) {
    //         return "not-handled";
    //     }
    //
    //     this.props.uploadImage(file)
    //         .then(({ filename, url }) => {
    //             // const newES = addImage(url, getEditorState());
    //             // const editorState = this.state.editorState;
    //             // const content = editorState.getCurrentContent();
    //             // const contentWithEntity = content.createEntity("IMAGE", "MUTABLE", {
    //             //             src: url
    //             //         });
    //             // const newEditorState = EditorState.push(
    //             //             editorState,
    //             //             contentWithEntity,
    //             //             "create-entity"
    //             //         );
    //             // const entityKey = contentWithEntity.getLastCreatedEntityKey();
    //
    //             this.onEditorStateChange(addImage(url, getEditorState()));
    //             // this.onEditorStateChange(newCS);
    //
    //
    //             // this.handleChange(addImage(getEditorState(), url));
    //         });
    //     return "handled";
    // }
    onChange = editorState => {
        this.setState({
            editorState
        });
    };
    onAddLink = () => {
        const editorState = this.state.editorState;
        const selection = editorState.getSelection();
        const link = window.prompt("link:");
        if (!link) {
            this.onChange(RichUtils.toggleLink(editorState, selection, null));
            return "handled";
        }
        const content = editorState.getCurrentContent();
        const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
            url: link
        });
        const newEditorState = EditorState.push(
            editorState,
            contentWithEntity,
            "create-entity"
        );
        const entityKey = contentWithEntity.getLastCreatedEntityKey();
        this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey));
        return "handled";
    };

    loadEditor(editorState){
        if (typeof editorState === "string"){
            const contentBlock = htmlToDraft(editorState);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                editorState = EditorState.createWithContent(contentState);
            }
        }
        return (
            <div>
                <EditorWrapper>

                    <Editor
                        spellCheck={true}
                        editorState={editorState}
                        // handleDroppedFiles={ this.handleDroppedFiles }
                        plugins={ plugins }
                        toolbarClassName="toolbar"
                        wrapperClassName="wrapper"
                        editorClassName={this.props.requirement.includes('callout') ? 'editorSmall' : 'editor'}
                        onChange={this.onEditorStateChange}
                    />

                    <Toolbar>
                        <BoldButton />
                        <ItalicButton />
                        <StrikeThroughButton />
                        <UnderlineButton />
                        <SubScriptButton />
                        <SuperScriptButton />
                        <CodeButton />

                        <HeaderOneButton />
                        <HeaderTwoButton />
                        <HeaderThreeButton />
                        <HeaderFourButton />
                        <HeaderFiveButton />
                        <HeaderSixButton />

                        <BlockQuoteButton />
                        <CodeBlockButton />
                        <OrderedListButton />
                        <UnorderedListButton />

                        <LeftAlignButton />
                        <CenterAlignButton />
                        <JustifyAlignButton />
                        <RightAlignButton />

                        <TextOutdentButton />
                        <TextIndentButton />
                        <button id="link_url" onClick={this.onAddLink} className="add-link">
                            <i className="fa fa-link"></i>
                        </button>
                    </Toolbar>
                    { this.props.children }

                </EditorWrapper>
                <div className='row' style={{display: 'flex', justifyContent: 'flex-end', marginTop: '5px', marginRight: '1px'}}>
                    {
                        this.props.requirement.slice(-7) !== 'callout' ?
                            <React.Fragment>
                                <div style={{width: 'fit-content'}}>
                                    <label className='selectLabel'>Status: </label>
                                    <select
                                        className='dropdownSelect hoverable btn btn-outline-primary btn-primary step-trigger-btn'
                                        id={'status'}
                                        value={this.state.status}
                                        onChange={(e)=> this.setState({status: e.target.value})}
                                    >
                                        <option key={0} value={''}> </option>
                                        <option key={1} value={'Started'}>Started</option>
                                        <option key={2} value={'Ready for review'}>Ready for review</option>
                                    </select>
                                </div>
                            </React.Fragment> : null
                    }
                    <a className='hoverable btn btn-primary step-trigger-btn'
                       onClick={this.handleSubmit}
                    >Submit</a>
                </div>
            </div>
        )
    }
    render() {
        let currentKey = this.getCurrentKey();

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

const LoadingOptions = {
    position: "absolute",
    className: "rounded"
}
const EditorWrapper = ({ children, hasFocus, id, ...props }) => {
    const theme = useTheme();
    return (
        <div className={ `pt-16 relative rounded draft-js-editor
      ${ theme.inputBg.replace("cursor-pointer", "cursor-auto") } w-full
      ${ hasFocus ? theme.inputBorderFocus : theme.inputBorder }
    ` } { ...props }>
            { children }
        </div>
    )
}
const mapDispatchToProps = {sendSystemMessage};

const mapStateToProps = state => {
    return {
        isAuthenticated: !!state.user.authed,
        geoGraph: state.graph.content || {},
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(imgLoader(showLoading(ContentEditor, LoadingOptions))))
