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
            <div>
                <Capabilities
                showHeader={false}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(capabilityEvaluationTable))