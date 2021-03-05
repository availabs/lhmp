import React from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'
import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBoxHistoricPublic'
import {falcorChunkerNice} from "store/falcorGraph"

import {
    fnum
} from 'utils/sheldusUtils'

class CousubTotalLossTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.geoid,
            dataType: this.props.dataType
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.geoid !== this.props.geoid || prevProps.hazard !== this.props.hazard){
            this.setState({geoid: this.props.geoid})
            this.fetchFalcorDeps(this.props.dataType, this.props.geoid)
        }
    }

    fetchFalcorDeps( dataType, geoid ) {
        if(!geoid)geoid = this.props.geoid;
        if(!dataType)dataType = this.props.dataType;
        return this.props.falcor.get(
            ['riskIndex', 'hazards'],
            ['geo', geoid, 'cousubs']
        )
            .then(response => [response.json.riskIndex.hazards, response.json.geo[geoid].cousubs])
            .then(([hazards, geoids]) => {
                hazards = this.props.hazard ?
                    this.props.hazard :
                    this.props.hazards && this.props.hazards.length > 0 ?
                        this.props.hazards : hazards;
                return this.props.falcor.get(
                    ['geo', geoids, 'name'],
                    ['riskIndex', 'meta', hazards, 'name'],
                    [dataType, geoids, hazards, 'allTime', ['total_damage', 'fatalities']]
                )
                    .then(d => falcorChunkerNice(['geo', geoids, 'name']))
                    .then(d => falcorChunkerNice([dataType, geoids, hazards, 'allTime', ['total_damage', 'fatalities']]))
            })
    }

    processData({ dataType, geoid }=this.props) {
        let geoids = this.props.geoGraph[geoid].cousubs.value,
            data = {},
            columns = ["name", "total damage", "fatalities"];
        geoids.forEach(geoid => {
            const name = this.props.geoGraph[geoid].name;
            if (!(geoid in data)) {
                data[geoid] = { name, "total damage": 0, fatalities: 0, geoid:geoid };
            }
            const graph = this.props[dataType][geoid];
            for (const hazard in graph) {
                if (
                    (this.props.hazard && this.props.hazard === hazard) ||
                        (!this.props.hazard && this.props.hazards && this.props.hazards.length > 0 && this.props.hazards.includes(hazard))
                ){
                    const td = +graph[hazard].allTime.total_damage,
                        f = +graph[hazard].allTime.fatalities;
                    data[geoid]["total damage"] += td;
                    data[geoid]["fatalities"] += f;
                }
            }
        })
        data = Object.values(data);
        data.forEach(d => {
            d.sort = d["total damage"];
            d["total damage"] = fnum(d["total damage"]);
        })
        data.sort((a, b) => b.sort - a.sort)
        return { data, columns }
    }

    render() {
        try {
            let pData = this.processData();
            let linksToPass = {};
            linksToPass['name'] = pData.data;
            linksToPass['name'] =
                linksToPass['name'].map(link => {
                    let jurisdiction = link.geoid.length === 2 ? 'State' :
                        link.geoid.length === 5 ? 'County' :
                        link.geoid.length === 10 ? 'Town' :
                        link.geoid.length === 11 ? 'Tract' : '';
                    if (link.name.toLowerCase().includes(jurisdiction.toLowerCase())){
                        link.name = link.name.replace(jurisdiction.toLowerCase(), ' (' + jurisdiction + ')')
                    }else{
                        link.name  += ' (' + jurisdiction + ')';
                    }
                    return link
                });
            return (
                <TableBox { ...pData }
                          pageSize={ this.props.geoid && this.props.geoid.length > 2 ? pData.data.length : 10}
                          // links = {linksToPass}
                />
            )
        }
        catch (e) {
            return (
                <div>Loading...</div>
            )
        }
    }
}

CousubTotalLossTable.defaultProps = {
    dataType: "severeWeather",
    hazards: []
}

const mapStateToProps = state => ({
    riskIndex: state.graph.riskIndex,
    router: state.router,
    severeWeather: state.graph.severeWeather,
    geoGraph: state.graph.geo
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CousubTotalLossTable))