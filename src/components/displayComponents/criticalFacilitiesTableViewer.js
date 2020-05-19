import React, {Component} from 'react';
import AssetsFilteredTable from 'pages/auth/Assets/components/AssetsFilteredTable'
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'

class criticalFacilitiesTableViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.activeGeoid,
        };
    }
    componentDidUpdate(prevProps, prevState){
        if (prevProps.activeCousubid !== this.props.activeCousubid || prevState.geoid !== this.state.geoid){
            this.setState({geoid: this.props.activeCousubid !== "undefined" ? this.props.activeCousubid : this.props.activeGeoid})
        }
    }
    render() {

        return(
            <div>
                <h6> Critical Facilities </h6>
                <AssetsFilteredTable
                    geoid={[this.state.geoid]}
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

const mapStateToProps = (state, ownProps) => ({
    activeGeoid: state.user.activeGeoid,
    activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid
});
const mapDispatchToProps = ({
});
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(criticalFacilitiesTableViewer))