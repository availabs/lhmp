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
    criticalFacilitiesTableEditor: criticalFacilitiesTableViewer,
    inventoryTableEditor: inventoryTableViewer,
    formTableEditor: formTableViewer
}

