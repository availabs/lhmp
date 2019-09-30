
// -- Landing Routes
import Landing from './pages/Landing'

// -- Public Pages
import Public from './pages/Public/Home/'
import About from './pages/Public/About/'
import Hazards from './pages/Public/Hazards/'
import Risk from './pages/Public/RiskAssessmentAndVulnerability/'
import Strategies from './pages/Public/Strategies/'


// import PublicPlan from './pages/PublicPlan'
import RiskMap from './pages/riskmap'
import Home from 'pages/auth/Home';

import ActionsIndex from 'pages/auth/actions'
import ActionsView from 'pages/auth/actions/worksheet/view'
import ActionWorksheet from 'pages/auth/actions/worksheet/new'
import ActionsProjectIndex from 'pages/auth/actions/project'
import ActionsProjectView from 'pages/auth/actions/project/view'
import ActionsProjectUpload from 'pages/auth/actions/project/upload'
import ActionProject from 'pages/auth/actions/project/new'

import PlanIndex from 'components/plan/' // plans list
import Plans from 'pages/auth/plans/view'
import PlanPage from 'pages/auth/plans/planPage'

import Plan from 'pages/auth/Plan/' // admin plan page
import AdminAbout from 'pages/auth/Plan/about' // admin plan page - submenu
import AdminRisk from 'pages/auth/Plan/risk' // admin plan page - submenu
import AdminStrategies from 'pages/auth/Plan/strategies' // admin plan page - submenu

import PlanningTools from 'pages/auth/PlanningTools/'
import Assets from 'pages/auth/Assets/'
import Historic from 'pages/auth/Historic/'
import AssetsView from "./pages/auth/Assets/components/AssetsView";
import AssetsEdit from "./pages/auth/Assets/components/AssetsEdit"
import Capabilities from 'pages/auth/Capabilities'
import CapabilitiesNew from 'pages/auth/Capabilities/capability/new'
import CapabilitiesView from 'pages/auth/Capabilities/capability/view'
import RolesIndex from 'pages/auth/Roles/'
import User from 'pages/auth/Users/'
import Admin from 'pages/auth/Users/admin'
import FormEditOrNew from 'components/light-admin/tables/FormEditOrNew'
import Participation from "./pages/auth/Participation/";
import ParticipationView from "./pages/auth/Participation/components/view";
import ParticipationNew from "./pages/auth/Participation/components/new";
import ParticipationMeetingView from "./pages/auth/Participation/components/meetingview";

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
   ...ActionProject,
   ...ActionsProjectIndex,
   ...ActionsProjectView,
   ...ActionsProjectUpload,
   ...Plans,
   ...Plan,
   ...AdminAbout,
   ...AdminRisk,
   ...AdminStrategies,
   ...PlanPage,
   ...PlanningTools,
   ...Assets,
   ...AssetsView,
   ...AssetsEdit,
   ...Capabilities,
   ...CapabilitiesNew,
   ...CapabilitiesView,
   ...Historic,
   ...RolesIndex,
   ...Public,
   ...About,
   ...Hazards,
   ...Risk,
   ...Strategies,
   ...User,
   ...Admin,
   ...FormEditOrNew,
   ...Participation,
   ...ParticipationView,
   ...ParticipationNew,
   ...ParticipationMeetingView,
  PlanIndex,
  RiskMap,
  Logout,
  NoMatch

]
export default {
    routes: routes
}


//AssetsTable,