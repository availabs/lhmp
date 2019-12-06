import AdminAbout from './about'
import AdminRisk from './risk'
import AdminStrategies from './strategies'
import PlanHazards from './hazards'

let submenu = [
    ...AdminAbout,
    ...PlanHazards,
    ...AdminRisk,
    ...AdminStrategies
]
export default [
    submenu.map(f => {
        return ({name: f.name, path: f.path})
    })
]