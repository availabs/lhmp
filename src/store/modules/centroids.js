import { sendSystemMessage } from './messages';

import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
import {falcorGraph} from "../falcorGraph";
import {login, logout, setActiveCousubid, setActiveGeoid, setActivePlan, setUserToken} from "./user";

const SET_CENTROIDS = 'USER::SET_CENTROIDS'

function setCentroids(centroids, type){
    return {
        type : SET_CENTROIDS,
        centroids,
        centroidType: type
    }
}


export const setActiveCentroids = (centroids, type) =>{
    return (dispatch) => {
        dispatch(setCentroids(centroids, type))
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
            newState.type = action.centroidType;
        }
        return newState
    },

};

export default function landUseReducer(state = initialState, action) {

    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}