import React from 'react'
import TextComponent from "./TextComponent";
const NA = ({ type, state, routes }) =>
{
    return (
        <div>
            {type} Not Implemented
            <div>state:<br />{ JSON.stringify(state) }</div>
        </div>
    )
}

const NE = ((props) => (<div>{props.type} Doesn't Exist</div>))
export default {
    NA,
    NE,
    text: TextComponent
}

