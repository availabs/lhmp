import React from 'react';
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import config from 'pages/auth/Roles/roles_forms/config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import {setActiveLandUseType} from "store/modules/landUse"
import SearchableDropDown from "../components/searchableDropDown";

class LandUseControl extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            land_use:[]
        }
        this.addLandUseLayer = this.addLandUseLayer.bind(this,true)
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(['parcel', 'meta', ['prop_class', 'owner_type']])
            .then(response => {
                return response
            })
    }

    landUseDropDown() {
        if (Object.keys(this.props.parcelsMeta).length > 0){
            let prop_class_meta = get(this.props.parcelsMeta, ['prop_class', 'value'], [])
            let owner_class_meta = get(this.props.parcelsMeta, ['owner_type', 'value'], [])
            let prop_class_data = []
            let land_use_drop_down = []
            prop_class_meta.map(item => {
                if (parseInt(item.value) % 100 === 0) {
                    prop_class_data.push(item)
                }
            })

            land_use_drop_down.push(
                {
                    label: 'Owner Type',
                    value: owner_class_meta
                },
                {
                    label: 'Land Use Type',
                    value: prop_class_data
                },
                {
                    label: 'Property Value',
                    value: []
                },
            )

            return land_use_drop_down
        }

    }

    addLandUseLayer(){
        if(this.props.layer.layer.landUseLayer) {
            if(this.props.layer.layer.landUseLayer.map.getZoom() < 13){
                this.props.layer.layer.mainLayerToggleVisibilityOff(["landUse"])
                return (
                    <Element>
                        <h6>For Land Use, Select a type and zoom in</h6>
                    </Element>
                )
            }else{
                if(this.props.layer.layer.landUseLayer.map.getZoom() >=13){
                    this.props.layer.layer.mainLayerToggleVisibilityOn(["landUse"])
                }
            }
        }else {
            return null
        }
    }


    render() {
        let land_use_list = this.landUseDropDown()

        if (land_use_list && land_use_list.length > 0) {
            return (
                <div style={{height:'100px'}}>
                    <SearchableDropDown
                        data={land_use_list}
                        placeholder={'Select a Type'}
                        value={land_use_list.filter(d => d.value === this.state.land_use)[0]}
                        onChange={(value) => {
                            land_use_list.forEach(item =>{
                                if(item.value === value){
                                    this.props.setActiveLandUseType([{name:item.label,value:item.value}])
                                }
                            })

                        }}
                    />
                    {
                        <div>
                            {this.addLandUseLayer(true)}
                        </div>

                    }
                </div>
            )
        } else {
            return (
                <div>
                    Loading..
                </div>
            )
        }
    }

}

const mapStateToProps = state => (
    {
        activePlan : state.user.activePlan,
        activeGeoid:state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
       parcelsMeta: get(state.graph,['parcel','meta'],{})
    });

const mapDispatchToProps = {
    sendSystemMessage,
    setActiveLandUseType
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(LandUseControl))