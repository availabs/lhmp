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
import CommentMap from 'pages/auth/CommentMap/index'
//import TestAvlMap from 'pages/auth/testAvlMap/index'
import Home from 'pages/auth/Home';
// -- Actions
import ActionsFormIndex from 'pages/auth/actions/forms_index'
import ActionsFormView from 'pages/auth/actions/view'
import ActionsWorksheetFormNew from 'pages/auth/actions/new'
import ActionsStatusUpdateForms from 'pages/auth/actions/actions_statusupdate_forms'

import PlanIndex from 'components/plan/' // plans list
import Plans from 'pages/auth/plans/view'
import PlanPage from 'pages/auth/plans/planPage'

import Plan from 'pages/auth/Plan/' // admin plan page
import AdminAbout from 'pages/auth/Plan/about' // admin plan page - submenu
import AdminRisk from 'pages/auth/Plan/risk' // admin plan page - submenu
import PlanHazards from 'pages/auth/Plan/hazards' // admin plan page - submenu
import AdminStrategies from 'pages/auth/Plan/strategies' // admin plan page - submenu
import AdminLandingPage from 'pages/auth/Plan/LandingPage'


import PlanningToolsRoles from 'pages/auth/Roles/index'
import PlanningToolsCapabilities from 'pages/auth/Capabilities/index'
import PlanningToolsAssets from 'pages/auth/Assets/index'
import Guidance from 'pages/auth/Plan/Guidance'
import GuidanceView from 'pages/auth/Plan/GuidanceView'
import ReviewTools from 'pages/auth/Plan/ReviewTools'
import ReviewRequirement from 'pages/auth/Plan/ReviewRequirement'


import AssetsSearch from 'pages/auth/Assets/indexSearch'
import AssetsView from "./pages/auth/Assets/components/AssetsView";
import AssetsEdit from "./pages/auth/Assets/components/AssetsEdit"
import AssetsListByTypeByHazard from "./pages/auth/Assets/components/AssetsListByTypeByHazard";
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
import ZonesFormsList from 'pages/auth/Zones/index'
import ZonesFormsView from 'pages/auth/Zones/view'
import ZonesFormsNew from 'pages/auth/Zones/new'
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
    ...ActionsStatusUpdateForms,

    ...Plans,
    ...Plan,
    ...AdminAbout,
    ...PlanHazards,
    ...AdminRisk,
    ...AdminStrategies,
    ...AdminLandingPage,
    ...PlanPage,

    ...PlanningToolsRoles,
    ...PlanningToolsCapabilities,
    ...PlanningToolsAssets,
    ...Guidance,
    ...GuidanceView,
    ...ReviewTools,
    ...ReviewRequirement,
    ...AssetsSearch,
    ...AssetsView,
    ...AssetsEdit,
    ...AssetsListByTypeByHazard,
    //...CapabilitiesFormsIndex,
    ...CapabilitiesFormsView,
    ...CapabilitiesFormsNew,
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
    ...ZonesFormsList,
    ...ZonesFormsView,
    ...ZonesFormsNew,
    PlanIndex,
    RiskMap,
    ScenarioMap2,
    CommentMap,
    //TestAvlMap,
    EvacuationRoutes,
    Logout,
    NoMatch

]
export default {
    routes: routes
}


//AssetsTable,