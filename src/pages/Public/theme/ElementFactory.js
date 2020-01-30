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

const  ElementFactory =  ({ element: element, user: user,  ...rest }) => (
    <Element name={element.title}>
        <SectionBox>
            {['right'].includes(element.align) ? 
                <SectionBoxSidebar >
                    {element.callout ? <SidebarCallout>{element.callout}</SidebarCallout> : <span/>}
                </SectionBoxSidebar>
                : React.fragment
            }
            <SectionBoxMain>
                <ContentHeader>{element.title}</ContentHeader>
                <GraphFactory
                    graph={{type: element.type + 'Viewer'}}
                    user={user}
                    {...element}
                    {...rest}
                    />
            </SectionBoxMain>
            {['right', 'full'].includes(element.align) ? 
                React.fragment :
                <SectionBoxSidebar >
                    {element.callout ? <SidebarCallout>{element.callout}</SidebarCallout> : <span/>}
                </SectionBoxSidebar>
            }
        </SectionBox>
    </Element>
)
export default ElementFactory    


export const RenderConfig = ({ config: config, ...rest }) => (
    <ContentContainer>
        <div className="row">
            <div className="col-12">
                <div className="element-wrapper">
                {
                    Object.keys(config).map(section => {
                        return (
                            <div>
                                <SectionHeader>{section}</SectionHeader>
                                {
                                    config[section].map(requirement => {
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

