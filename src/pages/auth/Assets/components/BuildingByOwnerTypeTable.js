import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "../../../../store/falcorGraph";
var numeral = require('numeral');
const buildingOwners = [1,2,3,4,5,6,7,8,9,10,-999];
const buildingOwnersType = ['Federal','State','County','City','Town','Village','Mixed Government','Private','Public School District or BOCES','Road right of way','Unknown']
let totalBuildings = 0;
let totalBuildingsValue = 0;
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
        return this.props.falcor.get(['building','byGeoid',this.props.geoid,'ownerType',buildingOwners,'sum',['count','replacement_value']])
            .then(response => {
                return response
        })
    }

    buildingTable(){
        let BuildingTypeData = [];
        let geoid = this.props.geoid.map((geoid) => geoid);
        if(this.props.data !== undefined && this.props.data[geoid] !== undefined && this.props.buildingType)
        {
            let graph = this.props.data[geoid].ownerType
            if(graph && Object.keys(graph).length === buildingOwners.length){
                Object.keys(graph).forEach((item,i) =>{
                    BuildingTypeData.push({
                        'owner':buildingOwnersType[i],
                        'replacement_value':numeral(parseInt(graph[item].sum.replacement_value.value)).format('0,0.a') ||0,
                        'count':numeral(parseInt(graph[item].sum.count.value)).format('0,0.a') || 0
                    })
                    totalBuildings += parseInt(graph[item].sum.replacement_value.value) || 0;
                    totalBuildingsValue += parseInt(graph[item].sum.count.value) || 0;
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
                                <th># BUILDING TYPE</th>
                                <th>$ REPLACEMENT VALUE</th>
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
                                                        <div className='legend-pin' style={{'background-color': colors[i]}}/>
                                                        <div className='legend-value'>&nbsp;{data.owner}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{data.count || 0}</td>
                                            <td>${data.replacement_value || 0}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                            <tfoot>
                            <tr>
                                <td><h6>Total :</h6></td>
                                <td><h6>{numeral(totalBuildings).format('0,0.a')}</h6></td>
                                <td><h6>${numeral(totalBuildingsValue).format('0,0.a')}</h6></td>
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
    //console.log('state',state)
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