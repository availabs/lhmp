import React from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'

import SideInfoProjectBox from "./SideInfoProjectBox"

class MunicipalityStats extends React.Component {

    fetchFalcorDeps({ geoid }=this.props) {
// `geo[{keys:geoids}][{keys:years}]['${ CENSUS_API_VARIABLE_NAMES.join(`', '`)}']`
        return this.props.falcor.get(
            ['geo', geoid, [2016], ['population']],
            ['geo', geoid, 'cousubs']
        ).then(d => {
            console.log('res',d);
            return d
        })
    }

    processData({ geoid }=this.props) {
        let data = [];
        console.log('got pop data', this.props.geoGraph[geoid])
        try {
            data = [
                {
                    label: "County Population (2016)",
                    value: this.props.geoGraph[geoid][2016].population.toLocaleString()
                },
                {
                    label: "Number of County Subdivisions",
                    value: this.props.geoGraph[geoid].cousubs.value.length
                }
            ]
        }
        catch (e) {
            data = [];
        }
        finally {
            return data;
        }
    }

    render() {
        const rows = this.processData();
        return (
            <SideInfoProjectBox rows={ rows }
                                title="Municipality Stats"/>
        )
    }
}

MunicipalityStats.defaultProps = {
}

const mapStateToProps = state => ({
    geoGraph: state.graph.geo || {},
    router: state.router
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(MunicipalityStats))