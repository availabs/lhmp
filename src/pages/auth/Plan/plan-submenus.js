import AdminAbout from './about'
import AdminRisk from './risk'
import AdminStrategies from './strategies'

let submenu = [
    ...AdminAbout,
    ...AdminRisk,
    ...AdminStrategies
]
export default [
    submenu.map(f => {
        return ({name: f.name, path: f.path})
    })
]