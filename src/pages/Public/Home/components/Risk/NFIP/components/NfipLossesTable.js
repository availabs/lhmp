import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { falcorChunkerNice } from "store/falcorGraph"
import store from "store"
import { fnum } from "utils/sheldusUtils"

import get from "lodash.get";

import TableBox from 'components/light-admin/tables/TableBox3'

class NfipTable extends React.Component {

    fetchFalcorDeps({ geoid, geoLevel }=this.props) {
        return this.props.falcor.get(
            ["geo", geoid, [geoLevel, 'name']],
        )
            .then(response => response.json.geo[geoid][geoLevel])
            .then(geoids => {
                return falcorChunkerNice(['nfip', 'losses', 'byGeoid', geoids, 'allTime', ['total_losses', 'closed_losses', 'open_losses', 'cwop_losses', 'total_payments']])
                    .then(() => falcorChunkerNice(['geo', geoids, 'name']))
            })
    }

    processData() {
        const { geoid, geoLevel } = this.props,
            label = geoLevel === 'counties' ? 'county' : 'county sub. div.',
            geoids = this.props.geoGraph[geoid][geoLevel].value,
            data = [];

        geoids.forEach(geoid => {
            const graph = this.props.nfip.losses.byGeoid[geoid].allTime,
                name = this.props.geoGraph[geoid].name;

            data.push({
                [label]: name,
                "total losses": graph.total_losses,
                "closed losses": graph.closed_losses,
                "open losses": graph.open_losses,
                "cwop losses": graph.cwop_losses,
                "total payments": graph.total_payments
            })
        })
        return {
            data: data.sort((a, b) => b["total payments"] - a["total payments"]),
            columns: [label, "total losses", "closed losses", "open losses", "cwop losses", "total payments"]
        };
    }

// //
    render() {
        try {
            return (
                <TableBox { ...this.processData() }
                          pageSize={ 100 }
                          tableScroll={true}
                          maxHeight={'60vh'}
                          showControls={false}
                          widths={['25%','15%','15%','15%','15%','15%','15%']}
                          columnFormats= { {
                              "total losses": ",d",
                              "closed losses": ",d",
                              "open losses": ",d",
                              "cwop losses": ",d",
                              "total payments": fnum
                          } }/>
            )
        }
        catch (e) {
            return <div>Loading...</div>;
        }
    }
}

// //
NfipTable.defaultProps = {
    geoid: '36',
    geoLevel: 'cousubs',
    title: "NFIP Losses"
}

const mapStateToProps = state => {
    return {
    router: state.router,
    geoGraph: state.graph.geo,
    nfip: state.graph.nfip,
    geoid: state.user.activeGeoid || '36'
    }}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NfipTable));
