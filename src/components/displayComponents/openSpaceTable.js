import React, {Component} from 'react';
import _ from 'lodash'
import get from 'lodash.get'
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'
import styled from 'styled-components'
import {authProjects} from "store/modules/user";
import TableSelector from "components/light-admin/tables/tableSelector"
import {fnum} from 'utils/sheldusUtils'

const DIV = styled.div`
${props => props.theme.panelDropdownScrollBar};
`;
const ATTRIBUTES = [
    'prop_class',
    'total_av',
    'acres'
]

class inventoryTableViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.activeGeoid,
        };
    }

    fetchFalcorDeps() {
        this.setState({loading: true})
        console.log('in ffd')
        return this.props.falcor.get(
            ['parcel', 'byGeoid', this.state.geoid, 'length']
        ).then(length => {
            console.log('fetching data')
            length = get(length, ['json', 'parcel', 'byGeoid', this.state.geoid, 'length'], 0)
            length = 1000
            let requests = [],
                size = Math.min(length / 4, 7000);
            for (let i = 0; i < length + 1; i += size) {
                requests.push(['parcel', 'byGeoid', this.state.geoid, 'byIndex', {
                    from: i,
                    to: Math.min(i + size - 1, length)
                }, 'id'])
            }
            return requests.reduce((a, c, cI) => a.then(() => {
                return this.props.falcor.get(c)
                    .then(parcelIds => {
                        console.log('ci', cI)

                        parcelIds = Object.values(get(parcelIds, ['json', 'parcel', 'byGeoid', this.state.geoid, 'byIndex'], {}))
                            .filter(d => d)
                            .map(d => d.id)
                            .filter(d => d)
                        return this.props.falcor.get(['parcel', 'byId', parcelIds, ATTRIBUTES])
                    })
            }), Promise.resolve())
                .then(res => {
                    console.log('????????????????????')
                    this.setState({loading: false})
                })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activeCousubid !== this.props.activeCousubid || prevState.geoid !== this.state.geoid) {
            console.log('did update')
            this.setState({geoid: this.props.activeCousubid !== "undefined" ? this.props.activeCousubid : this.props.activeGeoid})
        }
    }

    processData() {
        let cols = ['Land Type', '# of parcels', 'Total Area', 'Total Value'],
            rows = [
                'Vacant Land',
                'Urban Renewal',
                'Public Use Open Space',
                'Flood Control',
                'Wild, Forested, Conservation lands and Public parks'
            ]
        console.log('processing...')
        let data = Object.values(this.props.parcelData)
            .filter(c => get(c, `prop_class`, null) &&
                (['350', '580', '581', '590', '591', '592', '593', '821'].includes(get(c, `prop_class`, null)) ||
                ['3', '9'].includes(get(c, `prop_class`, null).slice(0, 1)))
            )
            .reduce((a, c) => {
                let rowGroup = []
                if (get(c, `prop_class`, '').slice(0, 1) === '3') {
                    rowGroup.push('Vacant Land')
                }
                if (get(c, `prop_class`, '') === '350') {
                    rowGroup.push('Urban Renewal')
                }
                if (['580', '581', '590', '591', '592', '593'].includes(get(c, `prop_class`, ''))) {
                    rowGroup.push('Public Use Open Space')
                }
                if (['821'].includes(get(c, `prop_class`, ''))) {
                    rowGroup.push('Flood Control')
                }
                if (['9'].includes(get(c, `prop_class`, '').slice(0, 1))) {
                    rowGroup.push('Wild, Forested, Conservation lands and Public parks')
                }
                if (rowGroup.length) {
                    rowGroup.forEach(r => {
                        a[r] = {
                            'Land Type': r,
                            '# of parcels':
                                get(a, [r, '# of parcels'], null) ?
                                    get(a, [r, '# of parcels'], 0) + 1 :
                                    1,
                            'Total Area':
                                get(a, [r, 'Total Area'], null) ?
                                    get(a, [r, 'Total Area'], 0) + get(c, ['acres'], 0) :
                                    get(c, ['acres'], 0),
                            'Total Value':
                                get(a, [r, 'Total Value'], null) ?
                                    get(a, [r, 'Total Value'], 0) + get(c, ['total_av'], 0) :
                                    get(c, ['total_av'], 0)

                        }
                    })
                }
                return a
            }, rows.reduce((accRows, currRow) =>
                ({
                    ...accRows,
                    [currRow]: {
                        ...cols.reduce((accCols, currCol) => ({
                            ...accCols,
                            [currCol]: currCol === 'Land Type' ? currRow : 0
                        }), {})
                    }
                }), {}));
        console.log('came here')
        data = Object.keys(data).map(d => data[d])
        let columns = Object.keys(get(data, `[0]`, {}))
            .map(key => (
                {
                    Header: key,
                    accessor: key,
                    sort: true,
                    formatValue: key === 'Total Value' ? fnum :
                        key === 'Total Area' ? d => d.toFixed(2) : null
                }))
        return {data, columns}
    }

    render() {
        return (
            this.props.parcelData && !this.state.loading ?
                <TableSelector
                    {...this.processData()}
                    flex={this.props.flex ? this.props.flex : false}
                    height={this.props.height ? this.props.height : ''}
                    width={this.props.width ? this.props.width : '100%'}
                    tableClass={this.props.tableClass ? this.props.tableClass : null}
                /> :
                this.props.parcelData && this.state.loading ? 'Loading...' : null
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        activeGeoid: state.user.activeGeoid,
        activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid,
        graph: state.graph,
        parcelData: get(state.graph, `parcel.byId`),
    }
};
const mapDispatchToProps = ({authProjects});
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(inventoryTableViewer))
