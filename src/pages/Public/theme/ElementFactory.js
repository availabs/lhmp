import React from 'react';
import GraphFactory from "components/displayComponents/graphFactory";
import { Element } from 'react-scroll'
import {
    PageContainer,
    PageHeader,
    StatementText, 
    HeaderImage,
    HeaderContainer,
    SectionBox,
    SectionHeader,
    ContentHeader,
    ContentContainer,
    SectionBoxMain,
    SectionBoxSidebar,
    SidebarCallout
    
} 
from 'pages/Public/theme/components'
import {Link} from "react-router-dom";
import functions from "../../auth/Plan/functions";
import get from "lodash.get";

const  ElementFactory =  ({ element: element, user: user, showTitle=true, showEdit, showHeader, showLocation, pureElement, geoGraph, ...rest }) => {
    // if(element.title === 'County Description') {
    //     console.log('element county desc', element)
    // }
    return pureElement ?
        (
            <React.Fragment>
                <div>
                        {showTitle ? <span className='text-bright'>Element: {
                            element.title
                                .replace('::activeGeo', functions.formatName(get(geoGraph, [get(user, `activeCousubid`, ''), 'name']), get(user, `activeCousubid`, '')))
                                .replace('::haz', 'All Hazards')
                        } </span> : null}
                        {showLocation ? <i className='text-muted'> Location: {element.pageName}</i> : null}
                    {showEdit ?
                        <span style={{float: 'right'}}>
                            <Link className='btn btn-outline-primary btn-sm' to={`${element.url}/${element.requirement}`}>Edit</Link>
                        </span> : null}
                </div>
                <div>
                    {element.description ? <i className='text-muted'>{element.description}</i> : null}
                </div>
                <GraphFactory
                    graph={{type: element.type + 'Viewer'}}
                    user={user}
                    showHeader={showHeader}
                    {...element}
                    {...rest}
                />
                {element.callout ?
                    <GraphFactory
                        graph={{type: 'content' + 'Viewer'}}
                        user={user}
                        showHeader={showHeader}
                        {...{requirement: element.requirement + 'callout'}}
                        {...rest}
                    /> : null}
            </React.Fragment>
        ):
        (
            <Element name={element.title.replace('::activeGeo', functions.formatName(get(geoGraph, [get(user, `activeCousubid`, ''), 'name']), get(user, `activeCousubid`, ''))).replace('::haz', 'All Hazards')}>
                <SectionBox>
                    {['right'].includes(element.align) && element.callout ?
                        <SectionBoxSidebar >
                            <SidebarCallout>
                                <GraphFactory
                                    graph={{type: 'content' + 'Viewer'}}
                                    user={user}
                                    showHeader={showHeader}
                                    {...{requirement: element.requirement + 'callout'}}
                                    {...rest}
                                />
                            </SidebarCallout>
                        </SectionBoxSidebar>
                        : React.fragment
                    }
                    <SectionBoxMain>
                        <div>
                            {showTitle ? <ContentHeader>{element.title.replace('::activeGeo', functions.formatName(get(geoGraph, [get(user, `activeCousubid`, ''), 'name']), get(user, `activeCousubid`, ''))).replace('::haz', 'All Hazards')}</ContentHeader> : null}
                            {showLocation ? <i className='text-muted'> Location: {element.pageName}</i> : null}
                            {showEdit ? <span style={{float: 'right'}}>
                            <Link className='btn btn-outline-primary btn-sm' to={`${element.url}/${element.requirement}`}>Edit</Link></span> : null}
                        </div>
                        <div>
                            {element.description ? <i className='text-muted'>{element.description}</i> : null}
                        </div>
                        <GraphFactory
                            graph={{type: element.type + 'Viewer'}}
                            user={user}
                            showHeader={showHeader}
                            {...element}
                            {...rest}
                        />
                    </SectionBoxMain>
                    {['left'].includes(element.align) && element.callout?
                        <SectionBoxSidebar >
                            <SidebarCallout>
                                <GraphFactory
                                    graph={{type: 'content' + 'Viewer'}}
                                    user={user}
                                    showHeader={showHeader}
                                    {...{requirement: element.requirement + 'callout'}}
                                    {...rest}
                                />
                            </SidebarCallout>
                        </SectionBoxSidebar>
                        : React.fragment 
                    }
                </SectionBox>
            </Element>
        )
}
export default ElementFactory    


export const RenderConfig = ({ config: config, showHeader, pureElement, filterAdmin, ...rest }) => {
    return (
        pureElement ?
            Object.keys(config)
                .filter(key => typeof config[key] !== "string")
                .filter(section => filterAdmin ? config[section].filter(item => !item.onlyAdmin).length > 0 : true)
                .map(section => {
                return (
                    <React.Fragment>
                        {showHeader ? <SectionHeader>{section}</SectionHeader> : null}
                        {
                            config[section]
                                .filter(item => filterAdmin ? !item.onlyAdmin : true)
                                .map(requirement => {
                                return (
                                    <ElementFactory
                                        element={{...requirement, scope: config['scope']}}
                                        pureElement={pureElement}
                                        {...rest}

                                    />
                                )
                            })
                        }
                    </React.Fragment>
                )
            }) :
            <ContentContainer>
                
                            {
                                Object.keys(config)
                                    .filter(section => filterAdmin ? config[section].filter(item => !item.onlyAdmin).length > 0 : true)
                                    .map(section => {
                                    return (
                                        <div>
                                            {showHeader ? <SectionHeader>{section}</SectionHeader> : null}
                                            {
                                                config[section]
                                                    .filter(item => filterAdmin ? !item.onlyAdmin : true)
                                                    .map(requirement => {
                                                    return (
                                                        <ElementFactory
                                                            element={requirement}
                                                            {...rest}

                                                        />
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
               
            </ContentContainer>
    )
}

