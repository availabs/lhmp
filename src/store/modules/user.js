import { sendSystemMessage } from './messages';

import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
import {falcorGraph} from "../falcorGraph";
import geo from "./geo";
import withRouter from "react-router/es/withRouter";
// ------------------------------------
// Constants
// ------------------------------------
const PROJECT_HOST = window.location.hostname.split('.').length > 1?
    window.location.hostname.split('.')[1].toLowerCase() + '.org' :'mitigateny.org'
let SUBDOMAIN = window.location.hostname.split('.').length > 1?
    window.location.hostname.split('.')[0].toLowerCase() : 'www'
const DEFAULT_GROUP = 'Hazard Mitigation General'
const USER_LOGIN = 'USER::USER_LOGIN';
const USER_LOGOUT = 'USER::USER_LOGOUT';
const AUTH_FAILURE = 'USER::AUTH_FAILURE';
//const SET_ACTIVE_PROJECT = 'USER::SET_ACTIVE_PROJECT'
const SET_PLANS_AUTH = 'USER::SET_PLANS_AUTH'
const SET_USER_AUTH = 'USER::SET_USER_AUTH'
const SET_PLANS_GEOID = 'USER::SET_PLANS_GEOID'
const SET_COUSUBID = 'USER::SET_COUSUBID'
const SIGNUP_SUCCESS = 'USER::SIGNUP_SUCCESS'
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

function setPlanAuth(planId,authedPlans,groupName){
  return {
    type: SET_PLANS_AUTH,
    planId,
    authedPlans,
    groupName
  }
}

function setUserAuthLevel(authLevel){
    //console.log('hey im here', authLevel)
  return {
    type: SET_USER_AUTH,
    authLevel
  }
}

function setPlanGeoid(geoid, planid){
    /*
    console.log('setPlanGeoid', {
        type: SET_PLANS_GEOID,
        geoid,
        planid
    })
    */
    return {
    type: SET_PLANS_GEOID,
    geoid,
        planid
  }
}

