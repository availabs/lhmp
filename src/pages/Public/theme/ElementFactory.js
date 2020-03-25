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

const  ElementFactory =  ({ element: element, user: user, showTitle=true, showHeader, pureElement, ...rest }) => {
    console.log('pureElement?', pureElement, rest)

    return pureElement ?
        (
            <React.Fragment>
                {showTitle ? element.title : null}
                <GraphFactory
                    graph={{type: element.type + 'Viewer'}}
                    user={user}
                    showHeader={showHeader}
                    {...element}
                    {...rest}
                />
                <GraphFactory
                    graph={{type: 'content' + 'Viewer'}}
                    user={user}
                    showHeader={showHeader}
                    {...{requirement: element.requirement + 'callout'}}
                    {...rest}
                />
            </React.Fragment>
        ):
        (
            <Element name={element.title}>
                <SectionBox>
                    {['right'].includes(element.align) ?
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
                        {showTitle ? <ContentHeader>{element.title}</ContentHeader> : null}
                        <GraphFactory
                            graph={{type: element.type + 'Viewer'}}
                            user={user}
                            showHeader={showHeader}
                            {...element}
                            {...rest}
                        />
                    </SectionBoxMain>
                    {['right', 'full'].includes(element.align) ?
                        React.fragment :
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
                                        element={requirement}
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
                <div className="row">
                    <div className="col-12">
                        <div className="element-wrapper">
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
                        </div>
                    </div>
                </div>
            </ContentContainer>
    )
}

