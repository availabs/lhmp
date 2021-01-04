import React from 'react'
import TextComponent from "./TextComponent";
import CommentComponent from "./CommentComponent"
import imageViewer from "./imageViewer";
import AvlFormsJoin from '../editComponents/AvlFormsJoin'
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
    comments: CommentComponent,
    imageViewer: imageViewer,
    AvlFormsJoin
}

