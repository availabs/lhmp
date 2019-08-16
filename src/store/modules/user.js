import { sendSystemMessage } from './messages';

import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
import {falcorGraph} from "../falcorGraph";
import geo from "./geo";
import withRouter from "react-router/es/withRouter";
// ------------------------------------
// Constants
// ------------------------------------
const PROJECT_HOST = 'localhost:3000'
const DEFAULT_GROUP = 'Hazard Mitigation General'
const USER_LOGIN = 'USER::USER_LOGIN';
const USER_LOGOUT = 'USER::USER_LOGOUT';
const AUTH_FAILURE = 'USER::AUTH_FAILURE';
//const SET_ACTIVE_PROJECT = 'USER::SET_ACTIVE_PROJECT'
const SET_PLANS_AUTH = 'USER::SET_PLANS_AUTH'
const SET_PLANS_GEOID = 'USER::SET_PLANS_GEOID'
// const RESET_PASSWORD = 'USER::RESET_PASSWORD';

// ------------------------------------
// Actions
// ------------------------------------
function receiveAuthResponse(user) {
  return {
    type: USER_LOGIN,
    user
  };
}

/*
function setActiveProject(planId){
  //console.log('planId',planId)
  //console.log('user in setActiveProject',user)
  return {
    type: SET_ACTIVE_PROJECT,
    planId
  }
}
 */

function setPlanAuth(planId,authedPlans,){
  return {
    type: SET_PLANS_AUTH,
    planId,
    authedPlans
  }
}

function setPlanGeoid(geoid){
  return {
    type: SET_PLANS_GEOID,
    geoid
  }
}

// function TODO_AuthServerVerifiesToken(user) {
// return {
// type: USER_LOGIN,
// res: user // temp hack till auth server takes tokens
// };
// }

export function logout() {
  return {
    type: USER_LOGOUT
  };
}

const setUserToken = user => {
  if (localStorage) {
    // localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('userToken', user.token);
  }
};
const getUserToken = user => {
  if (localStorage) {
    return localStorage.getItem('userToken');
  }
  return null;
};
const removeUserToken = () => {
  if (localStorage) {
    localStorage.removeItem('userToken');
  }
  //setActiveProject=-p
};


export const authProjects = (user) => {
  return (dispatch) => {
    let groups = user.groups
    falcorGraph.get(['plans', 'authGroups',groups , 'plans']) //what if there are multiple plan id`s
        .then(response => {
          let allPlans = Object.values(response.json.plans.authGroups).filter( d => d !== '$__path')
              .reduce((output, group) => {
                output.push(group.plans)
                return output
              }, [])
          // make plan ids unique by magic
          let AuthedPlans = [...new Set(allPlans[1])];
          if (localStorage) {
            let planId = localStorage.getItem('planId') ?
                localStorage.getItem('planId') :
                AuthedPlans[0]
            dispatch(setPlanAuth(planId,AuthedPlans))
          }
        })
  }
}

export const authGeoid = (user) => {
  return (dispatch) => {
    let groups = user.groups
    if (localStorage && localStorage.getItem('planId')) {
      let planId = localStorage.getItem('planId');
      falcorGraph.get(
          ['plans','county','byId',planId, ['fips']])
          .then(geo_response => {
            let geoid = localStorage.getItem('geoId') ?
                localStorage.getItem('geoId') :
                geo_response.json.plans.county.byId[planId]['fips'];
            dispatch(setPlanGeoid(geoid))
          })
    }

  }
}

export const setActivePlan = (user) =>{
  return (dispatch) =>{
    dispatch(setPlanAuth(user))
  }
}

export const setActiveGeoid = (user) =>{
  return (dispatch) =>{
    dispatch(setPlanGeoid(user))
  }
}

export const login = ({ email, password }) => dispatch =>
  fetch(`${AUTH_HOST}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, project: AUTH_PROJECT_NAME })
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        dispatch({ type: AUTH_FAILURE });
        dispatch(sendSystemMessage(res.error));
      } else {
        dispatch(authProjects(res.user))
        dispatch(authGeoid(res.user))
        dispatch(receiveAuthResponse(res.user));
      }
    });



export const auth = () => dispatch => {
  const token = getUserToken();
  //console.log('auth attempt', token, `${AUTH_HOST}/auth`)
  if (token) {
    return fetch(`${AUTH_HOST}/auth`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, project: AUTH_PROJECT_NAME })
    })
      .then(res => res.json())
      .then(res => {
        //console.log('auth happened')
        if (res.error) {
          dispatch({ type: AUTH_FAILURE });
          dispatch(sendSystemMessage(res.error));
        } else {
          dispatch(authProjects(res.user));
          dispatch(authGeoid(res.user));
          dispatch(receiveAuthResponse(res.user));
        }
      });
  } else {
    // return Promise.resolve();
    //console.log('no auth')
    return dispatch({ type: AUTH_FAILURE });
  }
};

export const signup = email => dispatch => {
  localStorage.setItem('signedUp', false)
  console.log('came in signup on client', email)
  return fetch(`${AUTH_HOST}/signup/request`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, project: AUTH_PROJECT_NAME , addToGroup: DEFAULT_GROUP, host: PROJECT_HOST, url: '/reset-password'})
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        localStorage.setItem('signedUp', true)
        dispatch(sendSystemMessage(res.error))
      } else {
        localStorage.setItem('signedUp', false)
        dispatch(sendSystemMessage(res.message));
      }
      localStorage.setItem('signedUp', false)

      return res;
    });
};

export const resetPassword = ({ email }) => dispatch => {
  console.log('came in resetPassword on client', email)
  return fetch(`${AUTH_HOST}/password/reset`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        dispatch(sendSystemMessage(res.error));
      } else {
        dispatch(sendSystemMessage(res.message));
      }
      localStorage.setItem('signedUp', true)
    });
};

export const setPassword = ({ token, password }) => dispatch => {
  console.log('came in setPassword on client', token, password)
  return fetch(`${AUTH_HOST}/password/set`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token, password })
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        dispatch(sendSystemMessage(res.error));
      } else {
        dispatch(sendSystemMessage(res.message));
      }
    });
};

// call passwordSet with token from url

export const actions = {
  login,
  logout,
  setActivePlan,
  setActiveGeoid
};

// -------------------------------------
// Initial State
// -------------------------------------
let initialState = {
  token: null,
  groups: [],
  authLevel: 0,
  authed: false,
  attempts: 0,
  activePlan: null,
  authedPlans: [],
  activeGeoid: null
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [USER_LOGIN]: (state = initialState, action) => {
    const newState = Object.assign({}, state, action.user, { authed: true });
    ++newState.attempts;
    setUserToken(action.user);
    return newState;
  },
  [AUTH_FAILURE]: (state = initialState, action) => {
    removeUserToken();
    const newState = {...initialState};
    ++newState.attempts;
    return newState;
  },
  [USER_LOGOUT]: (state = initialState, action) => {
    removeUserToken();
    return {...initialState};
  },

  [SET_PLANS_AUTH]: (state =initialState, action) => {
    const newState = Object.assign({}, state)
    if(action.authedPlans) {
      newState.authedPlans = action.authedPlans
    }
    if(Object.values(newState.authedPlans).includes(action.planId)) {
      newState.activePlan = action.planId
      localStorage.setItem('planId', newState.activePlan)
    }
    return newState
  },

  [SET_PLANS_GEOID]: (state =initialState, action) => {
    const newState = Object.assign({}, state)
    if(action.geoid) {
      newState.activeGeoid = action.geoid
      localStorage.setItem('geoId', newState.activeGeoid)
    }
    return newState
  }

};

export default function userReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
