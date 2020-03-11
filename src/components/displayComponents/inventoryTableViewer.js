import React, {Component} from 'react';
import AssetsFilteredTable from 'pages/auth/Assets/components/AssetsFilteredTable'
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'
import styled from 'styled-components'

const DIV = styled.div`
${props => props.theme.panelDropdownScrollBar};
`;

class inventoryTableViewer extends Component {
    render() {

        return (
            <div >
                <div>
                    <h6> Inventory by Jurisdiction</h6>
                    <AssetsFilteredTable
                        geoid={this.props.activeGeoid}
                        groupBy={'jurisdiction'}
                        groupByFilter={[]}
                        scenarioId={[3]}
                        width={'100%'}
                        tableClass={`table table-sm table-lightborder table-hover`}
                    />
                </div>
                <div>
                    <h6> Inventory by Land use </h6>
                    <AssetsFilteredTable
                        geoid={this.props.activeGeoid}
                        groupBy={'propType'}
                        groupByFilter={[]}
                        scenarioId={[3]}
                        width={'100%'}
                        tableClass={`table table-sm table-lightborder table-hover`}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    activeGeoid: state.user.activeGeoid,
    activeCousubid: state.user.activeCousubid
});
const mapDispatchToProps = ({});
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(inventoryTableViewer))