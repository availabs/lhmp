import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
// import {authGeoid} from "store/modules/user";
// import {getColorScale} from 'utils/sheldusUtils'
import hazardsConfig from 'pages/auth/Plan/config/hazards-config.js'
import HazardBarChart from 'components/displayComponents/hazardComponents/HazardBarChart'

import NumberOfHazardsMonthStackedBarGraph from './NumberOfHazardsMonthStackedBarGraph'
import HazardEventsTable from '../../../../components/displayComponents/HazardEventsTable'

import CousubTotalLossTable from "../components/CousubTotalLossTable";
import HazardEventsMapController from "../components/HazardEventsMapController";
import get from "lodash.get"

import FemaDisasterDeclarationsTable from './FemaDisasterDeclarationsTable.js'

import {EARLIEST_YEAR, LATEST_YEAR} from "./yearsOfSevereWeatherData"
import LocalHazardsOfConcernTable from "../../../../components/displayComponents/localHazardsOfConcernTable";
//import {EARLIEST_YEAR, LATEST_YEAR} from "./components/yearsOfSevereWeatherData";
import {HeaderContainer, HeaderImageContainer, PageContainer, ContentHeader, VerticalAlign} from 'pages/Public/theme/components'
import ElementFactory from "../../theme/ElementFactory";
import functions from "../../../auth/Plan/functions";
import ElementBox from "../../../../components/light-admin/containers/ElementBox";
import styled from "styled-components";

import ContentViewer from "../../../../components/displayComponents/contentViewer";
const emptyBody = ['<p></p>', '']

const ANNEX_DIV = styled.div`
    text-align: right;
    color: #047bf8 !important;
    font-weight: 600;
    border-bottom: 1px solid #9dc9ea;
    padding-bottom: 4px;
`

class Hazards extends React.Component {

    constructor(props) {
        super(props);
        //authGeoid(this.props.user);
        this.state = {
            geoid: this.props.activeGeoid,
            dataType: 'severeWeather',
            image: ' '
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activeCousubid !== this.props.activeCousubid ||
            prevProps.hazard !== this.props.hazard ||
            prevProps.planId !== this.props.planId ||
            prevProps.activeGeoid !== this.props.activeGeoid
        ) {
            this.fetchFalcorDeps()
        }
    }

    fetchFalcorDeps(geoid, geoLevel, dataType) {
        if (!geoid) geoid = this.props.geoid;
        let contentId = `req-B1-${this.props.hazard}-${this.props.planId}-${this.props.geoid}`
        let contentIdCounty = `req-B1-${this.props.hazard}-${this.props.planId}-${this.props.activeGeoid}`
        let contentIdLocalImpact = `req-B1-${this.props.hazard}-local-impact-${this.props.planId}-${this.props.geoid}`
        let contentIdLocalImpactCounty = `req-B1-${this.props.hazard}-local-impact-${this.props.planId}-${this.props.activeGeoid}`
        let contentIdImage = `req-B1-${this.props.hazard}-image-${this.props.planId}-${this.props.geoid}`
        let contentIdImageCounty = `req-B1-${this.props.hazard}-image-${this.props.planId}-${this.props.activeGeoid}`

        return this.props.falcor.get(
            ['content', 'byId', [contentId, contentIdCounty, contentIdLocalImpact, contentIdLocalImpactCounty, contentIdImage, contentIdImageCounty], ['body']]
        ).then(contentRes => {
            let tmpImg = get(contentRes, `json.content.byId.${contentIdImage}.body`, null);

            tmpImg = tmpImg && !emptyBody.includes(tmpImg.trim()) ? tmpImg :
                get(hazardsConfig["Local Hazards"].filter(h => h.requirement === `req-B1-${this.props.hazard}-image`).pop(), `pullCounty`) ?
                    get(contentRes, `json.content.byId.${contentIdImageCounty}.body`, null) :
                    tmpImg
            this.setState({
                image: tmpImg
            })
        })

    }

