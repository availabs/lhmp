import React from 'react'
import TextComponent from "./TextComponent";
import CommentComponent from "./CommentComponent"
import imageViewer from "./imageViewer";
import AvlFormsJoin from '../editComponents/AvlFormsJoin'
import ContentEditor from "../editComponents/contentEditor/contentEditor";
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
const contentViewer = () => <ContentEditor viewOnly={true} />
export default {
    NA,
    NE,
    contentViewer,
    text: TextComponent,
    comments: CommentComponent,
    imageViewer: imageViewer,
    AvlFormsJoin
}

