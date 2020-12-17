import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import get from 'lodash.get'
import Editor from '@draft-js-plugins/editor';
import { RichUtils } from 'draft-js';
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
import addLinkPlugin from './addLink'
import makeButtonPlugin from './buttons';
import makeToolbarPlugin from "./toolbar"
import makeImagePlugin from "./image"
import makeSuperSubScriptPlugin from "./super-sub-script"
import makePositionablePlugin from "./positionable"
import makeStuffPlugin from "./stuff"
import makeResizablePlugin from "./resizable"
import createLinkDecorator from "../../../displayComponents/contentEditor/linkDecorator";
import {is} from "immutable";

const decorator = createLinkDecorator();
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

const imagePlugin = makeImagePlugin({
        wrappers: [
            positionablePlugin.wrapper,
            resizablePlugin.wrapper
        ]
    }),
    { addImage } = imagePlugin;

const plugins = [
    buttonPlugin,
    toolbarPlugin,
    imagePlugin,
    addLinkPlugin,
    makeSuperSubScriptPlugin(),

    positionablePlugin,
    resizablePlugin,

    makeStuffPlugin()
];

class ContentEditor extends Component {
    constructor(props) {
        super(props);
        // each value to be an array of objects. each object to be key:value pair where key is curent key
        // while setting the state, first filter then assign new value / append new obj
        // while getting the state, filter by current content id
        this.state = {
            editorState: EditorState.createEmpty(decorator),
            contentFromDB: null,
        };
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.loadEditor = this.loadEditor.bind(this)
        this.handleDroppedFiles = this.handleDroppedFiles.bind(this)

    }

    isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    componentDidMount() {
        let content = this.props.state[this.props.title]
        console.log('isJson', content, this.props.state)
        if (!this.isJsonString(content) && typeof content === "string"){
            const contentBlock = htmlToDraft(content);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                content = EditorState.createWithContent(contentState, decorator);
            }
        }
        this.setState({
            contentFromDB: content,
            editorState:
                content ?
                    this.isJsonString(content) ? EditorState.createWithContent(convertFromRaw(JSON.parse(content)), decorator) : content
                    :  EditorState.createEmpty(decorator)
        })
    }

    onEditorStateChange(editorState) {
        if(this.props.handleChange){
            this.props.handleChange({
                target: {
                    id: this.props.title,
                    value: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
                }});
        }

        this.setState({
            editorState,
        });
    };

    handleDroppedFiles(selection, files, { getEditorState }) {
        if (this.props.disabled || !files.length) return "not-handled";

        const file = files[0];

        if (!/^image[/]/.test(file.type)) {
            return "not-handled";
        }

        this.props.uploadImage(file)
            .then(({ filename, url }) => {
                this.onEditorStateChange(addImage(url, getEditorState()));
                // this.handleChange(addImage(getEditorState(), url));
            });
        return "handled";
    }
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
        return (
            <div>
                <EditorWrapper>

                    <Editor
                        readOnly={this.props.viewOnly}
                        spellCheck={true}
                        editorState={editorState}
                        handleDroppedFiles={ this.handleDroppedFiles }
                        plugins={ plugins }
                        toolbarClassName="toolbar"
                        wrapperClassName="wrapper"
                        editorClassName={'editor'}
                        onChange={ this.onEditorStateChange }
                    />

                    {
                        !this.props.viewOnly ?
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
                            </Toolbar> : null
                    }
                    { this.props.children }

                </EditorWrapper>
            </div>
        )
    }
    render() {
        return this.loadEditor(this.state.editorState)
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
