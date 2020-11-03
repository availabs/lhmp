import React, {Component} from 'react';
import Capabilities from 'pages/Public/Home/components/Strategy/Capabilities/index.js'
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'

class capabilityEvaluationTable extends Component {
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
                <Capabilities
                    activeGeoFilter={this.props.activeGeoFilter}
                    defaultSortCol={this.props.defaultSortCol}
                    defaultSortOrder={this.props.defaultSortOrder}
                    colOrder={this.props.colOrder}
                    minHeight={this.props.minHeight}
                    flex={this.props.flex}
                    showHeader={false}
                />
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    activeGeoid: state.user.activeGeoid,
    activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid
});
const mapDispatchToProps = ({
});
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(capabilityEvaluationTable))