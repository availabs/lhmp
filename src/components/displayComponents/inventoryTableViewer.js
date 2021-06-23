import React, {Component} from 'react';
import AssetsFilteredTable from 'pages/auth/Assets/components/AssetsFilteredTable'
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'
import styled from 'styled-components'
import {authProjects} from "store/modules/user";
import get from "lodash.get";

const DIV = styled.div`
${props => props.theme.panelDropdownScrollBar};
`;

class inventoryTableViewer extends Component {
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
        // console.log('passing', this.props.activeCousubid !== "undefined" ? this.props.activeCousubid : this.props.activeGeoid,
        //     this.state.geoid, this.props.activeCousubid, this.props.activeGeoid);
        return (
            <div >
                <div>
                    <h6> Inventory by Jurisdiction</h6>
                    <AssetsFilteredTable
                        geoid={[this.state.geoid]}
                        groupBy={'jurisdiction'}
                        groupByFilter={[]}
                        scenarioId={this.state.scenarioIds}
                        width={'100%'}
                        tableClass={`table table-sm table-lightborder table-hover`}
                        public={this.props.public === true ? true : false}
                        hideFloodValue={false}
                        defaultSortCol={this.props.defaultSortCol || 'jurisdiction'}
                    />
                </div>
                <div>
                    <h6> Inventory by Land use </h6>
                    <AssetsFilteredTable
                        geoid={[this.state.geoid]}
                        groupBy={'propType'}
                        groupByFilter={[]}
                        scenarioId={this.state.scenarioIds}
                        width={'100%'}
                        tableClass={`table table-sm table-lightborder table-hover`}
                        public={this.props.public === true ? true : false}
                        hideFloodValue={false}
                        defaultSortCol={this.props.defaultSortCol || 'propType'}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    activeGeoid: state.user.activeGeoid,
    activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid,
    activePlan: state.user.activePlan
});
inventoryTableViewer.defaultProps = {
    public: true
}
const mapDispatchToProps = ({authProjects});
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(inventoryTableViewer))