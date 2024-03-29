import React, {Component} from 'react';
import get from 'lodash.get'
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'
import styled from 'styled-components'
import {authProjects} from "store/modules/user";
import TableSelector from "components/light-admin/tables/tableSelector"

const DIV = styled.div`
${props => props.theme.panelDropdownScrollBar};
`;
const ATTRIBUTES = [
    'shelter_id',
    // 'address',
    'shelter_name',
    'evacuation_capacity',
    'post_impact_capacity',
    'ada_compliant',
    'wheelchair_accessible',
    'generator_onsite',
    'self_suffienct_electricty',
]

class inventoryTableViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.activeGeoid,
        };
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(
            ['shelters', 'byGeoId', this.state.geoid, 'length']
        ).then(length => this.props.falcor.get(['shelters', 'byGeoId', this.state.geoid, 'byIndex',
            {from: 0, to: get(length, `json.shelters.byGeoId.${this.state.geoid}.length`, 0)}, ATTRIBUTES])
        )
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activeCousubid !== this.props.activeCousubid || prevState.geoid !== this.state.geoid) {
            this.setState({geoid: this.props.activeCousubid !== "undefined" ? this.props.activeCousubid : this.props.activeGeoid})
            this.fetchFalcorDeps()
        }
    }

    processData() {
        let shelters = get(this.props.shelters, `byId`, {});
        let data = Object.keys(shelters)
                .filter(shelterId =>
                    Object.values(get(this.props, `sheltersByIndex`, {})).map(s => get(s, ['value', 2], null))
                        .includes(parseInt(shelterId)))
                .map(shelterId => {
                    return Object.keys(get(shelters, `[${shelterId}]`, {}))
                        .reduce((a, c) => {
                            if (get(shelters[shelterId], [c], '') !== null) {
                                a[c] = get(shelters[shelterId], [c], '').toString();
                            } else {
                                a[c] = get(shelters[shelterId], [c], '');
                            }
                            return a;
                        }, {})
                })
                .sort((a, b) =>
                    this.props.defaultSortCol ?
                        (this.props.defaultSortOrder === 'desc' ? -1 : 1)*(typeof a[this.props.defaultSortCol] === "string" ?
                        a[this.props.defaultSortCol].localeCompare(b[this.props.defaultSortCol]) :
                        b[this.props.defaultSortCol] - a[this.props.defaultSortCol]) :
                        1),
            columns = Object.keys(get(data, `[0]`, {}))
                .filter(key => key !== 'shelter_id')
                .map(key => (
                    {
                        Header: key,
                        accessor: key,
                        sort: true
                    }))
                .reduce((a,c, cI, src) => {
                    if (this.props.colOrder){
                        a.push(src.filter(s => s.Header === this.props.colOrder[cI]).pop())
                    }else{
                        a.push(c)
                    }
                    return a;
                }, [])
        return {data, columns}
    }

    render() {
        return (
            get(this.props.shelters, `byId`, null) ?
                <TableSelector
                    {...this.processData()}
                    flex={this.props.flex ? this.props.flex : false}
                    height={this.props.minHeight ? this.props.minHeight : ''}
                    width={this.props.width ? this.props.width : '100%'}
                    tableClass={this.props.tableClass ? this.props.tableClass : null}
                    actions={
                        this.props.edit ?
                            {edit: true, view: true, delete: true} : null
                    }
                /> : null
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        activeGeoid: state.user.activeGeoid,
        activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid,
        graph: state.graph,
        shelters: state.graph.shelters,
        sheltersByIndex: get(state.graph,
            ['shelters', 'byGeoId', state.user.activeCousubid !== "undefined" ? state.user.activeCousubid : state.user.activeGeoid, 'byIndex'],
            {}),
    }
};
const mapDispatchToProps = ({authProjects});
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(inventoryTableViewer))