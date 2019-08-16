
// -- Landing Routes
import Landing from './pages/Landing'

// import PublicPlan from './pages/PublicPlan'
import RiskMap from './pages/riskmap'
import Home from 'pages/auth/Home';
import ActionsIndex from 'pages/auth/actions'
import ActionsView from 'pages/auth/actions/worksheet/view'
import ActionWorksheet from 'pages/auth/actions/worksheet/new'
import Plans from 'pages/auth/plans/view'
import PlanPage from 'pages/auth/plans/planPage'
import PlanIndex from 'components/plan/'

import Assets from 'pages/auth/Assets/'
import Historic from 'pages/auth/Historic/'
import AssetsView from "./pages/auth/Assets/components/AssetsView";
import AssetsEdit from "./pages/auth/Assets/components/AssetsEdit"
import RolesIndex from 'pages/auth/Roles/'
import Public from 'pages/auth/Public/'
import User from 'pages/auth/Users/'
// -- Util Routes
import Login from './pages/Landing/Login'
import Signup from './pages/Landing/SignUp'
import ResetPassword from './pages/Landing/ResetPassword'
import Logout from './pages/Logout'
import NoMatch from './pages/404.js'

const routes = [

  Landing,
  Home,
  Login,
  Signup,
   ...ResetPassword,
   ...ActionWorksheet,
   ...ActionsIndex,
   ...ActionsView,
   ...Plans,
   ...PlanPage,
   ...Assets,
   ...AssetsView,
   ...AssetsEdit,
   ...Historic,
   ...RolesIndex,
   ...Public,
        ...User,
  PlanIndex,
  RiskMap,
  Logout,
  NoMatch

]

const publicRoutes = [
    Landing,
    Login,
    Signup,
    ...ResetPassword,
    ...Public,
    Logout,
    NoMatch



]

export default {
    routes: routes,
    publicRoutes: publicRoutes
}


//AssetsTable,