import React from 'react'
import TextComponent from "./TextComponent";
import DropDownComponent from "./dropDownComponent";
import DateComponent from "./dateComponent";
import RadioComponent from "./radioComponent";
import TextAreaComponent from "./textAreaComponent";
import NumberComponent from "./numberComponent";
import FileComponent from "./fileComponent";
import MultiSelectComponent from "./multiSelectComponent";
import DropDownNoMetaComponent from "./dropDownNoMeta";
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
    textarea: TextAreaComponent,
    number: NumberComponent,
    file: FileComponent,
    multiselect: MultiSelectComponent,
    dropdown_no_meta: DropDownNoMetaComponent
}

