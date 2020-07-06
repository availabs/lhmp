import {applyMiddleware, combineReducers, createStore} from 'redux'
import {routerMiddleware, routerReducer} from 'react-router-redux'
import {reducer as graph} from 'utils/redux-falcor';
import {AvlInTheMiddle} from "components/AvlMap/ReduxMiddleware"
/*import {AvlInTheMiddle} from "avlmap-npm/ReduxMiddleware";
import {AvlInTheMiddle} from 'store/modules/ReduxMiddleware'*/
import user from './modules/user'
import geo from './modules/geo'
import scenario from "./modules/scenario";
import landUse from "./modules/landUse";
import demographics from "./modules/demographics";
import messages from "./modules/messages"
import hazardEvents from "./modules/hazardEvents";
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'

// if (process.env.NODE_ENV === 'development') {
//   const devToolsExtension = window.devToolsExtension;

//   if (typeof devToolsExtension === 'function') {
//     enhancers.push(devToolsExtension());
//   }
// }

const history = createHistory({})

// Build the middleware for intercepting and dispatching navigation actions
const middleware = [
    routerMiddleware(history),
    thunk,
    AvlInTheMiddle
]


const store = createStore(
    combineReducers({
        user,
        geo,
        scenario,
        landUse,
        demographics,
        messages,
        graph,
        hazardEvents,
        router: routerReducer
    }),
    applyMiddleware(...middleware)
)

export default store
export {
    history
}