    render() {
        if (!this.props.activeGeoid) {
            return <React.Fragment/>
        }
        let HazardName = get(this.props.graph, `riskIndex.meta[${this.props.hazard}].name`, '')
        let HazardTotal = get(this.props.graph, ['severeWeather', this.props.geoid, this.props.hazard, 'allTime', 'total_damage'], 0)

        let contentCharacteristics =
            get(this.props.graph, `content.byId[req-B1-${this.props.hazard}-${this.props.planId}-${this.props.geoid}].body.value`, null)

        let contentCharacteristicsFlags = get(hazardsConfig["Local Hazards"].filter(h => h.requirement === `req-B1-${this.props.hazard}`), [0], {})

        let countyContentCharacteristics = get(this.props.graph, `content.byId[req-B1-${this.props.hazard}-${this.props.planId}-${this.props.activeGeoid}].body.value`, '<span/>')


        let contentLocalImpacts =
            get(this.props.graph, `content.byId[req-B1-${this.props.hazard}-local-impact-${this.props.planId}-${this.props.geoid}].body.value`, null);

        let contentLocalImpactsFlags = get(hazardsConfig["Local Hazards"].filter(h => h.requirement === `req-B1-${this.props.hazard}-local-impact`), [0], {});

        let countyContentLocalImpacts = get(this.props.graph, `content.byId[req-B1-${this.props.hazard}-local-impact-${this.props.planId}-${this.props.activeGeoid}].body.value`, '<span/>')

        let contentLocalImpactsTitle =
            `${functions.formatName(get(this.props.geoGraph, [this.props.activeGeoid, 'name']), this.props.activeGeoid)}
                                         - Local Impacts - 
                                        ${get(this.props.graph, `riskIndex.meta[${this.props.hazard}].name`, 'All Hazards')}`;


        return (
            <div style={{minHeight: '100vh'}}>
                {this.props.hazard === '' || HazardTotal > 0 ?
                <div>
                    <div className='row'>
                    <ContentHeader>About the NOAA Storm Events Dataset</ContentHeader>
                    <PageContainer style={{paddingTop:20}}>The following charts, as well as the visualizations above, display storm events from the<i style={{color: '#afafaf'}}><a
                                href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI
                                Storm Events Dataset</a></i>. 
                            This data relates to the occurrence and magnitude of severe or unusual weather 
                            events and other significant meteorological events. The data is color coordinated with 
                            the associated hazard which can be found at the top of the page. Using your mouse tooltip, 
                            hover over a bar to see exact amounts as recorded in the data. The NOAA Storm Events data dates back to 1996 when the modern data format was introduced.
                            <li>The Loss by Year bar chart shows the loss in dollar value annually based on hazard events. 
                            Data can be scaled based on dollar amounts listed at the top of the chart.</li>
                            <li>The Events by Year bar chart shows the number of events during the given years. 
                            Events are separated by hazard types.</li>
                            <li>The Loss by Month bar chart shows the loss in dollar value monthly based on hazard events. 
                            Data can be scaled based on dollar amounts listed at the top of the chart.</li>
                            <li>The Events by Month bar chart shows the number of events during the given months. 
                            Events are separated by hazard types.</li>
                            </PageContainer>
                        <div className='col-md-6'>
                            <h6>{HazardName} Loss by Year</h6>
                            <HazardBarChart
                                hazard={this.props.hazard}
                                geoid={this.props.activeGeoid}
                                geoLevel={this.props.geoLevel}
                                format={"~s"}
                                height={300}
                                maxValueButtons={true}
                            />
                            
                        </div>
                        <div className='col-md-6'>
                            <h6 style={{paddingBottom:29}}>{HazardName} Events by Year</h6>
                            <HazardBarChart
                                lossType={'num_events'}
                                hazard={this.props.hazard}
                                geoid={this.props.activeGeoid}
                                geoLevel={this.props.geoLevel}
                                height={300}
                            />
                            
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-6'>
                            <h6>{HazardName} Loss by Month</h6>
                            <NumberOfHazardsMonthStackedBarGraph
                                showYlabel={false}
                                showXlabel={false}
                                lossType={'property_damage'}
                                geoid={this.props.activeGeoid}
                                geoLevel={this.props.geoLevel}
                                dataType='severeWeather'
                                hazards={this.props.hazards}
                                format={"~s"}
                                hazard={this.props.hazard}
                                height={300}
                                maxValueButtons={true}
                            />
                           
                        </div>
                        <div className='col-md-6'>
                            <h6 style={{paddingBottom:29}}>{HazardName} Events by Month</h6>
                            <NumberOfHazardsMonthStackedBarGraph
                                showYlabel={false}
                                showXlabel={false}
                                lossType={'num_events'}
                                geoid={this.props.activeGeoid}
                                geoLevel={this.props.geoLevel}
                                dataType='severeWeather'
                                hazards={this.props.hazards}
                                hazard={this.props.hazard}
                                height={300}
                            />
                           
                        </div>
                        <i style={{color: '#afafaf'}}>Source: <a
                                href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI
                                Storm Events Dataset</a></i>
                    </div>
                </div> : ''}
                <div className='row' style={{paddingTop:20}}>
                    <div>
                        <h4>{get(this.props.graph, `riskIndex.meta[${this.props.hazard}].name`, '')} Characteristics</h4>
                        <ContentViewer
                            requirement={ `req-B1-${this.props.hazard}` }
                            user={ this.props.user }
                        />
                        {/*<i>{contentCharacteristicsStatus}</i>*/}
                       {/* {
                            !contentCharacteristicsFlags.hideCounty || this.props.user.activeCousubid.length === 5 ?
                                <div dangerouslySetInnerHTML={{__html: countyContentCharacteristics}}/> : null
                        }
                        {
                            !contentCharacteristicsFlags.hideJurisdictionAnnex && this.props.user.activeCousubid.length > 5 ?
                                <ElementBox>
                                    <span className='text-muted' style={{float: 'right'}}> Jurisdiction Town Annex</span>
                                    <div dangerouslySetInnerHTML={{__html: contentCharacteristics}}/>
                                </ElementBox> : null
                        }*/}
                    </div>
                    <div style={{width: '100%'}}>
                        {this.state.image ? <HeaderImageContainer img={this.state.image}/> : null}
                    </div>
                    <div>
                        <h4>
                            {contentLocalImpactsTitle}
                        </h4>
                        <ContentViewer
                            requirement={ `req-B1-${this.props.hazard}-local-impact` }
                            user={ this.props.user }
                        />
                        {/*<i>{contentLocalImpactsStatus}</i>*/}
                        {/*{
                            !contentLocalImpactsFlags.hideCounty || this.props.user.activeCousubid.length === 5 ?
                                <div dangerouslySetInnerHTML={{__html: countyContentLocalImpacts}}/> : null
                        }
                        {
                            !contentLocalImpactsFlags.hideJurisdictionAnnex && this.props.user.activeCousubid.length > 5 ?
                                <ElementBox style={{backgroundColor: 'aliceblue'}}>
                                    <ANNEX_DIV>Jurisdictional Annex</ANNEX_DIV>
                                    <div dangerouslySetInnerHTML={{__html: contentLocalImpacts}}/>
                                </ElementBox> : null
                        }*/}

                    </div>
                </div>
                {this.props.hazard === '' || HazardTotal > 0 ?
                <div>
                    <LocalHazardsOfConcernTable
                        config={
                            {
                                title: `${functions.formatName(get(this.props.geoGraph, [this.props.activeCousubid, 'name']), this.props.activeCousubid)} 
                                - Local Hazards of Concern Table - ${get(this.props.graph, `riskIndex.meta[${this.props.hazard}].name`, 'All Hazards')}`,
                                //requirement: 'Req-C-1A',
                                type: 'formTable',
                                //fontSize: '0.70em',
                                height: '600px',
                                align: 'full',
                                config: {
                                    type: 'hazardid',
                                    filters:[{column:'hazard_concern',value:
                                            get(this.props.riskIndexMeta,
                                                [this.props.hazard, 'name'],
                                                null) ?
                                                [this.props.hazard,
                                                    get(this.props.riskIndexMeta,
                                                        [this.props.hazard, 'name'],
                                                        'n/a')] : this.props.hazard
                                    }],
                                    columns : [
                                        {
                                            Header: 'COMMUNITY_NAME', // make it lower case
                                            accessor: 'community_name',
                                            sort: true,
                                            filter: 'default'
                                        },
                                        {
                                            Header: 'HAZARD_CONCERN',
                                            accessor: 'hazard_concern',
                                            sort: true,
                                            filter: 'default'
                                        },
                                        {
                                            Header: 'PREVIOUS_OCCURRENCE',
                                            accessor: 'previous_occurrence',
                                            sort: true,
                                            filter: 'multi'
                                        },
                                        {
                                            Header: 'FUTURE_OCCURRENCE',
                                            accessor: 'future_occurrence',
                                            sort: true,
                                            filter: 'multi'
                                        },

                                        {
                                            Header: 'LOSS_LIFE_PROPERTY',
                                            accessor: 'loss_life_property',
                                            sort: true,
                                            filter: 'default'
                                        },
                                        {
                                            Header: 'LOCATION_DESCRIPTION',
                                            accessor: 'location_description',
                                            width: 50
                                        },
                                    ]
                                },
                                prompt: '',
                                intent: '',
                                activeGeoFilter: 'true',
                                defaultSortCol: 'COMMUNITY_NAME',
                                // defaultSortOrder: 'desc',
                                colOrder: ['COMMUNITY_NAME', 'HAZARD_CONCERN', 'PREVIOUS_OCCURRENCE', 'FUTURE_OCCURRENCE', 'LOSS_LIFE_PROPERTY', 'LOCATION_DESCRIPTION'],
                                minHeight: '80vh',
                                icon: 'os-icon-tasks-checked',
                                flex: 'false'
                            }
                        } /> :

                    <div className='row' style={{paddingTop:20}}>
                        <div className='col-md-12'>
                            <h4>Events with Highest Reported Loss in Dollars</h4>
                            <strong>{EARLIEST_YEAR}-{LATEST_YEAR}</strong>
                            <div>The table below lists individual events by loss in dollars.
                                Click on a row to view the event description.
                            </div>
                            <HazardEventsTable
                                hazards={this.props.hazards}
                                hazard={this.props.hazard}
                                geoid={this.props.activeGeoid}
                            />
                            <i style={{color: '#afafaf'}}>Source: <a
                                href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI
                                Storm Events Dataset</a></i>
                        </div>
                    </div>
                    <div className='row' style={{paddingTop:20}}>
                        <div className='col-md-12'>
                            <h4>Hazard Loss by Municipality</h4>
                            <strong>{EARLIEST_YEAR}-{LATEST_YEAR}</strong>
                            <h6>{HazardName} Loss by Month</h6>
                            <div>This table displays the total damage amount in dollars and number 
                            of fatalities for all recorded hazards between the years of 1996-2018. 
                            Viewers can access individual jurisdiction-specific statistics by clicking on the jurisdiction name. 
                            In New York State, Villages are included within Town boundaries. Villages are not included in this table so as to not double count hazard loss statistics.  
                            </div>
                            <CousubTotalLossTable
                                geoid={this.props.activeGeoid}
                                geoLevel={this.props.geoLevel}
                                dataType='severeWeather'
                                hazards={this.props.hazards}
                                hazard={this.props.hazard}
                            />
                            <i style={{color: '#afafaf'}}>Source: <a
                                href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI
                                Storm Events Dataset</a></i>
                        </div>
                    </div>
                    
                    <div className='row' style={{paddingTop:20}}>
                        <div className='col-md-12' style={{paddingBottom: 20}}>
                            <h4>Presidential Disaster Declrations</h4>
                            

                            <FemaDisasterDeclarationsTable
                                geoid={this.props.activeGeoid}
                                geoLevel={this.props.geoLevel}
                                hazards={this.props.hazards}
                                hazard={this.props.hazard}
                              
                                
                            />
                        </div>
                    </div>
                    <div className='row' style={{paddingTop:20}}>
                        <div className='col-md-12'>
                            <h4>Hazard Events</h4>
                            <strong>{EARLIEST_YEAR}-{LATEST_YEAR}</strong>
                            <h6>{HazardName} Events</h6>
                            <div>This map shows hazard events geographically between the years of 1996-2018. The size of the circles correspond to 
                            the dollar amount of event damage; a larger circle indicates more dollar damage. The circle is color coordinated with 
                            the associated hazard which can be found at the top of the page. Hovering over
                             a circle will show exact amounts as recorded in the data. To filter this map click on the specific hazard above. 
                            </div>
                            <HazardEventsMapController
                                geoid={this.props.activeGeoid}
                                geoLevel={this.props.geoLevel}
                                dataType='severeWeather'
                                hazards={this.props.hazards}
                                hazard={this.props.hazard}
                                zoomPadding={150}
                                year={1999}
                            />
                            <i style={{color: '#afafaf'}}>Source: <a
                                href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI
                                Storm Events Dataset</a></i>
                        </div>
                    </div>
                </div> : ''}
            </div>

        )
    }


}

const mapStateToProps = (state, ownProps) => {
    return {
        graph: state.graph,
        user: state.user,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        planId: state.user.activePlan,
        geoGraph: state.graph.geo,
    };
};

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Hazards))

