import { sendSystemMessage } from './messages';

import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
import {falcorGraph} from "../falcorGraph";
import {login, logout, setActiveCousubid, setActiveGeoid, setActivePlan, setUserToken} from "./user";

const SET_RISK_ZONE_ID = 'USER::SET_RISK_ZONE_ID'

function setRiskZoneId(id) {
    return {
        type:SET_RISK_ZONE_ID,
        id
    }
}

export const setActiveRiskZoneId = (id) =>{
    return (dispatch) => {
        dispatch(setRiskZoneId(id))
    }
};

export const actions = {

    setActiveRiskZoneId,

};

let initialState = {

    activeRiskZoneId:null,

};

const ACTION_HANDLERS = {

    [SET_RISK_ZONE_ID]: (state =initialState, action) => {
        const newState = Object.assign({}, state)
        if(action.id) {
            newState.activeRiskZoneId = action.id
            //localStorage.setItem('riskZoneId', newState.activeRiskZoneId);
        }
        return newState
    }
};

export default function scenarioReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}