function setCousubid(id){
    return {
    type: SET_COUSUBID,
    id
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

export const setUserToken = user => {
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

const removeUserPlanInfo = () => {
  if (localStorage) {
    localStorage.removeItem('planId');
    localStorage.removeItem('geoId');
    localStorage.removeItem('authedPlans');
    localStorage.removeItem('authLevel');
  }
  //setActiveProject=-p
};

export const authProjects = (user) => {
    //console.log('authProjects started', user)
  return (dispatch) => {
    let groups = user.groups;
    let subdomain =  window.location.hostname.split('.').length > 1?
        window.location.hostname.split('.')[0].toLowerCase() : 'www';
    SUBDOMAIN = subdomain;
    falcorGraph.get(['plans', 'authGroups',groups , 'plans']) //what if there are multiple plan id`s
        .then(response => {
          let groupName = [];
          let authLevel = null;
            //console.log('uer object', user)
          let allPlans = Object.values(response.json.plans.authGroups).filter( d => d !== '$__path')
              .reduce((output, group) => {
                if(group.plans && group.plans.length > 0) output.push(group.plans)
                //console.log('group',group.plans)
                return output
              }, [])


          let AuthedPlans = []; //allPlans.length > 0 ? [...new Set(...allPlans)] : [null];
          allPlans.map(f =>
              f.map(f_1 => {
                if (AuthedPlans.indexOf(f_1) === -1) AuthedPlans.push(f_1)
              })
          );
          //console.log('authed plans in user:authProjects', AuthedPlans)
          falcorGraph.get(['plans','county','bySubdomain', [subdomain], 'id'])
              .then(planData => {

                let planId =  planData.json.plans.county.bySubdomain[subdomain] ? 
                planData.json.plans.county.bySubdomain[subdomain].id : 63; // also in authGeoid
                //if (AuthedPlans.includes(planId.toString())){
                  Object.keys(response.json.plans.authGroups)
                      .filter( d => d !== '$__path')
                      .map(groupNames => {
                        // instead, get all groups with this planId and fetch the highest auth group
                        if (response.json.plans.authGroups[groupNames].plans &&
                            response.json.plans.authGroups[groupNames].plans.includes(planId.toString())){
                          groupName.push(groupNames)
                        }
                      })

                  Object.keys(user.meta)
                      //.filter(f => {console.log('---', user.meta[f].group, groupName); return user.meta[f].group})
                      .filter(f => groupName.includes(user.meta[f].group))
                      .map((f,f_i) => {
                          if (f_i > 0 ) {
                              if (user.meta[f].authLevel > user.meta[f_i-1].authLevel) {
                                  groupName = user.meta[f].group;
                                  authLevel = user.meta[f].authLevel
                              }
                          }
                      else {
                          groupName = user.meta[f].group;
                          authLevel = user.meta[f].authLevel
                          }
                      })

                  if(typeof groupName === 'object') {
                      Object.keys(user.meta)
                          .map((f,f_i) => {
                              if ( f_i > 0) {
                                  if (user.meta[f].authLevel > user.meta[f_i-1].authLevel) {
                                      groupName = user.meta[f].group;
                                      authLevel = user.meta[f].authLevel
                                  }
                              } else {
                                  groupName = user.meta[f].group;
                                  authLevel = user.meta[f].authLevel
                              }
                          })
                  }
                  if (!planId) planId = localStorage.getItem('planId');
                  //console.log('planid, groupname, authLevel', planId, groupName, authLevel);
                  // console.log('planid, groupname, authLevel', planId, groupName, authLevel);
                  dispatch(setPlanAuth(planId,AuthedPlans, groupName));
                  dispatch(setUserAuthLevel(authLevel));
              })
        })
      //console.log('authProjects ended', user)
  }
}

export const authGeoid = (user) => {
    //console.log('authGeoidstarted', user, localStorage)
    // console.log('authGeoidstarted', user, localStorage)
    return (dispatch) => {
    if ((user && user.activePlan) || (localStorage && localStorage.getItem('planId'))) { //localStorage && localStorage.getItem('planId')
      let planId = user && user.activePlan ? user.activePlan : localStorage.getItem('planId');
        falcorGraph.get(
          ['plans','county','byId',[planId], ['fips']]
        )
          .then(geo_response => {
            let geoid = geo_response.json.plans.county.byId[planId]['fips'];
              //console.log('geoid set to', geoid)
              // console.log('geoid set to', geoid)
            dispatch(setPlanGeoid(geoid))
          })
    }else{
        let subdomain =  window.location.hostname.split('.').length > 1?
            window.location.hostname.split('.')[0].toLowerCase() : 'www';
        SUBDOMAIN = subdomain;
        return falcorGraph.get(['plans','county','bySubdomain', [subdomain], 'id'])
            .then(planData => {

                let planId = planData.json.plans.county.bySubdomain[subdomain] ?
                    planData.json.plans.county.bySubdomain[subdomain].id : 63; //also in authProjects
                return falcorGraph.get(
                    ['plans','county','byId',[planId], ['fips']]
                )
                    .then(geo_response => {
                        let geoid = geo_response.json.plans.county.byId[planId]['fips'];
                        //console.log('geoid set to', geoid)
                        // console.log('geoid set to', geoid)
                        dispatch(setPlanGeoid(geoid, planId))
                        return geo_response
                    })
            })
    }
  }
}

export const setActivePlan = (user) =>{
  //console.log('setActivePlan', user)
  return (dispatch) =>{
    dispatch(setPlanAuth(user))
  }
}

export const setActiveGeoid = (user) =>{
    return (dispatch) =>{
    dispatch(setPlanGeoid(user))
  }
}

export const setActiveCousubid = (id) =>{
    return (dispatch) =>{
    dispatch(setCousubid(id))
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
  //console.log('auth attempt', token)
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
        //console.log('auth happened', res)
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
      dispatch(authGeoid());
      return dispatch({ type: AUTH_FAILURE });
  }
};

export const signup = ({email, group}) => dispatch => {
    SUBDOMAIN =  window.location.hostname.split('.').length > 1?
        window.location.hostname.split('.')[0].toLowerCase() : 'www';

    if (!group) group = DEFAULT_GROUP;

    return fetch(`${AUTH_HOST}/signup/request`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, addToGroup: group, project: AUTH_PROJECT_NAME , host: 'http://' + SUBDOMAIN + '.' + PROJECT_HOST, url: '/password/set'})
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        dispatch(sendSystemMessage(res.error))
      } else {
        dispatch({ type: SIGNUP_SUCCESS })
        dispatch(sendSystemMessage(res.message));
      }

      return res;
    });
};

export const resetPassword = ({ email }) => dispatch => {
  return fetch(`${AUTH_HOST}/password/reset`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email , project_name: AUTH_PROJECT_NAME, host: 'http://' + SUBDOMAIN + '.' + PROJECT_HOST, url: '/password/set'})
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
  return fetch(`${AUTH_HOST}/signup/request/verify`, {
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
  setActiveGeoid,
  setActiveCousubid,

};

// -------------------------------------
// Initial State
// -------------------------------------
let initialState = {
  token: null,
  groups: [],
  authLevel: localStorage.getItem('authLevel') || 0,
  authed: false,
  attempts: 0,
    // todo: security concern
  activePlan: localStorage.getItem('planId') || null,
  authedPlans: localStorage.getItem('authedPlans') || [],
  activeGeoid: localStorage.getItem('geoId') || null,
  activeCousubid: localStorage.getItem('cousubId') || null,
  activeGroup: null,
  signupComplete: false
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [USER_LOGIN]: (state = initialState, action) => {
    //console.log('user login', action)
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
    removeUserPlanInfo();
    return {...initialState};
  },

  [SET_PLANS_AUTH]: (state =initialState, action) => {
    //console.log('in planAuth', action)
    const newState = Object.assign({}, state)
    if(action.authedPlans) {
      newState.authedPlans = action.authedPlans
      localStorage.setItem('authedPlans', action.authedPlans)
    }
    if(action.groupName){
      //console.log('setting auth plan and group', action)
      newState.activeGroup = action.groupName
    }
    if( action.planId
        //Object.values(newState.authedPlans).includes(action.planId)
    ) {
      //console.log('new plan id: set activeGroup here', action)
      newState.activePlan = action.planId
      localStorage.setItem('planId', newState.activePlan)
    }
    //console.log('new state after plans_auth', newState, action)
    return newState
  },

   [SET_USER_AUTH]: (state =initialState, action) => {
    //console.log('in userAuth', action)
    const newState = Object.assign({}, state)
    if(action.authLevel !== null) {
        //console.log('in userAuth setting authLevel', action.authLevel)
        newState.authLevel = action.authLevel
        localStorage.setItem('authLevel', action.authLevel)
    }
    return newState
  },

  [SET_PLANS_GEOID]: (state =initialState, action) => {
    const newState = Object.assign({}, state)
    if(action.geoid) {
      newState.activeGeoid = action.geoid
      localStorage.setItem('geoId', newState.activeGeoid);

        newState.activeCousubid = action.geoid
        localStorage.setItem('cousubId', newState.geoid);
    }
      if( action.planid
          //Object.values(newState.authedPlans).includes(action.planId)
      ) {
          //console.log('new plan id: set activeGroup here', action)
          newState.activePlan = action.planid
          localStorage.setItem('planId', newState.activePlan)
      }
    return newState
  },

    [SET_COUSUBID]: (state =initialState, action) => {
      //console.log('cousubId setting', action.id)
    const newState = Object.assign({}, state)
    if(action.id) {
      newState.activeCousubid = action.id
      localStorage.setItem('cousubId', newState.activeCousubid);
    }
    return newState
    },

  [SIGNUP_SUCCESS]: (state =initialState, action) => {
    const newState = Object.assign({}, state)
    newState.signupComplete = true
    return newState
  },
};

export default function userReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
