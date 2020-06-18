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
import criticalFacilitiesTableViewer from './criticalFacilitiesTableViewer'
import inventoryTableViewer from './inventoryTableViewer'
import evacuationRoutesViewer from "./evacuationRoutesViewer";
import capabilityEvaluationTableViewer from "./capabilityEvaluationTableViewer";
import shelterListTableViewer from "./shelterListTableViewer";
import actionsFilteredListTableViewer from "./actionsFilteredListTableViewer";
import ActionsFilteredListTableViewer from "./actionsFilteredListTableViewer";
import ImageComponent from './imageComponent'


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
    criticalFacilitiesTableViewer,
    inventoryTableViewer,
    evacuationRoutesViewer,
    capabilityEvaluationTableViewer,
    shelterListTableViewer,
    actionsFilteredListTableViewer,
    actionsFilteredListTableEditor: ActionsFilteredListTableViewerFunc,
    capabilityEvaluationTableEditor: capabilityEvaluationTableViewer,
    evacuationRoutesEditor:evacuationRoutesViewer,
    criticalFacilitiesTableEditor: criticalFacilitiesTableViewer,
    inventoryTableEditor: inventoryTableViewer,
    formTableEditor: formTableViewer,
    imageEditor: ImageEditor,
    imageViewer: ImageComponent
}

