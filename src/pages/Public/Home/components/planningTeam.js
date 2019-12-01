import React, {Component, Fragment} from 'react';
// import { Link } from 'react-router-dom'
import {reduxFalcor} from 'utils/redux-falcor'
import {falcorGraph} from "store/falcorGraph";
import {connect} from "react-redux";
import get from "lodash.get"
import styled from "styled-components";

// const Section = styled.div

let backgroundCss = {
    //background: '#fafafa',
    backgroundSize: '100vw 100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    //marginTop: '50vh',
    zIndex: '6'
};
const FLEXBOX = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 25vw;
    height: 200px;
`;
const BOX = styled.div`
     color: rgb(239, 239, 239); 
     background: rgba(0, 0, 0, 0.7); 
     border-radius: 4px;
     overflow: auto;
     height: fit-content;
     width: 20vw;
     margin-left: 10px;
     margin-right: 10px;
     padding: 5px;
     ${props => props.theme.modalScrollBar}
`;

const LABEL = styled.div`
    color: rgb(239, 239, 239);
    display: block;
    font-size: 1rem;
    font-weight: 500;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 1px;
`;
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
const COLS_TO_DISPLAY = [
    "contact_name",
    "contact_title_role",
    "contact_agency",
    "contact_department",
    "contact_county",
    "contact_municipality"
];

class PlanningTeam extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            role_data: []
        };
    }

    fetchFalcorDeps() {
        let role_data = [];
        if (!this.props.activePlan) return Promise.resolve();
        return this.props.falcor.get(['geo', 36, 'counties'])
            .then(countyList => {
                return this.props.falcor.get(
                    ['geo', countyList.json.geo[36].counties, 'cousubs']
                ).then(allIds => {
                    let cosubIds = [];
                    Object.values(allIds.json.geo).map(val => {
                        if (val.cousubs) {
                            cosubIds.push(...val.cousubs)
                        }
                    });
                    return [...falcorGraph.getCache().geo[36].counties.value, ...cosubIds]
                })
            }).then(countyList => {
                this.props.falcor.get(
                    ['geo', countyList, ['name']],
                    ['roles', 'byId', [93], COLS],
                    ['rolesmeta', 'roles', ['field']]
                )
                    .then(response => {
                        Object.keys(response.json.roles.byId)
                            .filter(d => d !== '$__path'
                                && response.json.roles.byId[d].associated_plan === parseInt(this.props.activePlan))
                            .forEach(function (role, i) {
                                response.json.roles.byId['contact_title_role'] = falcorGraph.getCache().rolesmeta.roles;

                                // meta for role title
                                response.json.roles.byId[role]['contact_title_role'] =
                                    falcorGraph.getCache().rolesmeta.roles.field.value
                                        .filter(f => f.value === response.json.roles.byId[role]['contact_title_role'])[0] ?
                                        falcorGraph.getCache().rolesmeta.roles.field.value
                                            .filter(f => f.value === response.json.roles.byId[role]['contact_title_role'])[0].name : null;

                                // meta for role county and municipality(jurisdiction)
                                response.json.roles.byId[role]['contact_county'] =
                                    falcorGraph.getCache().geo[response.json.roles.byId[role]['contact_county']] ?
                                        falcorGraph.getCache().geo[response.json.roles.byId[role]['contact_county']].name : null;

                                response.json.roles.byId[role]['contact_municipality'] =
                                    falcorGraph.getCache().geo[response.json.roles.byId[role]['contact_municipality']] ?
                                        falcorGraph.getCache().geo[response.json.roles.byId[role]['contact_municipality']].name :
                                        response.json.roles.byId[role]['contact_municipality'];
                                role_data.push({
                                    'id': role,
                                    'data': Object.values(response.json.roles.byId[role])
                                })
                            });
                        this.setState({role_data: role_data});
                        return role_data
                    })

            })

    }

    renderMainTable() {
        let table_data = [];
        let attributes = COLS_TO_DISPLAY;
        let role = this.state.role_data;
        if (role && role.length > 0) {
            role = role[0];
            table_data.push(COLS_TO_DISPLAY
                .reduce((a, c) => {
                        a[c] = role.data[COLS.indexOf(c) + 1];
                        return a
                    }, {}
                )
            )
        }

        return table_data.length > 0 ? (
            <table className="table">
                <tbody>
                {table_data.map((data) => {
                    return (
                        <Fragment>
                            <tr>
                                <td>{get(data, `contact_name`, null)}</td>
                            </tr>
                            <tr>
                                <td>{get(data, `contact_title_role`, null)}</td>
                            </tr>
                            <tr>
                                <td>{get(data, `contact_agency`, null)}</td>
                                <td>{get(data, `contact_department`, null)}</td>
                            </tr>
                            <tr>
                                <td>{get(data, `contact_county`, null)}</td>
                                <td>{get(data, `contact_municipality`, null)}</td>
                            </tr>
                        </Fragment>
                    )
                })
                }
                </tbody>
            </table>
        ) : (
            <Fragment>
                <tr>
                    <td>Demo contact name</td>
                </tr>
                <tr>
                    <td>Demo role title</td>
                </tr>
                <tr>
                    <td>Demo agency</td>
                    <td>Demo Department</td>
                </tr>
                <tr>
                    <td>Demo county</td>
                    <td>Demo municipality</td>
                </tr>
            </Fragment>
        )
    }

    render() {
        return (
            <div style={{...backgroundCss, width: '100vw', height: '100vh'}}>
                <div style={{width: '25vw'}}>
                    <FLEXBOX className='flex-container'>
                        <BOX>
                            <LABEL>Mitigation Planner</LABEL>
                            <div className='table-responsive'>
                                {this.renderMainTable()}
                            </div>
                        </BOX>
                    </FLEXBOX>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        roles: get(state, `graph.roles`, null),
        activePlan: get(state, `user.activePlan`, null),
        activeCousubid: get(state, `user.activeCousubid`, null),
        router: state.router
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(PlanningTeam))