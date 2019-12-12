import React from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'

import SideInfoProjectBox from "../../../auth/Historic/components/SideInfoProjectBox"

class MunicipalityStats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.geoid
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.geoid !== this.props.geoid){
            this.setState({geoid: this.props.geoid})
            this.fetchFalcorDeps(this.props.geoid)
        }
    }

    fetchFalcorDeps(geoid = this.state.geoid) {
        return this.props.falcor.get(
            ['geo', geoid, [2016], ['population']],
            ['geo', geoid, 'cousubs']
        ).then(d => {
            return d
        })
    }
    processData() {
        let data = [];
        try {
                data = [
                {
                    label: "County Population (2016)",
                    value: this.props.geoGraph[this.state.geoid][2016].population.toLocaleString()
                },
                {
                    label: "Number of County Subdivisions",
                    value: this.props.geoGraph[this.state.geoid].cousubs.value.length
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