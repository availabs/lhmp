import React, {Component} from 'react';
import AssetsFilteredTable from 'pages/auth/Assets/components/AssetsFilteredTable'
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'
import styled from 'styled-components'
import {authProjects} from "store/modules/user";
import get from "lodash.get";
import StatBox from "../../pages/Public/theme/statBox";
import {fnum} from "../../utils/sheldusUtils";
import NfipLossesTable from "../../pages/Public/Home/components/Risk/NFIP/components/NfipLossesTable";

class nfipStatisticsViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.activeGeoid,
        };
    }
    fetchFalcorDeps() {
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();
        return this.props.falcor.get(
            ['nfip', 'losses', 'byGeoid', parseInt(this.props.activeCousubid), 'allTime', ['total_payments', 'total_losses']],
        )
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.activeCousubid !== this.props.activeCousubid || prevState.geoid !== this.state.geoid){
            this.setState({geoid: this.props.activeCousubid !== "undefined" ? this.props.activeCousubid : this.props.activeGeoid})
        }
    }

    render() {
        // console.log('passing', this.props.activeCousubid !== "undefined" ? this.props.activeCousubid : this.props.activeGeoid,
        //     this.state.geoid, this.props.activeCousubid, this.props.activeGeoid);
        return (
            <div >
                <div className='row'>
                    <div className="col-sm-6">
                        <StatBox
                            title={`Number NFIP Claims`}
                            value={get(this.props.graph,
                                `nfip.losses.byGeoid.${parseInt(this.props.activeCousubid)}.allTime.total_losses`, 0).toLocaleString()}
                        />
                    </div><div className="col-sm-6">
                    <StatBox
                        title={`Total Payments`}
                        value={fnum(get(this.props.graph,
                            `nfip.losses.byGeoid.${parseInt(this.props.activeCousubid)}.allTime.total_payments`, 0))}
                    />

                </div>

                </div>
                <div  >
                    <NfipLossesTable
                        title={ "NFIP Losses by Jurisdiction" }
                        defaultSortCol={this.props.defaultSortCol}
                        defaultSortOrder={this.props.defaultSortOrder}
                        colOrder={this.props.colOrder}
                        minHeight={this.props.minHeight}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    activePlan: state.user.activePlan || null,
    activeCousubid: state.user.activeCousubid || null,
    router: state.router,
    graph: state.graph
});
nfipStatisticsViewer.defaultProps = {
    public: true
}
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(nfipStatisticsViewer))