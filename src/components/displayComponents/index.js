import React from 'react'
import ContentEditor from "./contentEditor/contentEditor";
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
import NfipStatisticsViewer from './nfipStatisticsViewer'
import evacuationRoutesViewer from "./evacuationRoutesViewer";
import capabilityEvaluationTableViewer from "./capabilityEvaluationTableViewer";
import ShelterListTableViewer from "./shelterListTableViewer";
import actionsFilteredListTableViewer from "./actionsFilteredListTableViewer";
import ActionsFilteredListTableViewer from "./actionsFilteredListTableViewer";
import ImageComponent from './imageComponent'
import imageViewer from "../AvlForms/displayComponents/imageViewer";
import DevelopementZoneFilteredTable from "./developementZoneFilteredTable";
import developementZoneFilteredMap from "./developementZoneFilteredMap/";
import sociallyVulnerableDemographicsMapViewer from './sociallyVulnerableDemographicsMap/index'
import openSpaceTable from './openSpaceTable'
import ProblemStatementTableViewer from "./problemStatementTableViewer";
import localHazardsOfConcernTable from "./localHazardsOfConcernTable";
import HazardEventsTable from './HazardEventsTable'

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
const NfipStatisticsEditor = (rest) => <NfipStatisticsViewer public={false} {...rest}/>
const problemStatementTableEditor = (rest) => <ProblemStatementTableViewer edit={true} {...rest}/>
const shelterListTableEditor = (rest) => <ShelterListTableViewer edit={true} {...rest}/>
const contentEditor = (rest) => <ContentEditor imgUploadUrl={  'https://graph.availabs.org/img/new'} {...rest} />
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
    shelterListTableViewer: ShelterListTableViewer,
    shelterListTableEditor,
    actionsFilteredListTableViewer,
    actionsFilteredListTableEditor: ActionsFilteredListTableViewerFunc,
    capabilityEvaluationTableEditor: capabilityEvaluationTableViewer,
    evacuationRoutesEditor:evacuationRoutesViewer,
    criticalFacilitiesTableViewer: CriticalFacilitiesTableViewer,
    criticalFacilitiesTableEditor: CriticalFacilitiesTableEditor,
    inventoryTableViewer: InventoryTableViewer,
    inventoryTableEditor: InventoryTableEditor,
    nfipStatisticsViewer: NfipStatisticsViewer,
    nfipStatisticsEditor: NfipStatisticsEditor,
    formTableEditor: formTableViewer,
    imageEditor: ImageEditor,
    imageViewer: imageViewer,
    developementZonesFilteredTableEditor: (rest) => <DevelopementZoneFilteredTable edit={true} {...rest}/>,
    developementZonesFilteredTableViewer: DevelopementZoneFilteredTable,
    developementZonesFilteredMapEditor: developementZoneFilteredMap,
    developementZonesFilteredMapViewer: developementZoneFilteredMap,
    sociallyVulnerableDemographicsMapEditor: sociallyVulnerableDemographicsMapViewer,
    sociallyVulnerableDemographicsMapViewer,
    openSpaceTableViewer: openSpaceTable,
    openSpaceTableEditor: openSpaceTable,
    problemStatementTableViewer: ProblemStatementTableViewer,
    problemStatementTableEditor,
    localHazardsOfConcernTableViewer: localHazardsOfConcernTable,
    localHazardsOfConcernTableEditor: localHazardsOfConcernTable,
    HazardEventsTableViewer: HazardEventsTable,
    HazardEventsTableEditor: HazardEventsTable
}

