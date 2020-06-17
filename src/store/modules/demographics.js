import { sendSystemMessage } from './messages';

import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
import {falcorGraph} from "../falcorGraph";
import {login, logout, setActiveCousubid, setActiveGeoid, setActivePlan, setUserToken} from "./user";

const SET_INDICATOR = 'USER::SET_INDICATOR';

function setIndicator(indicator) {
    return {
        type:SET_INDICATOR,
        indicator
    }

}



export const setActiveIndicator = (indicator) =>{
    return (dispatch) => {
        dispatch(setIndicator(indicator))
    }
};



export const actions = {
    setActiveIndicator
};

let initialState = {
    indicator:[],
};

const ACTION_HANDLERS = {

    [SET_INDICATOR]: (state =initialState, action) => {
        const newState = Object.assign({}, state)
        if(action.indicator) {
            newState.indicator = action.indicator;
            localStorage.setItem('indicator', newState.indicator);
        }
        return newState
    },


};

export default function landUseReducer(state = initialState, action) {

    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}