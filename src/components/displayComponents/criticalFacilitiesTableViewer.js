import React, {Component} from 'react';
import AssetsFilteredTable from 'pages/auth/Assets/components/AssetsFilteredTable'
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'

class criticalFacilitiesTableViewer extends Component {
    render() {

        return(
            <div>
                <h6> Critical Facilities </h6>
                <AssetsFilteredTable
                    geoid={this.props.activeGeoid}
                    groupBy={'critical'}
                    groupByFilter={[]}
                    scenarioId={[3]}
                    height={'fit-content'}
                    width={'100%'}
                    tableClass={`table table-sm table-lightborder table-hover`}
                    public={true}
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    activeGeoid: state.user.activeGeoid,
    activeCousubid: state.user.activeCousubid
});
const mapDispatchToProps = ({
});
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(criticalFacilitiesTableViewer))