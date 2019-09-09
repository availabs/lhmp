import actions from '../actions'
import assets from '../Assets'
import roles from '../Roles'
import capabilities from '../Capabilities'

let submenu = [
    ...actions,
    ...assets,
    ...capabilities,
    roles[0]
]
export default [
    submenu.map(f => {
        return ({name: f.name, path: f.path})
    })
]