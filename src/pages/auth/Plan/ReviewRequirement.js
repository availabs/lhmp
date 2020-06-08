import React from 'react';
import moment from "moment";
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {setActiveCousubid} from 'store/modules/user'
import config from "./config/review-config";
import commentsConfig from "./config/comments-config";
import megaConfig from "./config/megaConfig"
import Element from "../../../components/light-admin/containers/Element";
import ElementBox from "../../../components/light-admin/containers/ElementBox";
import styled from "styled-components";
import {RenderConfig} from "../../Public/theme/ElementFactory";
import {sendSystemMessage} from 'store/modules/messages';
import AvlFormsNewData from 'components/AvlForms/editComponents/newData.js'
import get from "lodash.get";
import AvlFormsViewData from "../../../components/AvlForms/displayComponents/viewData";

const format_with_time = {
    sameDay: 'YYYY-MM-DD HH:mm:ss',
    nextDay: 'YYYY-MM-DD HH:mm:ss',
    nextWeek: 'YYYY-MM-DD HH:mm:ss',
    lastDay: 'YYYY-MM-DD HH:mm:ss',
    lastWeek: 'YYYY-MM-DD HH:mm:ss',
    sameElse: 'YYYY-MM-DD HH:mm:ss'
};

const DIV = styled.div`
${(props) => props.theme.scrollBar};
overflow: auto;
width: 100%;
height: 50%;
`
class ReviewRequirement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            geoData: [],
            form_ids: []
        }
        this.renderComments = this.renderComments.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
    }

    fetchFalcorDeps() {
        if (!this.props.activeGeoid) return Promise.resolve();
        let formType = commentsConfig[0].type,
            formAttributes = Object.keys(get(commentsConfig, `[0].attributes`, {})),
            ids = [];

        return this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'length'])
            .then(response => {
                let length = response.json.forms[formType].byPlanId[this.props.activePlan].length;
                if (length) {
                    this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'byIndex', [{
                        from: 0,
                        to: length - 1
                    }], ...formAttributes])
                        .then(response => {
                            let graph = response.json.forms[formType].byPlanId[this.props.activePlan].byIndex;
                            Object.keys(graph).filter(d => d !== '$__path').forEach(id => {
                                if (graph[id] &&
                                    get(graph[id], `attributes.element`, null) === this.props.match.params.req &&
                                    get(graph[id], `attributes.geoid`, null) === this.props.match.params.geo
                                ) {
                                    ids.push(graph[id])
                                }

                            })
                            ids = ids.sort((a,b) => a.id - b.id)
                            this.setState({
                                form_ids: ids
                            })
                            return response
                        })
                }
            })
    }

    deleteItem (e){
        e.persist()
        let id = e.target.id;
        this.props.sendSystemMessage(
            `Are you sure you want to delete this form with id "${ id }"?`,
            {
                onConfirm: () => this.props.falcor.call(['forms','remove'],[id])
                    .then(() => this.fetchFalcorDeps()),
                id: `delete-content-${ id }`,
                type: "danger",
                duration: 0
            }
        )
    }

    renderComments() {
        return this.state.form_ids.length ? (
            <div>
                <div>Comments</div>
                {this.state.form_ids.map((id,idI) =>
                    <React.Fragment>
                        {
                            get(this.state.form_ids[idI], `attributes.user`, null) === this.props.user.id ?
                                <div>
                                    <label>You:</label>
                                    <span style={{float: 'right'}}>
                                        <button id= {id.id} className="btn btn-sm btn-outline-danger"
                                                onClick={this.deleteItem}> Delete </button>
                                    </span>
                                </div> : null
                        }
                        <AvlFormsViewData
                            json = {commentsConfig}
                            id = {[id.id]}
                            showHeader={false}
                        />
                    </React.Fragment>
                    )}
            </div>
        ) : null
    }
    render() {
        let element = config.elements.filter(element => element.element === this.props.match.params.req).pop(),
            requirements = element ? element.requirements_from_software : null;
        if (!requirements) return null;
        return (
            <div className='container'>
                <Element>
                    <h4 className='element-header'>Review Requirement</h4>
                    {requirements.split(',').map(r => {
                        r = r.trim();
                        let fullElement = megaConfig.filter(mc => {
                            return mc.requirement === r
                        })[0]
                        return (
                            <ElementBox>
                                <RenderConfig
                                    config={{
                                        [r]:
                                            [{
                                                title: r,
                                                ...fullElement,
                                                requirement: r,
                                                geoId: this.props.match.params.geo,
                                                intent: element.intent,
                                            }]
                                    }
                                    }
                                    user={{...this.props.user, activeCousubid: this.props.match.params.geo}}
                                    showTitle={true}
                                    showEdit={true}
                                    showStatusTracker={true}
                                    showHeader={false}
                                    pureElement={true}
                                />
                            </ElementBox>
                        )
                    })}
                    <ElementBox>
                        {this.renderComments()}
                        <AvlFormsNewData
                            json={commentsConfig}
                            id={[]}
                            data = {{
                                user: this.props.user.id,
                                element: this.props.match.params.req,
                                geoid: this.props.match.params.geo,
                                created_at: moment().calendar(null,format_with_time),
                            }}
                        />
                    </ElementBox>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        activePlan: state.user.activePlan,
        user: state.user
    };
};

const mapDispatchToProps = {setActiveCousubid, sendSystemMessage};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/review_requirement/:req/:geo',
    exact: true,
    name: 'Plan Review',
    auth: true,
    authLevel: 5,
    mainNav: false,
    breadcrumbs: [
        {name: 'Review Requirement', path: '/plan_review/'},
        {param: 'req', path: '/review_requirement/'},
        {param: 'geo', path: '/review_requirement/req/'},
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-mini',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ReviewRequirement))
}];

