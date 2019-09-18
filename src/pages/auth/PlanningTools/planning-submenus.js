import actions from '../actions'
import actionsProject from '../actions/project'
import assets from '../Assets'
import roles from '../Roles'
import capabilities from '../Capabilities'

let submenu = [
    ...actions,
    ...actionsProject,
    ...assets,
    ...capabilities,
    roles[0]
]
export default [
    submenu.map(f => {
        return ({name: f.name, path: f.path})
    })
]