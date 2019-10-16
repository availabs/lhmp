import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {convertFromHTML} from 'draft-js';
import Element from 'components/light-admin/containers/Element'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './contentEditor.css'

const COLS = ['content_id', 'attributes', 'body', 'created_at', 'updated_at'];

class ContentViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentFromDB: null
        };
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.activeCousubid !== this.props.activeCousubid){
            this.fetchFalcorDeps()
        }
    }

    fetchFalcorDeps() {
        if (!this.props.requirement || !this.props.user.activePlan || !this.props.activeCousubid) return Promise.resolve();
        let contentId = this.props.requirement + '-' + this.props.user.activePlan + '-' + this.props.activeCousubid;
        return this.props.falcor.get(
            ['content', 'byId', [contentId], COLS]
        ).then(contentRes => {
            console.log('from root', contentId,contentRes)
            if (contentRes.json.content.byId[contentId]) {
                this.setState({contentFromDB: contentRes.json.content.byId[contentId].body})
                return contentRes.json.content.byId[contentId].body
            }else{
                this.setState({contentFromDB: null})
            }
            return null
        })
    }

    render() {
        let {editorState} = this.state;
        return (
            //this.props.type === 'contentEditor' ? (
            <div>
                <div dangerouslySetInnerHTML={{ __html: this.state.contentFromDB ? this.state.contentFromDB : '<i>Content not available.</i>'}} />
            </div>

            //) : ''
        )
    }
}

const mapDispatchToProps = {};

const mapStateToProps = state => {
    return {
        isAuthenticated: !!state.user.authed,
        geoGraph: state.graph,
        activeCousubid: state.user.activeCousubid

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ContentViewer))
