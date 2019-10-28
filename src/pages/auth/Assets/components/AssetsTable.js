import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import TableBox from 'components/light-admin/tables/TableBox'
import config from 'pages/auth/Assets/components/BuildingByLandUseConfig.js'

const ATTRIBUTES =[
    'address',
    'prop_class',
    'owner_type',
    'replacement_value',
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
            columns : ATTRIBUTES
        };

        this.onPageChange = this.onPageChange.bind(this);

    }

    componentDidUpdate(oldProps,oldState){
        if(this.props.geoid[0] !== oldProps.geoid[0]){
            //console.log('in first if of component did update')
            this.fetchCountyData()
        }
        if(this.props.owner_type[0] !== oldProps.owner_type[0]){
            //console.log('in second if of component did update')
            this.fetchOwnerTypeData()
        }
        if(this.props.land_use_category[0] !== oldProps.land_use_category[0]){
            this.fetchLandUseData()
        }
        if(this.props.filters[0] && oldProps.filters[0] &&  this.props.filters[0].length !== oldProps.filters[0].length){
            this.fetchLandUseTypeData()
        }
        //if owner_type is not 0 or none and land use category is not 0 or none
        if(this.props.owner_type[0] !== '0' && this.props.land_use_category[0] !== '0'){
            this.fetchOwnerTypeLandUseData()
        }


    }

    componentDidMount(){
        this.fetchCountyData()
    }

    fetchCountyData(){
        if(this.props.owner_type[0] !== '0' && this.props.owner_type[0] !== "None"){
            this.fetchOwnerTypeData()
        }else{
            this.setState({
                loading : true
            })
            //let d = [];
            return this.props.falcor.get(['building','byGeoid',this.props.geoid,'length'])
                .then(response => {
                    data_length = response.json.building.byGeoid[this.props.geoid].length
                    this.props.falcor.get(['building', 'byGeoid',this.props.geoid, 'byIndex', {from:0, to:50},ATTRIBUTES],
                        ['building','meta',['owner_type','prop_class']]
                    )
                        .then(response => {
                            let graph = response.json.building.byGeoid[this.props.geoid].byIndex;
                            let meta = response.json.building.meta;
                            if(graph){
                                Object.keys(graph).forEach((item)=>{
                                    if(graph[item]['$__path']){
                                        data.push({
                                            'address':graph[item].address,
                                            'prop_class':meta.prop_class.map(d => d.value === graph[item].prop_class ? d.name : null),
                                            'owner_type':meta.owner_type.map(d => d.value === graph[item].owner_type ? d.name : null),
                                            'replacement_value':graph[item].replacement_value,
                                            'building_id':graph[item]['$__path'][2]
                                        })
                                    }


                                });
                                data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                                data.map(d =>{
                                    d.replacement_value = '$'+d.replacement_value
                                })
                                this.setState({length : data_length,data : data ,loading: false});
                            }
                        })
                })

        }

        }


    fetchOwnerTypeData(){
        let to = 0
        if(this.props.owner_type[0] === "None"){
            this.fetchCountyData()
        }else{
            return this.props.falcor.get(['building','byGeoid',
                this.props.geoid,
                'ownerType',this.props.owner_type,'length'
            ])
                .then(response =>{
                    data_length = response.json.building.byGeoid[this.props.geoid].ownerType[this.props.owner_type].length
                    if( data_length > 50){
                        to = 50
                    }else{
                        to = data_length
                    }
                    this.props.falcor.get(['building','byGeoid',this.props.geoid,'ownerType',this.props.owner_type,'byIndex',[{from:0,to:to}],ATTRIBUTES],
                        ['building','meta',['owner_type','prop_class']]
                    )
                        .then(response =>{
                            let graph = response.json.building.byGeoid[this.props.geoid].ownerType[this.props.owner_type].byIndex;
                            let meta = response.json.building.meta;
                            data = []
                            if(graph){
                                Object.keys(graph).forEach(item =>{
                                    if(graph[item] !== null && graph[item]['$__path']){
                                        data.push({
                                            'address':graph[item].address,
                                            'prop_class':meta.prop_class.map(d => d.value === graph[item].prop_class ? d.name : null),
                                            'owner_type':meta.owner_type.map(d => d.value === graph[item].owner_type ? d.name : null),
                                            'replacement_value':graph[item].replacement_value,
                                            'building_id':graph[item]['$__path'][2]
                                        })
                                    }
                                })
                            }
                            data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                            data.map(d =>{
                                d.replacement_value = '$'+d.replacement_value
                            })
                            this.setState({length : data_length,data : data ,loading: false});

                        })
                })
        }

    }

    fetchLandUseData(){
        if(this.props.land_use_category[0] === "None"){
            this.fetchCountyData()
        }else{
            let to = 0
            return this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',this.props.land_use_category,'length'])
                .then(response =>{
                    data_length = response.json.building.byGeoid[this.props.geoid].propType[this.props.land_use_category].length

                    if( data_length > 50){
                        to = 50
                    }else{
                        to = data_length
                    }
                    this.setState({
                        loading : true,
                    })
                    this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',this.props.land_use_category,'byIndex',[{from:0,to:to}],ATTRIBUTES],
                        ['building','meta',['owner_type','prop_class']]
                    )
                        .then(response =>{
                            let graph = response.json.building.byGeoid[this.props.geoid].propType[this.props.land_use_category].byIndex;
                            let meta = response.json.building.meta;
                            data = [];
                            if(graph){
                                    Object.keys(graph).forEach(item =>{
                                        if(graph[item] !== null && graph[item]['$__path']){
                                            data.push({
                                                'address':graph[item].address,
                                                'prop_class':meta.prop_class.map(d => d.value === graph[item].prop_class ? d.name : null),
                                                'owner_type':meta.owner_type.map(d => d.value === graph[item].owner_type ? d.name : null),
                                                'replacement_value':graph[item].replacement_value,
                                                'building_id':graph[item]['$__path'][2]
                                            })
                                        }
                                    })

                            }

                            data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                            data.map(d =>{
                                d.replacement_value = '$'+d.replacement_value
                            })
                            this.setState({length : data_length,data : data ,loading: false});

                        })
                })
        }

    }

    fetchLandUseTypeData(){
        let to = 0
        return this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',this.props.filters[0],'length'])
            .then(response =>{
                if(this.props.filters[0].length === 1){
                    data_length = response.json.building.byGeoid[this.props.geoid].propType[this.props.filters[0]].length
                    if(data_length > 50 ){
                        to = 50
                    }else{
                        to = data_length
                    }
                    this.setState({
                        loading : true,
                        data : []
                    })
                    //console.log('data_length',data_length)
                    this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',this.props.filters[0],'byIndex',[{from:0,to:to}],ATTRIBUTES],
                        ['building','meta',['owner_type','prop_class']])
                        .then(response =>{
                            let graph = response.json.building.byGeoid[this.props.geoid].propType[this.props.filters[0]].byIndex;
                            let meta = response.json.building.meta;
                            data = [];
                            if(graph){
                                Object.keys(graph).forEach(item =>{
                                    if(graph[item] !== null && graph[item]['$__path']){
                                        data.push({
                                            'address':graph[item].address,
                                            'prop_class':meta.prop_class.map(d => d.value === graph[item].prop_class ? d.name : null),
                                            'owner_type':meta.owner_type.map(d => d.value === graph[item].owner_type ? d.name : null),
                                            'replacement_value':graph[item].replacement_value,
                                            'building_id':graph[item]['$__path'][2]
                                        })
                                    }
                                })

                            }

                            data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                            data.map(d =>{
                                d.replacement_value = '$'+d.replacement_value
                            })
                            this.setState({length : data_length,data : data ,loading: false});

                        })
                }if(this.props.filters[0].length > 1){
                    data_length = 0
                    let graph = response.json.building.byGeoid[this.props.geoid].propType
                    Object.keys(graph).filter(d => d !=='$__path').forEach(item =>{
                        data_length += parseInt(graph[item].length)
                    })
                    this.setState({
                        loading : true,
                        data : []
                    })
                    if(data_length > 50 ){
                        to = 50
                    }else{
                        to = data_length
                    }
                    this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',this.props.filters[0],'byIndex',[{from:0,to:to}],ATTRIBUTES],
                        ['building','meta',['owner_type','prop_class']])
                        .then(response =>{
                            let graph = response.json.building.byGeoid[this.props.geoid]
                            let meta = response.json.building.meta;
                            data = [];
                            if(graph){
                                Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                                    this.props.filters[0].forEach(filter =>{
                                        Object.values(graph[item][filter].byIndex).forEach(item =>{
                                            if(item !== null && item['$__path']){
                                                data.push({
                                                    'address':item.address,
                                                    'prop_class':meta.prop_class.map(d => d.value === item.prop_class ? d.name : null),
                                                    'owner_type':meta.owner_type.map(d => d.value === item.owner_type ? d.name : null),
                                                    'replacement_value':item.replacement_value,
                                                    'building_id':item['$__path'][2]
                                                })
                                            }
                                        })
                                    })
                                })

                            }
                            data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                            data.map(d =>{
                                d.replacement_value = '$'+d.replacement_value
                            })

                            this.setState({length : data_length,data : data ,loading: false});

                        })
                }if(this.props.filters[0].length === 0){
                    this.fetchLandUseData()
                }

            })
    }

    fetchOwnerTypeLandUseData(){
        let to = 0
        if(this.props.owner_type[0] !== '0' && this.props.land_use_category[0] !== '0' && this.props.filters[0].length >= 1){
            //TODO check the routes and run them here
            this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',this.props.filters[0],'ownerType',this.props.owner_type,'length'])
                .then(response =>{
                    if (this.props.filters[0].length === 1){
                        data_length = response.json.building.byGeoid[this.props.geoid].propType[this.props.filters[0]].ownerType[this.props.owner_type].length
                        if(data_length > 50 ){
                            to = 50
                        }else{
                            to = data_length
                        }
                        this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',this.props.filters[0],'ownerType',this.props.owner_type,'byIndex',[{from:0,to:to}],ATTRIBUTES])
                    }else{
                       data_length = 0
                        let graph = response.json.building.byGeoid[this.props.geoid].propType
                        Object.keys(graph).filter(d => d !=='$__path').forEach(item =>{
                            data_length += parseInt(graph[item].ownerType[this.props.owner_type].length)
                        })

                    }
                })
        }
    }

    onPageChange(from, to) {
        if(this.props.owner_type[0] !== '0' && this.props.owner_type[0] !== "None"){
            this.setState({
                loading : true
            })
                return this.props.falcor.get(['building','byGeoid',this.props.geoid,'ownerType',this.props.owner_type,'byIndex',[{from:from,to:to}],ATTRIBUTES],
                    ['building','meta',['owner_type','prop_class']]
                )
                    .then(response =>{
                        let graph = response.json.building.byGeoid[this.props.geoid].ownerType[this.props.owner_type].byIndex;
                        let meta = response.json.building.meta;
                        console.log('graph',graph)
                        data = []
                        if(graph){
                            Object.keys(graph).forEach(item =>{
                                if(graph[item] !== null && graph[item]['$__path']){
                                    data.push({
                                        'address':graph[item].address,
                                        'prop_class':meta.prop_class.map(d => d.value === graph[item].prop_class ? d.name : null),
                                        'owner_type':meta.owner_type.map(d => d.value === graph[item].owner_type ? d.name : null),
                                        'replacement_value':graph[item].replacement_value,
                                        'building_id':graph[item]['$__path'][2]
                                    })
                                }
                            })
                        }
                        data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                        data.map(d =>{
                            d.replacement_value = '$'+d.replacement_value
                        })
                        console.log('data',data)
                        this.setState({data : data ,loading: false});

                    })

        }
        if(this.props.land_use_category[0] !== '0' && this.props.land_use_category[0] !== "None") {
            this.setState({
                loading: true,
            })
            this.props.falcor.get(['building', 'byGeoid', this.props.geoid, 'propType', this.props.land_use_category, 'byIndex', [{
                    from: from,
                    to: to
                }], ATTRIBUTES],
                ['building', 'meta', ['owner_type', 'prop_class']]
            )
                .then(response => {
                    let graph = response.json.building.byGeoid[this.props.geoid].propType[this.props.land_use_category].byIndex;
                    let meta = response.json.building.meta;
                    data = [];
                    if (graph) {
                        Object.keys(graph).forEach(item => {

                            if (graph[item] !== null && graph[item]['$__path']) {
                                data.push({
                                    'address': graph[item].address,
                                    'prop_class': meta.prop_class.map(d => d.value === graph[item].prop_class ? d.name : null),
                                    'owner_type': meta.owner_type.map(d => d.value === graph[item].owner_type ? d.name : null),
                                    'replacement_value': graph[item].replacement_value,
                                    'building_id': graph[item]['$__path'][2]
                                })
                            }
                        })

                    }

                    data.sort((a, b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1 : -1);
                    data.map(d => {
                        d.replacement_value = '$' + d.replacement_value
                    })
                    this.setState({data: data, loading: false});
                })
        }if(this.props.filters[0].length >= 1){
            this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',this.props.filters[0],'byIndex',[{from:from,to:to}],ATTRIBUTES],
                ['building','meta',['owner_type','prop_class']])
                .then(response =>{
                    let graph = response.json.building.byGeoid[this.props.geoid]
                    let meta = response.json.building.meta;
                    data = [];
                    if(graph){
                        Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                            this.props.filters[0].forEach(filter =>{
                                Object.values(graph[item][filter].byIndex).forEach(item =>{
                                    if(item !== null && item['$__path']){
                                        data.push({
                                            'address':item.address,
                                            'prop_class':meta.prop_class.map(d => d.value === item.prop_class ? d.name : null),
                                            'owner_type':meta.owner_type.map(d => d.value === item.owner_type ? d.name : null),
                                            'replacement_value':item.replacement_value,
                                            'building_id':item['$__path'][2]
                                        })
                                    }
                                })
                            })
                        })

                    }
                    data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                    data.map(d =>{
                        d.replacement_value = '$'+d.replacement_value
                    })

                    this.setState({data : data ,loading: false});
        })
        }
        if(this.props.owner_type[0] === '0' || this.props.owner_type[0] === "None" || this.props.land_use_category[0] === '0' || this.props.land_use_category[0] === "None"){
            this.setState({
                loading : true
            })
            return this.props.falcor.get(['building', 'byGeoid',this.props.geoid, 'byIndex', {from:from, to:to},ATTRIBUTES],
                ['building','meta',['owner_type','prop_class']]
            )
                .then(response => {
                    let graph = response.json.building.byGeoid[this.props.geoid].byIndex;
                    let meta = response.json.building.meta;
                    if(graph){
                        Object.keys(graph).forEach((item)=>{
                            if(graph[item] !== null && graph[item]['$__path']){
                                data.push({
                                    'address':graph[item].address,
                                    'prop_class':meta.prop_class.map(d => d.value === graph[item].prop_class ? d.name : null),
                                    'owner_type':meta.owner_type.map(d => d.value === graph[item].owner_type ? d.name : null),
                                    'replacement_value':graph[item].replacement_value,
                                    'building_id':graph[item]['$__path'][2]
                                })
                            }


                        });
                        data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                        data.map(d =>{
                            d.replacement_value = '$'+d.replacement_value
                        })
                        this.setState({data : data ,loading: false});
                    }
                })
        }


    }
    render(){
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
    buildingData : get(state.graph,'building.byId',{})
    }
};

const mapDispatchToProps =  {
//sendSystemMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsTable))



