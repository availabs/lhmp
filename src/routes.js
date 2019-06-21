
// -- Landing Routes
import Landing from './pages/Landing'

// import PublicPlan from './pages/PublicPlan'
import RiskMap from './pages/riskmap'
import Home from 'pages/auth/Home';
import ActionsIndex from 'pages/auth/actions/worksheet/actions'
import ActionsView from 'pages/auth/actions/worksheet/view'
import ActionWorksheet from 'pages/auth/actions/worksheet/new'

// -- Util Routes
import Login from './pages/Landing/Login'
import Logout from './pages/Logout'
import NoMatch from './pages/404.js'

const routes = [

  Landing,
  Home,
  Login,
  RiskMap,
  ...ActionWorksheet,
  ...ActionsIndex,
  ...ActionsView,
  Logout,
  NoMatch

]


export default routes