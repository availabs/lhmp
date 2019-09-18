import actions from '../actions'
import assets from '../Assets'
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