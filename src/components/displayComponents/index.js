import React from 'react'
import contentEditor from "./contentEditor";
import contentViewer from "./contentViewer";
import rolesTableViewer from "./jurisdictionRepresentatives/rolesTableViewer";
import rolesTableEditor from "./rolesTableEditor";
import capabilitiesTableHMPEditor from "./capabilitiesTableHMPEditor";
import capabilitiesTableHMPViewer from "./capabiltiesTableHMP/capabilitiesTableHMPViewer";
import planningDocumentsEditor from "./planningDocumentsEditor";
import planningDocumentsViewer from "./planningDocuments/planningDocumentsViewer";
import formTableViewer from './FormTableViewer'
import CriticalFacilitiesTableViewer from './criticalFacilitiesTableViewer'
import InventoryTableViewer from './inventoryTableViewer'
import evacuationRoutesViewer from "./evacuationRoutesViewer";
import capabilityEvaluationTableViewer from "./capabilityEvaluationTableViewer";
import shelterListTableViewer from "./shelterListTableViewer";
import actionsFilteredListTableViewer from "./actionsFilteredListTableViewer";
import ActionsFilteredListTableViewer from "./actionsFilteredListTableViewer";
import ImageComponent from './imageComponent'
import DevelopementZoneFilteredTable from "./developementZoneFilteredTable";
import developementZoneFilteredMap from "./developementZoneFilteredMap/";
import sociallyVulnerableDemographicsMapViewer from './sociallyVulnerableDemographicsMap/index'
import openSpaceTable from './openSpaceTable'

const NA = ({ type, state, routes }) =>
{
    return (
        <div>
            {type} Not Implmented
            <div>state:<br />{ JSON.stringify(state) }</div>
        </div>
    )
}

const NE = ((props) => (<div>{props.type} Doesn't Exist</div>))

const ActionsFilteredListTableViewerFunc = (rest) => <ActionsFilteredListTableViewer edit={true} {...rest}/>
const ImageEditor = (rest) => <ImageComponent edit={true} {...rest}/>
const CriticalFacilitiesTableEditor = (rest) => <CriticalFacilitiesTableViewer public={false} {...rest}/>
const InventoryTableEditor = (rest) => <InventoryTableViewer public={false} {...rest}/>
export default {
    NA,
    NE,
    contentEditor,
    contentViewer,
    rolesTableViewer,
    rolesTableEditor,
    capabilitiesTableHMPEditor,
    capabilitiesTableHMPViewer,
    planningDocumentsEditor,
    planningDocumentsViewer,
    formTableViewer,
    evacuationRoutesViewer,
    capabilityEvaluationTableViewer,
    shelterListTableViewer,
    actionsFilteredListTableViewer,
    actionsFilteredListTableEditor: ActionsFilteredListTableViewerFunc,
    capabilityEvaluationTableEditor: capabilityEvaluationTableViewer,
    evacuationRoutesEditor:evacuationRoutesViewer,
    criticalFacilitiesTableViewer: CriticalFacilitiesTableViewer,
    criticalFacilitiesTableEditor: CriticalFacilitiesTableEditor,
    inventoryTableViewer: InventoryTableViewer,
    inventoryTableEditor: InventoryTableEditor,
    formTableEditor: formTableViewer,
    imageEditor: ImageEditor,
    imageViewer: ImageComponent,
    developementZonesFilteredTableEditor: (rest) => <DevelopementZoneFilteredTable edit={true} {...rest}/>,
    developementZonesFilteredTableViewer: DevelopementZoneFilteredTable,
    developementZonesFilteredMapEditor: developementZoneFilteredMap,
    developementZonesFilteredMapViewer: developementZoneFilteredMap,
    sociallyVulnerableDemographicsMapEditor: sociallyVulnerableDemographicsMapViewer,
    sociallyVulnerableDemographicsMapViewer,
    openSpaceTableViewer: openSpaceTable,
    openSpaceTableEditor: openSpaceTable,
}

