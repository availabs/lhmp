import _ from 'lodash'
import routeConfig from './config.js'
let excludeFromView = ['geom']
let viewConfig = _.cloneDeep(routeConfig);
delete viewConfig[0].attributes.geom;
viewConfig[0].list_attributes = viewConfig[0].list_attributes.filter(f => !excludeFromView.includes(f))
export default
{
    config : routeConfig,
    view : viewConfig
}
