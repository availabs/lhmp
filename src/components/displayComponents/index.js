import React from 'react'
import contentEditor from "./contentEditor";

const NA = ({ type, state, routes }) =>
    <div>
        { type } Not Implmented
        <div>state:<br />{ JSON.stringify(state) }</div>
    </div>

const NE = ((props) => (<div>{props.type} Doesn't Exist</div>))
export default {
    contentEditor,
    NE,
    NA
}
export const GRAPH_TYPES = {
    overview:
        [
            {type: "Content", category: "contentEdtor"},
        ]
};