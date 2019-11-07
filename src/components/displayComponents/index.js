import React from 'react'
import contentEditor from "./contentEditor";
import contentViewer from "./contentViewer";
import rolesTableViewer from "./rolesTableViewer";
import rolesTableEditor from "./rolesTableEditor";
import capabilitiesTableHMPEditor from "./capabilitiesTableHMPEditor";
import capabilitiesTableHMPViewer from "./capabilitiesTableHMPViewer";
import planningDocumentsEditor from "./planningDocumentsEditor";
import planningDocumentsViewer from "./planningDocumentsViewer";
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
    planningDocumentsViewer
}

