import { sendSystemMessage } from './messages';

import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
import {falcorGraph} from "../falcorGraph";
import {login, logout, setActiveCousubid, setActiveGeoid, setActivePlan, setUserToken} from "./user";

const SET_YEAR = 'USER::SET_YEAR';
const SET_HAZARD = 'USER::SET_HAZARD'

function setYear(id) {
    return {
        type:SET_YEAR,
        id
    }
}
function setHazard(id){
    return {
        type:SET_HAZARD,
        id
    }
}




export const setActiveYear = (id) =>{
    return (dispatch) => {
        dispatch(setYear(id))
    }
};

export const setActiveHazard = (id) =>{
    return (dispatch) => {
        dispatch(setHazard(id))
    }
};

export const actions = {
    setActiveYear,
    setActiveHazard
};

let initialState = {
    activeYear: '',
    activeHazard: undefined
};

const ACTION_HANDLERS = {

    [SET_YEAR]: (state =initialState, action) => {
        const newState = Object.assign({}, state)
        if(action.id) {
            newState.activeYear = action.id;
            localStorage.setItem('hazardEventsYear', newState.activeYear);
        }
        return newState
    },

    [SET_HAZARD]: (state =initialState, action) => {
        const newState = Object.assign({}, state)
        if(action.id) {
            newState.activeHazard = action.id;
            localStorage.setItem('hazardEventsHazard', newState.activeHazard);
        }
        return newState
    }
};

export default function scenarioReducer(state = initialState, action) {

    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}