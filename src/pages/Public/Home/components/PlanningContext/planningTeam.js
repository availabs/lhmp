import React, {Component, Fragment} from 'react';
// import { Link } from 'react-router-dom'
import {reduxFalcor} from 'utils/redux-falcor'
import {connect} from "react-redux";
import get from "lodash.get"
import {
    ContentHeader,
    Feature,
    FeatureDescription,
    FeatureName,
    PageContainer,
    VerticalAlign
} from 'pages/Public/theme/components'
import styled from "styled-components";
const COLS = [
    "id",
    "contact_name",
    "contact_email",
    "contact_phone",
    "contact_address",
    "contact_title_role",
    "contact_department",
    "contact_agency",
    "contact_municipality",
    "contact_county",
    "associated_plan"
];
const DIV = styled.div`
${props => props.theme.scrollBar}
overflow: auto;
`
class PlanningTeam extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {}

        this.isMatch = this.isMatch.bind(this)
    }
    isMatch(matchee, matcher) {
        matchee = matchee && typeof matchee === "string" && matchee.includes('[') ?
            matchee.replace('[', '').replace(']', '').split(',') : matchee;
        return (!matchee || !matcher) ? false :
            typeof matchee === 'string' ?
                matchee.toString().toLowerCase() === matcher.toString().toLowerCase() :
                matchee.map(m => m.toString().toLowerCase()).includes(matcher.toString().toLowerCase())
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.activeCousubid !== this.props.activeCousubid){
            this.fetchFalcorDeps()
        }
    }

    fetchFalcorDeps() {
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();

        return this.props.falcor.get(
            ['forms', 'roles', 'byPlanId', this.props.activePlan, 'length'],
            ['rolesmeta', 'roles', ['field']],
            ['geo', parseInt(this.props.activeCousubid), 'name']
        ).then(response => {
            let length = response.json.forms['roles'].byPlanId[this.props.activePlan].length;
            if (length > 0) {
                return this.props.falcor.get(['forms', 'roles', 'byPlanId', this.props.activePlan, 'byIndex', [{
                    from: 0,
                    to: length - 1
                }], ...COLS])
            }
        })
            .then(response => {
                response = get(response,
                    ['json', 'forms', 'roles', 'byPlanId', this.props.activePlan, 'byIndex'], {})
                this.setState({
                    data:
                        Object.keys(response)
                            .filter(f => {
                                    return f !== '$__path' && response[f].attributes.is_hazard_mitigation_representative === 'yes' &&
                                        (
                                            get(this.props, `activeCousubid`, '').length > 5 &&
                                            response[f].attributes.contact_municipality && response[f].attributes.contact_municipality !== '[]' ?
                                                this.isMatch(response[f].attributes.contact_municipality, this.props.activeCousubid) :
                                                get(this.props, `activeCousubid`, '').length === 5 &&
                                                response[f].attributes.contact_county && response[f].attributes.contact_county !== '[]' &&
                                                (!response[f].attributes.contact_municipality || response[f].attributes.contact_municipality === '[]') ?
                                                    this.isMatch(response[f].attributes.contact_county, this.props.activeGeoid) : false
                                        )
                                }
                            )
                            .reduce((a, c) => [...a, response[c]], [])
                })
            })

    }

    renderMainTable() {
        let roles = get(this.state, `data`, []).map(f => f.attributes)

        return roles.map((data, i) => {
            return (
                <Feature className={`col-sm-4 no-gutters`} highlight={true} style={{margin: 20}}>
                    <FeatureDescription>
                        <FeatureName>Mitigation Planner</FeatureName>
                        <div className='table-responsive'>
                            <table className="table">
                                <tbody style={{fontSize: '1.5em'}}>
                                <Fragment key={i}>
                                    <tr>
                                        <td colSpan='2'>{get(data, `contact_name`, 'no name')}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {
                                                get(data, `contact_title_role`, 'no title').indexOf('[') >= 0 ?
                                                get(data, `contact_title_role`, 'no title').slice(1,-1) :
                                                get(data, `contact_title_role`, 'no title')
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{get(data, `contact_agency`, 'no agency')}</td>
                                        <td>{get(data, `contact_department`, 'no Department')}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan='2'>{get(this.props.graph, `geo[${parseInt(this.props.activeCousubid)}].name`, '')}</td>

                                    </tr>
                                </Fragment>
                                </tbody>
                            </table>
                        </div>
                    </FeatureDescription>
                </Feature>
            )
        })


    }

    render() {
        return (
            <PageContainer style={{height: '80vh'}}>
                <div className='row'>
                    <div className='col-12' style={{textAlign: 'center'}}>
                        <ContentHeader>
                            {
                                `${get(this.props.graph, `geo[${parseInt(this.props.activeCousubid)}].name`, '')} Hazard Mitigation Representative`
                            }
                        </ContentHeader>
                    </div>
                </div>
                <VerticalAlign>
                    <DIV className='d-flex justify-content-center'>

                        {this.renderMainTable()}

                    </DIV>
                </VerticalAlign>

            </PageContainer>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        activePlan: get(state, `user.activePlan`, null),
        activeCousubid: get(state, `user.activeCousubid`, null),
        activeGeoid: get(state, `user.activeGeoid`, null),
        roles: get(state, `graph.forms.roles`, {}),
        rolesMeta: get(state, `graph.rolesMeta`, {}),
        graph: state.graph,
        router: state.router
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(PlanningTeam))