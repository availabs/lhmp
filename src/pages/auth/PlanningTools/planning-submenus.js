import actions from '../actions'
import assets from '../Assets'
import roles from '../Roles'


let submenu = [
    ...actions,
    ...assets,
    roles[0]
]
export default [
    submenu.map(f => {
        return ({name: f.name, path: f.path})
    })
]