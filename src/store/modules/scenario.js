import { sendSystemMessage } from './messages';

import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
import {falcorGraph} from "../falcorGraph";
import {login, logout, setActiveCousubid, setActiveGeoid, setActivePlan, setUserToken} from "./user";

const SET_RISK_ZONE_ID = 'USER::SET_RISK_ZONE_ID';
const SET_RISK_ZONE_ID_OFF = 'USER::SET_RISK_ZONE_ID_OFF';

function setRiskZoneId(id) {
    return {
        type:SET_RISK_ZONE_ID,
        id
    }
}

function setRiskZoneIdOff(offId) {
    return {
        type:SET_RISK_ZONE_ID_OFF,
        offId
    }
}

export const setActiveRiskZoneId = (id) =>{
    return (dispatch) => {
        dispatch(setRiskZoneId(id))
    }
};

export const setActiveRiskZoneIdOff = (id) =>{
    return (dispatch) => {
        dispatch(setRiskZoneIdOff(id))
    }
};

export const actions = {

    setActiveRiskZoneId,
    setActiveRiskZoneIdOff

};

let initialState = {

    activeRiskZoneId:[],
    offRiskZoneId:[]

};

const ACTION_HANDLERS = {

    [SET_RISK_ZONE_ID]: (state =initialState, action) => {
        const newState = Object.assign({}, state)
        if(action.id) {
            newState.activeRiskZoneId = action.id;
            localStorage.setItem('riskZoneId', newState.activeRiskZoneId);
        }
        return newState
    },

    [SET_RISK_ZONE_ID_OFF] : (state =initialState, action) => {
        const newState = Object.assign({}, state);
        if(action.offId) {
            newState.offRiskZoneId = action.offId;
            localStorage.setItem('offRiskZoneId', newState.offRiskZoneId);
        }
        return newState
    }
};

export default function scenarioReducer(state = initialState, action) {

    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}