
// -- Landing Routes
import Landing from './pages/Landing'

// -- Public Pages
import Public from './pages/Public/Home/'
import About from './pages/Public/PlanningProcess/'
import Hazards from './pages/Public/Hazards/'
import Hazards2 from './pages/Public/Hazards/new'
import Risk from './pages/Public/RiskAssessmentAndVulnerability/'
import Strategies from './pages/Public/Strategies/'

// import PublicPlan from './pages/PublicPlan'
import RiskMap from './pages/riskmap'
import ScenarioMap2 from 'pages/auth/ScenarioMap2/index'
import EvacuationRoutes from 'pages/auth/EvacuationRoutes/'
import Home from 'pages/auth/Home';
import ActionsFormIndex from 'pages/auth/actions/forms_index'
import ActionsFormView from 'pages/auth/actions/view'
import ActionsWorksheetFormNew from 'pages/auth/actions/new'
/*
import ActionsIndex from 'pages/auth/actions'
import ActionsView from 'pages/auth/actions/worksheet/view'
import ActionsProjectView from 'pages/auth/actions/project/view'
import ActionWorksheet from 'pages/auth/actions/worksheet/new'
import ActionsProjectIndex from 'pages/auth/actions/project'
import ActionsProjectUpload from 'pages/auth/actions/project/upload'
import ActionProject from 'pages/auth/actions/project/new'
 */

import PlanIndex from 'components/plan/' // plans list
import Plans from 'pages/auth/plans/view'
import PlanPage from 'pages/auth/plans/planPage'

import Plan from 'pages/auth/Plan/' // admin plan page
import AdminAbout from 'pages/auth/Plan/about' // admin plan page - submenu
import AdminRisk from 'pages/auth/Plan/risk' // admin plan page - submenu
import PlanHazards from 'pages/auth/Plan/hazards' // admin plan page - submenu
import AdminStrategies from 'pages/auth/Plan/strategies' // admin plan page - submenu
import AdminLandingPage from 'pages/auth/Plan/LandingPage'

import PlanningTools from 'pages/auth/PlanningTools/'
import PlanningToolsRoles from 'pages/auth/Roles/index'
import PlanningToolsParticipation from 'pages/auth/Participation/index'
import PlanningToolsCapabilities from 'pages/auth/Capabilities/index'
import PlanningToolsAssets from 'pages/auth/Assets/index'
import PlanningToolsActions from 'pages/auth/actions/index'

import AssetsSearch from 'pages/auth/Assets/indexSearch'
import AssetsView from "./pages/auth/Assets/components/AssetsView";
import AssetsEdit from "./pages/auth/Assets/components/AssetsEdit"
import AssetsListByTypeByHazard from "./pages/auth/Assets/components/AssetsListByTypeByHazard";
import Capabilities from 'pages/auth/Capabilities'
import CapabilitiesNew from 'pages/auth/Capabilities/capability/new'
import CapabilitiesView from 'pages/auth/Capabilities/capability/view'
import CapabilitiesFormsList from 'pages/auth/Capabilities/capability_forms'
import CapabilitiesFormsView from 'pages/auth/Capabilities/capability_forms/view'
import CapabilitiesFormsNew from 'pages/auth/Capabilities/capability_forms/new'
//import RolesIndex from 'pages/auth/Roles/'
import RolesFormsList from 'pages/auth/Roles/roles_forms/index'
import RolesFormView from 'pages/auth/Roles/roles_forms/view'
import RolesFormNew from 'pages/auth/Roles/roles_forms/new'
import User from 'pages/auth/Users/'
import Admin from 'pages/auth/Users/admin'
import FormEditOrNew from 'components/light-admin/tables/FormEditOrNew'
import ParticipationListView from "./pages/auth/Participation/forms_index"
import ParticipationView from "./pages/auth/Participation/view"
import ParticipationFromsNew from "./pages/auth/Participation/new"
//import Participation from "./pages/auth/Participation/";
//import ParticipationView from "./pages/auth/Participation/components/view";
//import ParticipationNew from "./pages/auth/Participation/components/new";
import ParticipationMeetingView from "./pages/auth/Participation/components/meetingview";
import ParticipationUserRoles from "./pages/auth/Participation/components/userroles";

// -- Util Routes
import Login from './pages/Landing/Login'
import Signup from './pages/Landing/SignUp'
//import SignUpForms from './pages/Landing/signup_forms/SignUp'
import ResetPassword from './pages/Landing/ResetPassword'
import Logout from './pages/Logout'
import NoMatch from './pages/404.js'

import test from './pages/Test'
const routes = [
    test,
  Landing,
  Home,
  Login,
  Signup,
   //...SignUpForms,
   ...ResetPassword,
   ...ActionsFormIndex,
   ...ActionsFormView,
   ...ActionsWorksheetFormNew,
   /*
   ...ActionWorksheet,
   ...ActionsIndex,
   ...ActionsView,
   ...ActionsProjectView,
   ...ActionProject,
   ...ActionsProjectIndex,
   ...ActionsProjectUpload,
    */
   ...Plans,
   ...Plan,
   ...AdminAbout,
   ...PlanHazards,
   ...AdminRisk,
   ...AdminStrategies,
    ...AdminLandingPage,
   ...PlanPage,
   //...PlanningTools,
   ...PlanningToolsRoles,
   ...PlanningToolsParticipation,
   ...PlanningToolsCapabilities,
   ...PlanningToolsAssets,
   ...PlanningToolsActions,
   ...AssetsSearch,
   ...AssetsView,
   ...AssetsEdit,
   ...AssetsListByTypeByHazard,
   ...CapabilitiesFormsList,
   ...CapabilitiesFormsView,
   ...CapabilitiesFormsNew,
   /*
   OLD CAPABILITIES FORMS
   //...Capabilities,
   //...CapabilitiesNew,
   //...CapabilitiesView,
    */
   //...RolesIndex,
   ...RolesFormsList,
   ...RolesFormView,
   ...RolesFormNew,
   ...Public,
   ...About,
   ...Hazards,
   ...Hazards2,
   ...Risk,
   ...Strategies,
   ...User,
   ...Admin,
   ...FormEditOrNew,
   //...Participation,
   ...ParticipationListView,
   ...ParticipationView,
   ...ParticipationFromsNew,
   //...ParticipationNew,
   ...ParticipationMeetingView,
   ...ParticipationUserRoles,

  PlanIndex,
  RiskMap,
  ScenarioMap2,
    EvacuationRoutes,
  Logout,
  NoMatch

]
export default {
    routes: routes
}


//AssetsTable,