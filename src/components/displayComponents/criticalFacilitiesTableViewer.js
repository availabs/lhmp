import React, {Component} from 'react';
import AssetsFilteredTable from 'pages/auth/Assets/components/AssetsFilteredTable'
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'
import get from "lodash.get";

class criticalFacilitiesTableViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.activeGeoid,
        };
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(
            ['plan',[this.props.activePlan],'scenarios']
        )
            .then(response => {
                this.setState({scenarioIds:
                        get(response, `json.plan.${this.props.activePlan}.scenarios`, [])
                            .filter(f => f.name.includes('DFIRM'))
                            .map(f => f.id)})
            })
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
                    scenarioId={this.state.scenarioIds}
                    height={'fit-content'}
                    width={'100%'}
                    tableClass={`table table-sm table-lightborder table-hover`}
                    public={this.props.public === true ? true : false}
                    hideFloodValue={false}
                    defaultSortCol={this.props.defaultSortCol}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    activeGeoid: state.user.activeGeoid,
    activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid,
    activePlan: state.user.activePlan
});
criticalFacilitiesTableViewer.defaultProps = {
    public: true
}
const mapDispatchToProps = ({
});
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(criticalFacilitiesTableViewer))