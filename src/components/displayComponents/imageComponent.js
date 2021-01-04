import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import get from 'lodash.get'
import {sendSystemMessage} from 'store/modules/messages';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './contentEditor/contentEditor.css'
import styled from "styled-components";
import ImageEditor from 'components/AvlForms/editComponents/imageComponent/index.js'
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
            contentFromDB: null,
            currentKey: null
        };
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getCurrentKey = this.getCurrentKey.bind(this)
        this.handleChange = this.handleChange.bind(this)

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
                let status = get(contentRes.json.content.byId[contentId], `attributes.status`, '');

                this.setState({
                    image: contentRes.json.content.byId[contentId].body,
                    contentFromDB: contentRes.json.content.byId[contentId].body,
                    'currentKey': contentId,
                    status: status,
                    statusFromDb: status
                })
            }else{
                this.setState({status: '', statusFromDb: '', contentFromDB: null, 'currentKey': contentId})
            }
            return contentRes
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.currentKey !== this.getCurrentKey()){
            this.fetchFalcorDeps();
        }
    }
    handleChange(e){
        this.setState({image: e.target.value})
    }
    handleSubmit(e) {
        e.preventDefault()
        if (!this.props.requirement || !this.props.user.activePlan || !this.props.user.activeCousubid) return null;

        let contentId = this.getCurrentKey();
        let attributes = this.state.status ? '{"status": "' + this.state.status +'"}' : '{}';
        if (this.state.image !== this.state.contentFromDB || this.state.statusFromDb !== this.state.status) {
            if (this.state.contentFromDB) {
                // update
                let args = {'content_id': `${contentId}`, 'attributes': attributes, 'body': `${this.state.image}`};
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
                    ['content', 'insert'], [contentId, attributes, this.state.image], [], []
                ).then(response => {
                    response.error ?
                        this.props.sendSystemMessage(`Error occurred. Please try again later.`, {type: "danger"}) :
                        this.props.sendSystemMessage(`Content successfully added.`, {type: "success"})
                    }
                )
            }
        }
    }


    render() {
        let currentKey = this.getCurrentKey();
        console.log('props?', this.props)

        let editorState;
        if (this.state.currentKey !== currentKey){
            this.fetchFalcorDeps();
            return <div> Loading... </div>
        }else {
            return (
                <React.Fragment>
                    <ImageEditor
                        {...this.props}
                        handleChange={this.handleChange}
                        prompt={() => {}}
                        state={this.state}
                        title={'image'}
                    />
                    <a className={
                        this.state.image ? 'hoverable btn btn-primary step-trigger-btn' :
                            'hoverable btn btn-primary step-trigger-btn disabled'}
                       onClick={this.handleSubmit}
                    >Submit</a>
                </React.Fragment>
            )

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
