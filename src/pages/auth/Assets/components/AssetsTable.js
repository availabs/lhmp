import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import TableBox from 'components/light-admin/tables/TableBox'
var numeral = require('numeral')
var _ = require('lodash')
const ATTRIBUTES =[
    'address',
    'prop_class',
    'owner_type',
    'replacement_value',
];

const ATTRIBUTES_AAL =[
    'address',
    'prop_class',
    'owner_type',
    'replacement_value',
    'expected_annual_flood_loss'
];

let data_length = 0;
let data = [];
const owner_type =['1','2','3','4','5','6','7','8','9','10','-999']
class AssetsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.activeGeoid,
            data: [],
            loading: false,
            page: 0,
            length : 0,
            columns : ATTRIBUTES,
            flag:true
        };
        this.onPageChange = this.onPageChange.bind(this);

    }
    componentDidUpdate(oldProps){
        if(this.props.geoid[0] !== oldProps.geoid[0]){
            this.fetchFilteredData()
        }
        if(this.props.owner_type[0] !== oldProps.owner_type[0]){
            this.fetchFilteredData()
        }
        if(this.props.land_use_category[0] !== oldProps.land_use_category[0]){
            this.fetchFilteredData()
        }
        if(this.props.filters[0].length !== oldProps.filters[0].length){
            this.fetchFilteredData()
        }
        if(this.props.risk[0] !== oldProps.risk[0]){
            this.fetchFilteredData()
        }
    }

    componentDidMount(){
        this.fetchFilteredData()
    }

    fetchFilteredData(){
        let prop_class = [];
        let to = 0;
        this.setState({
            loading:true,
            data : [],
            length : 0
        })
        if(this.props.filters[0].length === 0){
            prop_class = this.props.land_use_category
        }else{
            prop_class = this.props.filters[0]
        }
        if(this.props.risk[0] === 'loss'){
            return this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',prop_class,'ownerType',this.props.owner_type,this.props.risk,'length'],
                ['building','meta',['owner_type','prop_class']])
                .then(response =>{
                    let length = response.json.building.byGeoid[this.props.geoid].propType
                    let meta = response.json.building.meta
                    let graph = {}
                    data_length = 0
                    prop_class.forEach(prop =>{
                        data_length +=length[prop].ownerType[this.props.owner_type].loss.length
                    })
                    this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',prop_class,'ownerType',this.props.owner_type,'expected_annual_flood_loss_data'])
                        .then(response =>{
                            graph = response.json.building.byGeoid[this.props.geoid].propType
                            prop_class.forEach(prop =>{
                            let buildingData = graph[prop].ownerType[this.props.owner_type].expected_annual_flood_loss_data
                            data = []
                            buildingData.forEach((item,i) =>{
                                if( i >= 0 && i <= 50){
                                    data.push({
                                        'address':item.address,
                                        'prop_class':meta.prop_class.map(d => d.value === item.prop_class ? d.name : null),
                                        'owner_type':meta.owner_type.map(d => d.value === item.owner_type ? d.name : null),
                                        'replacement_value':item.replacement_value,
                                        'expected_annual_flood_loss':item.expected_annual_flood_loss || 0,
                                        'building_id':item.building_id
                                    })
                                }
                            })
                            })
                            data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                            data.map(d =>{
                                d.replacement_value = '$'+ numeral(d.replacement_value).format('0,0.0')
                                d.expected_annual_flood_loss = '$' +numeral(d.expected_annual_flood_loss).format('0,0.0')
                            })
                            this.setState({length : data_length,data : data ,loading: false});
                        })
                })
        }else{
            return this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',prop_class,'ownerType',this.props.owner_type,'risk',this.props.risk,'length'],
                ['building','meta',['owner_type','prop_class']])
                .then(response =>{
                    let length = response.json.building.byGeoid[this.props.geoid].propType
                    let meta = response.json.building.meta
                    let graph = {}
                    data_length = 0
                    prop_class.forEach(prop =>{
                        data_length +=length[prop].ownerType[this.props.owner_type].risk[this.props.risk].length
                    })
                    if(data_length < 50){
                        to = data_length
                    }else{
                        to = 50
                    }
                    this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',prop_class,'ownerType',this.props.owner_type,'risk',this.props.risk,'byIndex',[{from:0,to:to}],ATTRIBUTES])
                        .then(response =>{
                            graph = response.json.building.byGeoid[this.props.geoid].propType
                            prop_class.forEach(prop =>{
                                let buildingData = graph[prop].ownerType[this.props.owner_type].risk[this.props.risk].byIndex
                                data = []
                                Object.keys(buildingData).forEach(item =>{
                                    if(buildingData[item] !== null && buildingData[item]['$__path']){
                                        data.push({
                                            'address':buildingData[item].address,
                                            'prop_class':meta.prop_class.map(d => d.value === buildingData[item].prop_class ? d.name : null),
                                            'owner_type':meta.owner_type.map(d => d.value === buildingData[item].owner_type ? d.name : null),
                                            'replacement_value':buildingData[item].replacement_value,
                                            'building_id':buildingData[item]['$__path'][2]
                                        })
                                    }
                                })
                            })
                            data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                            data.map(d =>{
                                d.replacement_value = '$'+ numeral(d.replacement_value).format('0,0.0')
                            })
                            this.setState({length : data_length,data : data ,loading: false});
                        })
                })
        }

    }

    onPageChange(from,to){
        let prop_class = [];
        let graph = {}
        this.setState({
            loading:true
        })
        if(this.props.filters[0].length === 0){
            prop_class = this.props.land_use_category
        }else{
            prop_class = this.props.filters[0]
        }
        if(this.props.risk[0] === 'loss'){
            this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',prop_class,'ownerType',this.props.owner_type,'expected_annual_flood_loss_data'],
                ['building','meta',['owner_type','prop_class']])
                .then(response =>{
                    graph = response.json.building.byGeoid[this.props.geoid].propType
                    let meta = response.json.building.meta
                    prop_class.forEach(prop =>{
                        let buildingData = graph[prop].ownerType[this.props.owner_type].expected_annual_flood_loss_data
                        data = []
                        buildingData.forEach((item,i) =>{
                            if( i >= from && i <= to){
                                data.push({
                                    'address':item.address,
                                    'prop_class':meta.prop_class.map(d => d.value === item.prop_class ? d.name : null),
                                    'owner_type':meta.owner_type.map(d => d.value === item.owner_type ? d.name : null),
                                    'replacement_value':item.replacement_value,
                                    'expected_annual_flood_loss':item.expected_annual_flood_loss || 0,
                                    'building_id':item.building_id
                                })
                            }
                        })
                    })
                    data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                    data.map(d =>{
                        d.replacement_value = '$'+ numeral(d.replacement_value).format('0,0.0')
                        d.expected_annual_flood_loss = '$' +numeral(d.expected_annual_flood_loss).format('0,0.0')
                    })
                    this.setState({length : data_length,data : data ,loading: false});
                })
        }else{
            this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',prop_class,'ownerType',this.props.owner_type,'risk',this.props.risk,'byIndex',[{from:from,to:to}],ATTRIBUTES],
                ['building','meta',['owner_type','prop_class']])
                .then(response =>{
                    let graph = response.json.building.byGeoid[this.props.geoid].propType
                    let meta = response.json.building.meta
                    prop_class.forEach(prop =>{
                        let buildingData = graph[prop].ownerType[this.props.owner_type].risk[this.props.risk].byIndex
                        Object.keys(buildingData).forEach(item =>{
                            if(buildingData[item] !== null && buildingData[item]['$__path']){
                                data.push({
                                    'address':buildingData[item].address,
                                    'prop_class':meta.prop_class.map(d => d.value === buildingData[item].prop_class ? d.name : null),
                                    'owner_type':meta.owner_type.map(d => d.value === buildingData[item].owner_type ? d.name : null),
                                    'replacement_value':buildingData[item].replacement_value,
                                    'building_id':buildingData[item]['$__path'][2]
                                })
                            }
                        })
                    })
                    data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                    data.map(d =>{
                        d.replacement_value = '$'+ numeral(d.replacement_value).format('0,0.0')
                    })
                    this.setState({length : data_length,data : data ,loading: false});
                })
        }

    }


    render(){
        let columns = []
        if(this.props.risk[0] === 'loss'){
            columns = ATTRIBUTES_AAL
        }else{
            columns = this.state.columns
        }
        return (
            <div>
            <Element>
                    <div id="dataTable1_wrapper" className="dataTables_wrapper container-fluid dt-bootstrap4" >
                        <div className="row">
                            <TableBox
                                page={this.state.page}
                                size={this.props.size}
                                length={[this.state.length]}
                                loading={this.state.loading}
                                onPage={this.onPageChange.bind(this)}
                                filterData = {true}
                                tableData = {this.state.data}
                                columns = {columns}
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
        filterData: false,
        owner_type: ['1','2','3','4','5','6','7','8','9','10','-999']
    }

}

const mapStateToProps = (state,ownProps) => {
    return {
    geoid : ownProps.geoid,
    activeGeoid: state.user.activeGeoid,
    owner_type:ownProps.owner_type,
    land_use_category:ownProps.land_use_category,
    filters:ownProps.filters,
    cousubs: get(state.graph, 'geo',{}),
    buildingData : get(state.graph,'building.byGeoid',{})
    }
};

const mapDispatchToProps =  {
//sendSystemMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsTable))



