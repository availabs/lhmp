import { sendSystemMessage } from './messages';

import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
import {falcorGraph} from "../falcorGraph";
import {login, logout, setActiveCousubid, setActiveGeoid, setActivePlan, setUserToken} from "./user";

const SET_LAND_USE_TYPE = 'USER::SET_LAND_USE_TYPE';
const SET_LAND_USE_PROP_TYPE = 'USER:SET_LAND_USE_PROP_TYPE'
const SET_LAND_USE_SUB_PROP_TYPE = 'USER::SET_LAND_USE_SUB_PROP_TYPE'
const SET_OWNER_TYPE = 'USER::SET_OWNER_TYPE';
function setLandUseType(landUseType) {
    return {
        type:SET_LAND_USE_TYPE,
        landUseType
    }

}

function setLandUsePropType(landUsePropType){
    return {
        type : SET_LAND_USE_PROP_TYPE,
        landUsePropType
    }
}

function setLandUseSubPropType(landUseSubPropType){
    return {
        type : SET_LAND_USE_SUB_PROP_TYPE,
        landUseSubPropType
    }
}
function setOwnerType(ownerType){
    return {
        type : SET_OWNER_TYPE,
        ownerType
    }
}


export const setActiveLandUseType = (landUseType) =>{
    return (dispatch) => {
        dispatch(setLandUseType(landUseType))
    }
};

export const setActiveLandUsePropType = (landUsePropType) =>{
    return (dispatch) => {
        dispatch(setLandUsePropType(landUsePropType))
    }
};

export const setActiveLandUseSubPropType = (landUseSubPropType) =>{
    return (dispatch) =>{
        dispatch(setLandUseSubPropType(landUseSubPropType))
    }
}

export const setActiveOwnerType = (ownerType) =>{
    return (dispatch) => {
        dispatch(setOwnerType(ownerType))
    }
};


export const actions = {
    setActiveLandUseType,
    setActiveLandUsePropType,
    setActiveLandUseSubPropType,
    setActiveOwnerType
};

let initialState = {
    landUseType:[],
    landUsePropType : [],
    LandUseSubPropType : [],
    ownerType:[]
};

const ACTION_HANDLERS = {

    [SET_LAND_USE_TYPE]: (state =initialState, action) => {
        const newState = Object.assign({}, state)
        if(action.landUseType) {
            newState.landUseType = action.landUseType;
            localStorage.setItem('landUseType', newState.landUseType);
        }
        return newState
    },

    [SET_LAND_USE_PROP_TYPE] :(state =initialState, action) => {
        const newState = Object.assign({}, state)
        if(action.landUsePropType) {
            newState.landUsePropType = action.landUsePropType;
            localStorage.setItem('landUsePropType', newState.landUsePropType);
        }
        return newState
    },

    [SET_LAND_USE_SUB_PROP_TYPE] : (state =initialState, action) => {
        const newState = Object.assign({}, state)
        if(action.landUseSubPropType) {
            newState.landUseSubPropType = action.landUseSubPropType;
            localStorage.setItem('landUseSubPropType', newState.landUseSubPropType);
        }
        return newState
    },
    [SET_OWNER_TYPE]: (state =initialState, action) => {
        const newState = Object.assign({}, state)
        if(action.ownerType) {
            newState.ownerType = action.ownerType;
            localStorage.setItem('ownerType', newState.ownerType);
        }
        return newState
    },

};

export default function landUseReducer(state = initialState, action) {

    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}