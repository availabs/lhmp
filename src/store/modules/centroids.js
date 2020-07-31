import { sendSystemMessage } from './messages';

import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
import {falcorGraph} from "../falcorGraph";
import {login, logout, setActiveCousubid, setActiveGeoid, setActivePlan, setUserToken} from "./user";

const SET_CENTROIDS = 'USER::SET_CENTROIDS'

function setCentroids(centroids){
    return {
        type : SET_CENTROIDS,
        centroids
    }
}


export const setActiveCentroids = (centroids) =>{
    return (dispatch) => {
        dispatch(setCentroids(centroids))
    }
};

export const actions = {
    setActiveCousubid
};

let initialState = {
    centroids:{},
};

const ACTION_HANDLERS = {

    [SET_CENTROIDS]: (state =initialState, action) => {
        const newState = Object.assign({}, state)
        if(action.centroids) {
            newState.centroids = action.centroids;
        }
        return newState
    },

};

export default function landUseReducer(state = initialState, action) {

    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}