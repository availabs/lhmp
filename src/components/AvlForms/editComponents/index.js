import React from 'react'
import TextComponent from "./TextComponent";
import DropDownComponent from "./dropDownComponent";
import DateComponent from "./dateComponent";
import RadioComponent from "./radioComponent";

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
    text: TextComponent,
    dropdown: DropDownComponent,
    date: DateComponent,
    radio:RadioComponent,
}

