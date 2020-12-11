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
import EmailComponent from "./emailComponent";
import dropDownSignUp from "./dropDownSignUp";
import FormArrayComponent from "./FormArrayComponent";
import ImageEditor from "./imageComponent/index"
import AvlFormsJoin from './AvlFormsJoin'
import CheckboxComponent from './checkboxComponent'
import ContentEditor from "../../displayComponents/contentEditor/contentEditor";
const NA = ({ type, state, routes }) =>
{
    return (
        <div>
            {type} Not Implemented
            <div>state:<br />{ JSON.stringify(state) }</div>
        </div>
    )
}

const HIDDEN = ({ type, state, routes }) =>
{
    return (
        <div>

        </div>
    )
}

const NE = ((props) => (<div>{props.type} Doesn't Exist</div>));
const contentEditor = (rest) => <ContentEditor imgUploadUrl={ process.env.NODE_ENV === 'production' ? 'http://graph.availabs.org/img/new' : 'http://localhost:4444/img/new'} {...rest} />

export default {
    NA,
    NE,
    contentEditor,
    hidden: HIDDEN,
    text: TextComponent,
    dropdown: DropDownComponent,
    date: DateComponent,
    radio:RadioComponent,
    textarea: TextAreaComponent,
    number: NumberComponent,
    file: FileComponent,
    multiselect: MultiSelectComponent,
    dropdown_no_meta: DropDownNoMetaComponent,
    email: EmailComponent,
    dropDownSignUp:dropDownSignUp,
    form_array: FormArrayComponent,
    imageEditor: ImageEditor,
    AvlFormsJoin: (rest) => <AvlFormsJoin editView={true} {...rest}/>,
    checkbox: CheckboxComponent
}

