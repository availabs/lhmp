import AdminAbout from './about'
import AdminRisk from './risk'
import AdminStrategies from './strategies'
import PlanHazards from './hazards'
import LandingPage from "./LandingPage";

let submenu = [
    ...AdminAbout,
    ...PlanHazards,
    ...AdminRisk,
    ...AdminStrategies,
    ...LandingPage
]
export default [
    submenu.map(f => {
        return ({name: f.name, path: f.path})
    })
]