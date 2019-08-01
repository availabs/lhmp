import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import pick from "lodash.pick"
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "../../../../store/falcorGraph";
import TableBox from 'components/light-admin/tables/TableBox'
import {Link} from "react-router-dom";

const ATTRIBUTES =[
    'id',
    'name',
    'type',
    'parcel_id'
]
let data_length = 0;
class AssetsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: '',
            data: [],
            loading: false,
            columns : ATTRIBUTES
        };

        this.onPageChange = this.onPageChange.bind(this);

    }

    fetchFalcorDeps() {
        return this.props.falcor.get(['building','byGeoid',this.props.geoid,'length'])
            .then(response => {
                data_length = response.json.building.byGeoid[this.props.geoid].length
            })

    }

    componentDidMount(){
        this.setState({
          loading : true
        });
        let geoid = this.props.geoid.map((geoid) => geoid);
        let d = [];
        return this.props.falcor.get(['building', 'byGeoid', ...this.props.geoid, 'byIndex', {from:0, to:50}, 'id'])
            .then(response => {
                const ids = [];
                for (let i = 0; i < 50; ++i) {
                    const graph = response.json.building.byGeoid[geoid].byIndex[i]
                    if (graph) {
                        ids.push(graph.id)
                    }
                }
                return ids
            })
            .then(ids => {
                this.props.falcor.get(['building', 'byId', ids, ATTRIBUTES])
                    .then(response => {
                        Object.values(response.json.building.byId).forEach((item)=>{
                            d.push(pick(item,...ATTRIBUTES))
                        });
                        this.setState({data: d, loading: false});
                    });
            })

    }

    onPageChange(from, to) {
        this.setState({
            loading : true
        })
        let geoid = this.props.geoid.map((geoid) => geoid);
        let d = [];
        return this.props.falcor.get(['building', 'byGeoid', ...this.props.geoid, 'byIndex', {from: from, to: to}, 'id'])
            .then(response => {
                const ids = [];
                for (let i = 0; i < to; ++i) {
                    const graph = response.json.building.byGeoid[geoid].byIndex[i]
                    if (graph) {
                        ids.push(graph.id)
                    }
                }
                return ids
            })
             .then(ids => {
                this.props.falcor.get(['building', 'byId', ids, ATTRIBUTES])
                    .then(response => {
                        Object.values(response.json.building.byId).forEach((item)=>{
                            d.push(pick(item,...ATTRIBUTES))
                        });
                        this.setState({data: d, loading: false});
                    })
            })

    }
    render(){
        return (
            <div>
            <Element>
                    <div id="dataTable1_wrapper" className="dataTables_wrapper container-fluid dt-bootstrap4" >
                        <div className="row">
                            <TableBox
                                page={0}
                                size={this.props.size}
                                length={[data_length]}
                                loading={this.state.loading}
                                onPage={this.onPageChange.bind(this)}
                                filterData = {true}
                                tableData = {this.state.data}
                                columns = {this.state.columns}
                            />
                        </div>
                    </div>
            </Element>
            </div>
        )
    }

    static defaultProps = {
        geoid: [36001],
        length: data_length,
        size: 50,
        filterData: false
    }

}

const mapStateToProps = (state,ownProps) => {
return {
geoid : ownProps.geoid,
cousubs: get(state.graph, 'geo',{}),
buildingData : get(state.graph,'building.byId',{})
}
};

const mapDispatchToProps =  {
//sendSystemMessage,
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsTable))



