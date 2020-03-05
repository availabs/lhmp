import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "../../../../store/falcorGraph";
import BuildingByOwnerTypeConfig from "./BuildingByOwnerTypeConfig"
var numeral = require('numeral');
const buildingOwners = [1,2,3,4,5,6,7,8,9,10,-999];
const buildingOwnersType = ['Federal','State','County','City','Town','Village','Mixed Government','Private','Public School District or BOCES','Road right of way','Unknown']
let totalBuildings = 0;
let totalBuildingsValue = 0;
let flood_100_totalBuildings = 0;
let flood_100_totalBuildingsValue = 0;
let flood_500_totalBuildings = 0;
let flood_500_totalBuildingsValue = 0;
class BuildingByOwnerTypeTable extends React.Component{
    constructor(props){
        super(props)
        this.renderBuildingTable = this.renderBuildingTable.bind(this)
    }

    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            this.fetchFalcorDeps()
        }
    }
    fetchFalcorDeps(){
        return this.props.falcor.get(
            ['building','byGeoid',this.props.geoid,'ownerType',buildingOwners,'sum',['count','replacement_value']],
            ['building','byGeoid',this.props.geoid,'ownerType',buildingOwners,['flood_100', 'flood_500'],'sum',['count','replacement_value']]
        )
            .then(response => {
                return response
        })
    }

    buildingTable(){
        let BuildingTypeData = [];
        totalBuildings = 0;
        totalBuildingsValue = 0;
        flood_100_totalBuildings = 0;
        flood_100_totalBuildingsValue = 0;
        flood_500_totalBuildings = 0;
        flood_500_totalBuildingsValue = 0;
        let geoid = this.props.geoid.map((geoid) => geoid);
        if(this.props.data !== undefined && this.props.data[geoid] !== undefined && this.props.buildingType)
        {
            let graph = this.props.data[geoid].ownerType
            if(graph && Object.keys(graph).length === buildingOwners.length){
                Object.keys(graph).forEach((item,i) =>{
                    BuildingTypeData.push({
                        'owner':buildingOwnersType[i],
                        'replacement_value':numeral(parseInt(graph[item].sum.replacement_value.value)).format('0,0.a') ||0,
                        'count':numeral(parseInt(graph[item].sum.count.value)).format('0,0.a') || 0,

                        'flood_100_replacement_value':numeral(parseInt(graph[item].flood_100.sum.replacement_value.value)).format('0,0.a') ||0,
                        'flood_100_count':numeral(parseInt(graph[item].flood_100.sum.count.value)).format('0,0.a') || 0,

                        'flood_500_replacement_value':numeral(parseInt(graph[item].flood_500.sum.replacement_value.value)).format('0,0.a') ||0,
                        'flood_500_count':numeral(parseInt(graph[item].flood_500.sum.count.value)).format('0,0.a') || 0,

                        link: 'list/ownerType/' +
                            get(BuildingByOwnerTypeConfig.filter(ownertypeconfig => ownertypeconfig.name === buildingOwnersType[i]).pop(), `value`, null)
                    })
                    totalBuildings += parseInt(graph[item].sum.count.value) || 0;
                    totalBuildingsValue += parseInt(graph[item].sum.replacement_value.value) || 0;

                    flood_100_totalBuildings += parseInt(graph[item].flood_100.sum.count.value) || 0;
                    flood_100_totalBuildingsValue += parseInt(graph[item].flood_100.sum.replacement_value.value) || 0;

                    flood_500_totalBuildings += parseInt(graph[item].flood_500.sum.count.value) || 0;
                    flood_500_totalBuildingsValue += parseInt(graph[item].flood_500.sum.replacement_value.value) || 0;
                })
            }
        }
        return BuildingTypeData
    }

    renderBuildingTable(){
        let buildingData = this.buildingTable();
        let colors = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494",'#1AA3CB',
            '#C01616','#091860','#E0E540','#C15E0A','#074F28','#564B8E','#287F2C',
            '#F7C9B9', '#F4F3AF', '#C2ECF3', '#F4AD4D', '#2AF70E', '#D8AFE7', '#88DE73', '#718CD1', '#EA6A7D'];

        return(
            <div>
                <Element>
                    <div className="table-responsive">
                        <table className="table table lightBorder">
                            <thead>
                            <tr>
                                <th>BUILDING TYPE</th>
                                <th>TOTAL # BUILDING TYPE</th>
                                <th>TOTAL $ REPLACEMENT VALUE</th>
                                <th>100 YEAR DFERM # BUILDING TYPE</th>
                                <th>100 YEAR DFERM $ REPLACEMENT VALUE</th>
                                <th>500 YEAR DFERM # BUILDING TYPE</th>
                                <th>500 YEAR DFERM $ REPLACEMENT VALUE</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                buildingData.map((data,i) =>{

                                    return(
                                        <tr>
                                            <td>
                                                <div className='el-legend'>
                                                    <div className='legend-value-w'>
                                                        <div className='legend-pin' style={{'background-color': colors[i]}}/>&nbsp;
                                                        <a href={'#'} className='legend-value' onClick={() => this.props.updateOwner({target:{id:'ownerType', value:data.owner}})}>
                                                            {data.owner}
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <a href={data.link} className='legend-value'>
                                                    {data.count || 0}
                                                </a>
                                            </td>
                                            <td>
                                                <a href={data.link} className='legend-value'>
                                                    ${data.replacement_value || 0}
                                                </a>
                                            </td>

                                            <td>
                                                <a href={data.link + '/hazard/flood_100'} className='legend-value'>
                                                    {data.flood_100_count || 0}
                                                </a>
                                            </td>
                                            <td>
                                                <a href={data.link + '/hazard/flood_100'} className='legend-value'>
                                                    ${data.flood_100_replacement_value || 0}
                                                </a>
                                            </td>

                                            <td>
                                                <a href={data.link + '/hazard/flood_500'} className='legend-value'>
                                                    {data.flood_500_count || 0}
                                                </a>
                                            </td>
                                            <td>
                                                <a href={data.link + '/hazard/flood_500'} className='legend-value'>
                                                    ${data.flood_500_replacement_value || 0}
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                            <tfoot>
                            <tr>
                                <td><h6>Total :</h6></td>
                                <td>
                                    <h6>
                                        <a href={'list/ownerType/' + BuildingByOwnerTypeConfig.map(f => f.value).join('-')} className='legend-value'>
                                            {numeral(totalBuildings).format('0,0.a')}
                                        </a>
                                    </h6>
                                </td>
                                <td>
                                    <h6>
                                        <a href={'list/ownerType/' + BuildingByOwnerTypeConfig.map(f => f.value).join('-')} className='legend-value'>
                                            ${numeral(totalBuildingsValue).format('0,0.a')}
                                        </a>
                                    </h6>
                                </td>

                                <td>
                                    <h6>
                                        <a href={'list/ownerType/' + BuildingByOwnerTypeConfig.map(f => f.value).join('-') + '/hazard/flood_100'} className='legend-value'>
                                            {numeral(flood_100_totalBuildings).format('0,0.a')}
                                        </a>
                                    </h6>
                                </td>
                                <td>
                                    <h6>
                                        <a href={'list/ownerType/' + BuildingByOwnerTypeConfig.map(f => f.value).join('-') + '/hazard/flood_100'} className='legend-value'>
                                            ${numeral(flood_100_totalBuildingsValue).format('0,0.a')}
                                        </a>
                                    </h6>
                                </td>

                                <td>
                                    <h6>
                                        <a href={'list/ownerType/' + BuildingByOwnerTypeConfig.map(f => f.value).join('-') + '/hazard/flood_500'} className='legend-value'>
                                            {numeral(flood_500_totalBuildings).format('0,0.a')}
                                        </a>
                                    </h6>
                                </td>
                                <td>
                                    <h6>
                                        <a href={'list/ownerType/' + BuildingByOwnerTypeConfig.map(f => f.value).join('-') + '/hazard/flood_500'} className='legend-value'>
                                            ${numeral(flood_500_totalBuildingsValue).format('0,0.a')}
                                        </a>
                                    </h6>
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/*

                            <tbody>
                            {
                                buildingOwners.map((ownerType,i) =>{
                                    if(Object.keys(BuildingTypeData).length !== 0 ){
                                        if(BuildingTypeData[ownerType] !== undefined){

                                        }

                                    }

                                })
                            }
                            </tbody>

                        </table>
                    </div>
                    <div>
                    </div>
                    */}

                </Element>
            </div>
        )

    }

    render(){
        return(
            <div>
            {this.renderBuildingTable()}
            </div>
        )
    }

    static defaultProps = {
        buildingType : false
    }

}

const mapStateToProps = (state,ownProps) => {
    return {
        isAuthenticated: !!state.user.authed,
        activePlan: state.user.activePlan,
        data : get(state.graph,'building.byGeoid')
    }
};

const mapDispatchToProps =  {
    //sendSystemMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(BuildingByOwnerTypeTable))

/*
{
                                Object.values(this.props.data).forEach((item) =>{
                                    return (
                                    <tr>
                                        {
                                            buildingOwners.map((ownerType,i) =>{
                                                return(
                                                    <tr>
                                                        <td>{buildingOwnersType[i]}</td>
                                                        <td>{item.owner[ownerType].sum.count.value}</td>
                                                        <td>{item.owner[ownerType].sum.replacement_value.value}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tr>
                                    )
                                })
                            }
 */