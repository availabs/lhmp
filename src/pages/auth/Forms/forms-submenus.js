import Actions from '../actions/forms_index'
import Capabilities from '../Capabilities/index'
import Participation from '../Participation/forms_index'
import Roles from '../Roles/roles_forms/index'
import Zones from '../Zones/index'
import HazardId from '../HazardId/index'

let submenu = [
    Actions[0],
    Capabilities[0],
    Participation[0],
    Roles[0],
    Zones[0],
    HazardId[0]
]
export default [
    submenu.map(f => {
        return ({name: f.name, path: f.path})
    })
]