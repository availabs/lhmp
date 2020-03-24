import AdminAbout from './about'
import AdminRisk from './risk'
import AdminStrategies from './strategies'
import PlanHazards from './hazards'
import LandingPage from "./LandingPage";

let submenu = [
    AdminAbout[0],
    PlanHazards[0],
    AdminRisk[0],
    AdminStrategies[0],
    LandingPage[0]
]
export default [
    submenu.map(f => {
        return ({name: f.name, path: f.path})
    })
]