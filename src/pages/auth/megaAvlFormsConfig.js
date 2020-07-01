import actionsConfig from 'pages/auth/actions/actions_project_forms/config.js'
import capabilitiesConfig from 'pages/auth/Capabilities/capability_forms/config.js'
import hazardIdConfig from 'pages/auth/HazardId/config.js'
import municipalitiesConfig from 'pages/auth/municipalities/config.js'
import participationTimeConfig from 'pages/auth/Participation/participation_forms_time/config.js'
import rolesConfig from 'pages/auth/Roles/roles_forms/config.js'
import zonesConfig from 'pages/auth/Zones/config.js'
const allConfigs =
    [
        ...actionsConfig,
        ...capabilitiesConfig,
        ...hazardIdConfig,
        ...municipalitiesConfig,
        ...participationTimeConfig,
        ...rolesConfig,
        ...zonesConfig
    ]

const attributes = allConfigs
    .map(config => config.attributes)
    .reduce((a,c) => ({...a, ...c}), {})

export default attributes