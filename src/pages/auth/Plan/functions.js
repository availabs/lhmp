import React from "react";
import {falcorGraph} from "store/falcorGraph";
import GraphFactory from "components/displayComponents/graphFactory";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {Stickyroll} from '@stickyroll/stickyroll';
import {Pagers} from "@stickyroll/pagers";
import CSS_CONFIG from 'pages/auth/css-config'
import Element from "components/light-admin/containers/Element";
import ElementBox from "components/light-admin/containers/ElementBox";
import SideMenu from 'pages/Public/theme/SideMenu'
import styled from "styled-components";

const DIV = styled.div`
${props => props.theme.panelDropdownScrollBar};
`;
const geoDropdown = function(geoInfo,setActiveCousubid, activecousubId,allowedGeos){
    return geoInfo ? (
        <div>
            <select
                style={{height: '5vh', width:'250px'}}
                className="ae-side-menu"
                id='contact_county'
                data-error="Please select county"
                onChange={(e) => {
                    setActiveCousubid(e.target.value)
                }}
                value={activecousubId}
            >
                {Object.keys(geoInfo)
                    .filter(f => allowedGeos.includes(f))
                    .map((county, county_i) =>
                        <option className="ae-side-menu" key={county_i + 1}
                                value={county}> {this.formatName(geoInfo[county].name, county)}
                        </option>
                )}
            </select>
        </div>
    ) : <div></div>
}

const formatName = function(name= 'no name', geoid){
    let jurisdiction =
        geoid.length === 2 ? 'State' :
            geoid.length === 5 ? 'County' :
                geoid.length === 7 ? 'Village' :
                    geoid.length === 10 ? 'Town' :
                        geoid.length === 11 ? 'Tract' : '';
    if (name.toLowerCase().includes(jurisdiction.toLowerCase())){
        name = name.toLowerCase().replace(jurisdiction.toLowerCase(), ' (' + jurisdiction + ')')
    }else{
        name  += ' (' + jurisdiction + ')';
    }
    return name.toUpperCase()
}
const renderReqNav = function(allRequirenments, pageIndex){
    return (
        <ul className='ae-main-menu '>
            {
                allRequirenments.map((f, f_i) =>
                    <li className={f_i === pageIndex ? 'active' : ''}><a href={'#' + (parseInt(f_i) + 1)}>
                        <span style={{marginLeft: 0, 'word-break': 'break-word'}}>{f}</span>
                    </a></li>
                )
            }
        </ul>
    )
}

const renderElement = function(element, section, index, user) {
    return (
        <div
             style={{
            width: '100%',
            height: '100%',
        }}>
            <Element >
            <label style={{'width': '100%'}} className='element-header'> <h4>{section} |
                <small className='text-muted'> {element.title}
                    <span style={{padding: '5px'}}>
                        <button className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded" type="button"
                                onClick={
                                    (e) => document.getElementById('closeMe').style.display =
                                        document.getElementById('closeMe').style.display === 'block' ? 'none' : 'block'
                                }
                        > ?
                    </button>
                    </span>
                </small>
            </h4>
            </label>
            <div aria-labelledby="mySmallModalLabel"
                 className="onboarding-modal modal fade animated show" role="dialog"
                 id='closeMe'
                 tabIndex="0"
                 style={{display: 'none', margin: '0vh 0vw'}}
                 onClick={(e) => {
                     if (e.target.id === `closeMe`){
                         e.target.closest(`#closeMe`).style.display = 'none'
                     }
                 }}
                 aria-hidden="true">
                <div className="modal-dialog modal-centered modal-bg" style={{width: '100%', height: '50%', padding: '5vh 5vw'}}>
                    <DIV className="modal-content text-center" style={{width: '100%', height: '100%', overflow: 'auto'}}>

                        <div className="modal-header"><h6 className="modal-title">Prompt</h6>
                            <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                    onClick={(e) => e.target.closest('#closeMe').style.display = 'none'}>
                                <span aria-hidden="true"> ×</span></button>
                        </div>
                        <div className="modal-body" style={{textAlign: 'justify'}}>{element.prompt}</div>

                        <div className="modal-header"><h6 className="modal-title">Intent</h6></div>
                        <div className="modal-body" style={{textAlign: 'justify'}}>{element.intent}</div>

                        {
                            element.example ?
                                <React.Fragment>
                                    <div className="modal-header"><h6 className="modal-title">Example</h6></div>
                                    <div className="modal-body" style={{textAlign: 'justify'}}>
                                        <div>{element.example}</div>
                                    </div>
                                </React.Fragment> : null
                        }
                    </DIV>
                </div>
            </div>
                <ElementBox>
                <GraphFactory
                    graph={{type: element.type + 'Editor'}}
                    {...element}
                    user={user}
                    index={index}
                />
                    {element.callout  ?
                        (<React.Fragment>
                            <h6>Callout</h6>
                            <GraphFactory
                                graph={{type: 'content' + 'Editor'}}
                                {...{requirement: element.requirement + 'callout'}}
                                user={user}
                                index={index}
                            />
                        </React.Fragment>) : <React.Fragment/>}
                </ElementBox>
            </Element>
        </div>
    )
}

const render = function(config, user, geoInfo, setActiveCousubid, activecousubId,allowedGeos, reqId, baseLink){
    console.log('req id', reqId)
    let PageList = [];
    let sections = {};
    let allRequirenments = [];
    let initReqId = null
    Object.keys(config).map((section,sectionI) => {
        sections[section] = [];
        config[section]
            .filter((f,fI) => {if (reqId){ return f.requirement === reqId }else if(sectionI === 0 && fI === 0) {initReqId = f.requirement; return true}})
            .map((requirement, req_i) => {
            allRequirenments.push(requirement.title);
            PageList.push(renderElement(requirement, section, req_i, user));
            sections[section].push(PageList.length - 1)

        })
    });
    console.log('component rendered', PageList)
    return (
        <div key={reqId} name={reqId} id={reqId}>
            <div style={{position: 'fixed', left: 50, top: 0, paddingTop: 0,width:  CSS_CONFIG.reqNavWidth, height: '100%'}}>
                <div
                    className='ae-side-menu'
                    style={{
                        height: '5vh',
                        width: CSS_CONFIG.reqNavWidth,
                        position: 'fixed',
                        display: 'block',
                        zIndex:100
                    }}>
                    {this.geoDropdown(geoInfo,setActiveCousubid, activecousubId,allowedGeos)}
                </div>
                <SideMenu config={config} linkToReq={true} linkPath={baseLink} currReq={reqId || initReqId}/>
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


                <div style={{
                    height: '100vh',
                    width: '100%',
                }}>

                    {PageList.pop()}
                </div>
            </div>
        </div>
    );

}
export default {
    renderReqNav: renderReqNav,
    renderElement: renderElement,
    render : render,
    geoDropdown: geoDropdown,
    formatName: formatName
}

