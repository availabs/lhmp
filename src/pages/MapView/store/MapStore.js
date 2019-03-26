import layers from '../layers'
import LightTheme from 'components/common/themes/dark'
// var update = require('react/lib/update')

// ------------------------------------
// Constants
// ------------------------------------
const ACTIVATE_LAYER = 'ACTIVATE_LAYER'
const INITIALIZE_MAP = 'INITIALIZE_MAP'
const FETCH_LAYER_DATA = 'FETCH_LAYER_DATA'
const FETCH_LAYER_DATA_SUCESS = 'FETCH_LAYER_DATA_SUCESS'
const FETCH_LAYER_DATA_ERROR = 'FETCH_LAYER_DATA_ERROR'
// ------------------------------------
// Actions
// ------------------------------------

export const activateLayer = layerName => {
  return dispatch =>
    (dispatch({
      type: ACTIVATE_LAYER,
      layerName
    }),
    Promise.resolve())
    .then(() => dispatch(fetchLayerData(layerName)))
   
}

export const initializeMap = map => {
  return dispatch => {
    return dispatch({
      type: INITIALIZE_MAP,
      map
    })
  }
}

export const receiveData = (data,layerName) => {
  return dispatch => {
    return dispatch({
      type: FETCH_LAYER_DATA_SUCESS,
      data,
      layerName
    })
  }
}

export const fetchLayerData = (layerName) => {
  return  (dispatch, getState) => {
    if(getState().map.layers[layerName].fetchData) {
      return (dispatch({
        type: FETCH_LAYER_DATA,
        layerName
      }),Promise.resolve()).then(()=> {
        return getState().map.layers[layerName].fetchData(getState().map.layers[layerName])
        .then(data => {
          dispatch(receiveData(data,layerName))
        })
      })
    } else {
      console.warn(`Layer ${layerName} does not define fetchData`)
      return Promise.resolve();
    }
  }
}

// export const fetchLayerData = (layerName) => {
//   return dispatch => {
//     // console.log('----- USER LOGIN -----');
    
//     return fetch(`${HOST}login/auth`, {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json, text/plain, */*',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ email: user.email, password: user.password, token: user.token })
//     })
//       .then(response => response.json())
//       .then(json => dispatch(receiveAuthResponse(json.message || json)));
//   };
// };



// -------------------------------------
// Initial State
// -------------------------------------

let initialState = {
  layers,
  map: null,
  activeRange: ['#b11021','#dc6147','#f4ae8c','#9bd0ea','#479acf','#2266b2'],
  activeDomain: [10,20,30,40,55],
  loadingTMC: false,
  theme: LightTheme,
  update: 0
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ACTIVATE_LAYER]: (state = initialState, action) => {
    let newState = Object.assign({}, state);
    if(state.map){
      let newLayer = newState.layers[action.layerName]
      if(newLayer.onAdd){
        newLayer.onAdd(newLayer, state.map)
      }
      newLayer.active = true
    }
    newState.update += 1; // hack to force update on deep props
    return newState;
  },
  [INITIALIZE_MAP]: (state = initialState, action) => {
    let newState = Object.assign({}, state);
    newState.map = action.map
    return newState;
  },
  [FETCH_LAYER_DATA]: (state = initialState, action) => {
    let newState = Object.assign({}, state);
    newState.layers[action.layerName].loading = true;
    return newState;
  },
  [FETCH_LAYER_DATA_SUCESS]: (state = initialState, action) => {
    let newState = Object.assign({}, state);
    newState.layers[action.layerName].loading = false;
    if(state.map) {
      newState.layers[action.layerName].receiveData(action.data, state.map, state.activeRange, state.activeDomain)
    }
    return newState;
  },
};

export default function TigMapReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  console.log('handler', action.type)
  return handler ? handler(state, action) : state;
}