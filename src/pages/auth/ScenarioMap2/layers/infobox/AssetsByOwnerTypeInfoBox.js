import React from 'react';
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import config from 'pages/auth/Roles/roles_forms/config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"

class AssetsByOwnerTypeInfoBox extends React.Component{
    constructor(props){
        super(props);
    }

    fetchFalcorDeps(){
        let owner_types = ['2','3', '4', '5', '6', '7','8'];
        return this.props.falcor.get(['building','byGeoid',this.props.activeGeoid,
            ['ownerType'],owner_types,['flood_100','flood_500'],'sum',['count','replacement_value']])
            .then(response =>{
                return response
            })
    }

    processAssetsData(){
        let flood_100_count_muni = 0,
            flood_100_value_muni = 0,
            flood_500_count_muni = 0,
            flood_500_value_muni = 0;
        let graph = this.props.assetsData;
        let resultData = [];
        if(Object.keys(graph).length > 0){
            let buildingDataByOwnerTypeByFloodType = graph[this.props.activeGeoid].ownerType
            Object.keys(buildingDataByOwnerTypeByFloodType).forEach(owner =>{
                if(owner === '2'){
                    resultData.push({
                        'owner': 'State',
                        'pin_color':'#0d1acc',
                        'flood_100_count':buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.count.value || 0,
                        'flood_100_value':buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.replacement_value.value || 0,
                        'flood_500_count':buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.count.value || 0,
                        'flood_500_value':buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.replacement_value.value || 0
                    })
                }
                if(owner === '3'){
                    resultData.push({
                        'owner': 'County',
                        'pin_color':'#0fcc1b',
                        'flood_100_count':buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.count.value || 0,
                        'flood_100_value':buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.replacement_value.value || 0,
                        'flood_500_count':buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.count.value || 0,
                        'flood_500_value':buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.replacement_value.value || 0
                    })
                }
                if(['4', '5', '6', '7'].includes(owner)){
                    flood_100_count_muni += parseInt(buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.count.value)
                    flood_100_value_muni += parseFloat(buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.replacement_value.value)
                    flood_500_count_muni += parseInt(buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.count.value)
                    flood_500_value_muni += parseFloat(buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.replacement_value.value)

                }
                if(owner === '8'){
                    resultData.push({
                        'owner': 'Private',
                        'pin_color':'#F3EC16',
                        'flood_100_count':buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.count.value || 0,
                        'flood_100_value':buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.replacement_value.value || 0,
                        'flood_500_count':buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.count.value || 0,
                        'flood_500_value':buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.replacement_value.value || 0
                    })
                }

            })
            resultData.push({
                'owner': 'Municipality',
                'pin_color':'#cc1e0a',
                'flood_100_count':flood_100_count_muni || 0,
                'flood_100_value':flood_100_value_muni || 0,
                'flood_500_count':flood_500_count_muni || 0,
                'flood_500_value':flood_500_value_muni || 0
            })
            return resultData

        }
    }

    render(){
        let resultData = this.processAssetsData()
        return (
            <div>
                <table className='table table-sm table-hover'>
                    <thead>
                    <tr>
                        <th>Owner Type</th>
                        <th># Flood 100</th>
                        <th>Est. Replacement $</th>
                        <th># Flood 500</th>
                        <th>Est. Replacement $</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        resultData ?
                            (resultData).map(item =>{
                                return (
                                    <tr>
                                        <td>
                                            <div className='el-legend'>
                                                <div className='legend-value-w'>
                                                    <div className='legend-pin' style={{'background-color': item.pin_color}}/>{item.owner}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item.flood_100_count}</td>
                                        <td>{fnum(item.flood_100_value)}</td>
                                        <td>{item.flood_500_count}</td>
                                        <td>{fnum(item.flood_500_value)}</td>
                                    </tr>
                                )
                            })
                            :
                            null

                    }
                    </tbody>
                    {/*<tfoot><tr style={{fontWeight: 600}}><td>Total</td><td>{totalNum}</td><td>{fnum(totalEst)}</td><td>{fnum(totalFEMA)}</td></tr></tfoot>*/}
                </table>
            </div>
        )
    }
}

const mapStateToProps = state => (
    {
        activePlan : state.user.activePlan,
        activeGeoid:state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        assetsData : get(state.graph,['building','byGeoid'],{})
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsByOwnerTypeInfoBox))