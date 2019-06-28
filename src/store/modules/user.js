import { sendSystemMessage } from './messages';

import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
import {falcorGraph} from "../falcorGraph";
// ------------------------------------
// Constants
// ------------------------------------
const USER_LOGIN = 'USER::USER_LOGIN';
const USER_LOGOUT = 'USER::USER_LOGOUT';
const AUTH_FAILURE = 'USER::AUTH_FAILURE';
const SET_ACTIVE_PROJECT = 'USER::SET_ACTIVE_PROJECT'
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

function setActiveProject(user, planId=''){
  console.log('planId',planId)
  //console.log('user in setActiveProject',user)
  return {
    type: SET_ACTIVE_PROJECT,
    user,
    planId: planId
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

export const activateProject = ({user,planId}) => dispatch =>
  falcorGraph.get(['plans', 'county', 'authGroups', '{Fulton_County_HMP}', [3]]) //what if there are multiple plan id`s
      .then(response => {
        Object.values(response.json.plans.county.authGroups).forEach((res) => {
          planId = res['Fulton_County_HMP'].planId
        })
        if (localStorage) {
          console.log('in if')
          localStorage.setItem('planId', planId)
          dispatch(setActiveProject(planId.toString()))
        }
      })


    // falcor.get
    //['plan', 'authgroups', user.groups, 'planId']
      // -- should return like this
      // {
    //   'AVAIL': {planId: []}
    //   'Hamilton County': {planId: [3]}
    // }

    //reduce to flat array of planids
    // [3,5,6]

    //if localstorage planID
    // is set and is in legal plans
    // set planId to local storge
    //dispatch(setActiveProject(planId))


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
        console.log('res',res)
        dispatch(setActiveProject(res.user))
        dispatch(receiveAuthResponse(res.user));
      }
    });



export const auth = () => dispatch => {
  const token = getUserToken();
  console.log('auth attempt', token, `${AUTH_HOST}/auth`)
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
        console.log('auth happened')
        if (res.error) {
          dispatch({ type: AUTH_FAILURE });
          dispatch(sendSystemMessage(res.error));
        } else {
          // console.log('receiveAuthResponse', res.user)
         
          dispatch(receiveAuthResponse(res.user));
        }
      });
  } else {
    // return Promise.resolve();
    console.log('no auth')
    return dispatch({ type: AUTH_FAILURE });
  }
};

export const signup = email => dispatch => {
  return fetch(`${AUTH_HOST}/signup/request`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, project: AUTH_PROJECT_NAME })
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

export const resetPassword = ({ email }) => dispatch => {
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
    });
};

export const actions = {
  login,
  logout,
  activateProject
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
  activePlan: null
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
    const newState = initialState;
    ++newState.attempts;
    console.log('auth failter')
    return newState;
  },
  [USER_LOGOUT]: (state = initialState, action) => {
    removeUserToken();
    return initialState;
  },

  [SET_ACTIVE_PROJECT]: (state =initialState, action) => {
    console.log('action',action)
    console.log('state',state)
    // if action.planID && user.groups includes that project
    let newState = Object.assign({}, state)
    // state.activeProject = action.projectId
    // otherwise, active project = user.groups[0]
    return newState
  }

};

export default function userReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
