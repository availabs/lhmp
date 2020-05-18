import React, {Component} from 'react';
import AssetsFilteredTable from 'pages/auth/Assets/components/AssetsFilteredTable'
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'
import styled from 'styled-components'
import {authProjects} from "store/modules/user";

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
    componentDidUpdate(prevProps, prevState){
        if (prevProps.activeCousubid !== this.props.activeCousubid || prevState.geoid !== this.state.geoid){
            this.setState({geoid: this.props.activeCousubid !== "undefined" ? this.props.activeCousubid : this.props.activeGeoid})
        }
    }

    render() {
        console.log('passing', this.props.activeCousubid !== "undefined" ? this.props.activeCousubid : this.props.activeGeoid,
            this.state.geoid, this.props.activeCousubid, this.props.activeGeoid);
        return (
            <div >
                <div>
                    <h6> Inventory by Jurisdiction</h6>
                    <AssetsFilteredTable
                        geoid={[this.state.geoid]}
                        groupBy={'jurisdiction'}
                        groupByFilter={[]}
                        scenarioId={[3]}
                        width={'100%'}
                        tableClass={`table table-sm table-lightborder table-hover`}
                        public={true}
                    />
                </div>
                <div>
                    <h6> Inventory by Land use </h6>
                    <AssetsFilteredTable
                        geoid={[this.state.geoid]}
                        groupBy={'propType'}
                        groupByFilter={[]}
                        scenarioId={[3]}
                        width={'100%'}
                        tableClass={`table table-sm table-lightborder table-hover`}
                        public={true}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    activeGeoid: state.user.activeGeoid,
    activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid
});
const mapDispatchToProps = ({authProjects});
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(inventoryTableViewer))