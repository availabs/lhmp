import actions from '../actions'
import actionsProject from '../actions/project'
import assets from '../Assets/index'
import roles from '../Roles'
import capabilities from '../Capabilities'
import participation from '../Participation'

let submenu = [
    ...actions,
    ...assets,
    ...capabilities,
    ...participation,
    roles[0]
]
export default [
    submenu.map(f => {
        return ({name: f.name, path: f.path})
    })
]