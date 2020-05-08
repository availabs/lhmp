import { sendSystemMessage } from './messages';

import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
import {falcorGraph} from "../falcorGraph";
import {login, logout, setActiveCousubid, setActiveGeoid, setActivePlan, setUserToken} from "./user";

const SET_LAND_USE_TYPE = 'USER::SET_LAND_USE_TYPE';

function setLandUseType(landUseType) {
    return {
        type:SET_LAND_USE_TYPE,
        landUseType
    }

}

export const setActiveLandUseType = (landUseType) =>{
    return (dispatch) => {
        dispatch(setLandUseType(landUseType))
    }
};


export const actions = {
    setActiveLandUseType
};

let initialState = {
    landUseType:[]
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


};

export default function landUseReducer(state = initialState, action) {

    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}