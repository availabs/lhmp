import { sendSystemMessage } from './messages';

import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
import {falcorGraph} from "../falcorGraph";
import {login, logout, setActiveCousubid, setActiveGeoid, setActivePlan, setUserToken} from "./user";

const SET_RISK_SCENARIO_ID = 'USER::SET_RISK_SCENARIO_ID';
const SET_RISK_ZONE_ID = 'USER::SET_RISK_ZONE_ID'
const SET_RISK_ZONE_ID_OFF = 'USER::SET_RISK_ZONE_ID_OFF';
const SET_NEW_ZONE = 'USER::SET_NEW_ZONE';

function setRiskScenarioId(id) {
    return {
        type:SET_RISK_SCENARIO_ID,
        id
    }
}
function setRiskZoneId(id){
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

function setNewZone(newZone){
    return {
        type :SET_NEW_ZONE,
        newZone
    }
}

export const setActiveRiskScenarioId = (id) =>{
    return (dispatch) => {
        dispatch(setRiskScenarioId(id))
    }
};

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

export const setActiveNewZone = (id) =>{
    return (dispatch) => {
        dispatch(setNewZone(id))
    }
};

export const actions = {

    setActiveRiskScenarioId,
    setActiveRiskZoneId,
    setActiveRiskZoneIdOff,
    setActiveNewZone

};

let initialState = {

    activeRiskZoneId:'',
    activeRiskScenarioId:[],
    offRiskZoneId:[],
    newZone:{}
};

const ACTION_HANDLERS = {

    [SET_RISK_SCENARIO_ID]: (state =initialState, action) => {
        const newState = Object.assign({}, state)
        if(action.id) {
            newState.activeRiskScenarioId = action.id;
            localStorage.setItem('riskScenarioId', newState.activeRiskScenarioId);
        }
        return newState
    },

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
    },

    [SET_NEW_ZONE] :(state =initialState, action) => {
        const newState = Object.assign({}, state);
        if(action.newZone) {
            newState.newZone = action.newZone;
            localStorage.setItem('newZone', newState.newZone);
        }
        return newState
    }
};

export default function scenarioReducer(state = initialState, action) {

    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}