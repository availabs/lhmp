import React from "react";
import GraphFactory from "components/displayComponents/graphFactory";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {Stickyroll} from '@stickyroll/stickyroll';
import {Pagers} from "@stickyroll/pagers";
import CSS_CONFIG from 'pages/auth/css-config'

const renderReqNav = function(allRequirenments){
    return (
        <ul className='ae-main-menu '>
            {
                allRequirenments.map((f, f_i) =>
                    <li><a href={'#' + (parseInt(f_i) + 1)}>
                        <span style={{marginLeft: 0, 'word-break': 'break-word'}}>{f}</span>
                    </a></li>
                )
            }
        </ul>
    )
}

const renderElement = function(element, section, index, user) {
    return (
        <div style={{
            width: '100%',
            height: '100%',
        }}>
            <label style={{'width': '100%'}}> <big>{section}</big> |
                <small> {element.title}
                    <button className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded" type="button"
                            onClick={
                                (e) => document.getElementById('closeMe').style.display =
                                    document.getElementById('closeMe').style.display === 'block' ? 'none' : 'block'
                            }
                            style={{'float': 'right'}}> ?
                    </button>
                </small>
            </label>
            <div aria-labelledby="mySmallModalLabel" className="modal fade bd-example-modal-sm show" role="dialog"
                 id='closeMe'
                 tabIndex="1" style={{'display': 'none'}} aria-hidden="true">
                <div className="modal-dialog modal-sm" style={{'float': 'right'}}>
                    <div className="modal-content">
                        <div className="modal-header"><h6 className="modal-title">Prompt</h6>
                            <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                    onClick={(e) => {
                                        console.log('cancel button', e.target.closest('#closeMe').style.display = 'none')
                                    }}>
                                <span aria-hidden="true"> ×</span></button>
                        </div>
                        <div className="modal-body">
                            {element.prompt}
                        </div>

                        <div className="modal-header"><h6 className="modal-title">Intent</h6>
                        </div>
                        <div className="modal-body">
                            {element.intent}
                        </div>
                    </div>
                </div>
            </div>
            <GraphFactory
                graph={{type: element.type + 'Editor'}}
                {...element}
                user={user}
                index={index}
            />
        </div>
    )
}

const render = function(config, user){
    let PageList = [];
    let sections = {};
    let allRequirenments = [];
    Object.keys(config).map(section => {
        sections[section] = [];
        config[section].map((requirement, req_i) => {
            allRequirenments.push(requirement.title);
            PageList.push(renderElement(requirement, section, req_i, user));
            sections[section].push(PageList.length - 1)

        })
    });
    return (
        <div>
            {
                <Stickyroll pages={PageList} anchors="">
                    {({page, pageIndex, pages, progress}) => {
                        let Content = PageList[pageIndex];

                        return (
                            <div>
                                <div
                                    className='ae-side-menu'
                                    style={{
                                        height: '100vh',
                                        width: CSS_CONFIG.reqNavWidth,
                                        position: 'absolute',
                                        display: 'block',
                                        overflow: 'scroll',
                                    }}>
                                    {this.renderReqNav(allRequirenments)}
                                </div>

                                <div
                                    style={{
                                        width: `calc(100% - ${CSS_CONFIG.reqNavWidth}))`,
                                        height: '100%',
                                        marginLeft: `calc(${CSS_CONFIG.reqNavWidth})`,
                                        display: 'absolute',
                                        alignContent: 'stretch',
                                        alignItems: 'stretch',
                                    }}>
                                    <Pagers useContext={true}/>

                                    <div aria-valuemax="100" aria-valuemin="0" aria-valuenow={page / pages}
                                         className="progress-bar bg-success" role="progressbar"
                                         style={{
                                             width: page / pages * 100 + '%',
                                             height: '15px'
                                         }}>{(page / pages * 100).toFixed(2)} %
                                    </div>

                                    <div style={{
                                        height: '100vh',
                                        width: '100%',
                                    }}>

                                        {Content}
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                </Stickyroll>
            }
        </div>
    )

}
export default {
    renderReqNav: renderReqNav,
    renderElement: renderElement,
    render : render
}

