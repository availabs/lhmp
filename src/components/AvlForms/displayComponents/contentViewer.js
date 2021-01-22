import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import _ from 'lodash'
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
import '../editComponents/contentEditor/contentEditor.css'
import get from "lodash.get";
import ElementBox from "../../light-admin/containers/ElementBox";
import makeButtonPlugin from '../editComponents/contentEditor/buttons';
import createLinkDecorator from '../editComponents/contentEditor/linkDecorator'
import makeImagePlugin from "../editComponents/contentEditor/image"
import makeLinkItPlugin from "../editComponents/contentEditor/linkify-it"
import makeSuperSubScriptPlugin from "../editComponents/contentEditor/super-sub-script"
import makePositionablePlugin from "../editComponents/contentEditor/positionable"
import makeStuffPlugin from "../editComponents/contentEditor/stuff"
import makeResizablePlugin from "../editComponents/contentEditor/resizable"
import functions from "pages/auth/Plan/functions";
import addLinkPlugin from "../editComponents/contentEditor/addLink";
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

    componentDidUpdate(prevProps) {
        if (!_.isEqual(prevProps.state[prevProps.title], this.props.state[this.props.title])){
            this.componentDidMount()
        }
    }

    renderContent(renderCounty = false){
        let editorState = this.state.editorState

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
                editorClassName={'editor'}
                readOnly={ true }
            /> : '')

    }
    render() {

        return this.renderContent()
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
