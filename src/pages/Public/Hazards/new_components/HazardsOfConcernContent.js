import React from 'react';
import { connect } from 'react-redux';
import styled from "styled-components";
import { reduxFalcor } from 'utils/redux-falcor'
// import {authGeoid} from "store/modules/user";
// import {getColorScale} from 'utils/sheldusUtils'
import Content from "components/cms/Content"
import get from "lodash.get"

import config from "pages/auth/Plan/config/hazards-config";
// import hazardConfig from './hazard-config'

//import {EARLIEST_YEAR, LATEST_YEAR} from "./components/yearsOfSevereWeatherData";


import {
    PageContainer,
    ContentContainer    
} 
from 'pages/Public/theme/components'


const StickySelect = styled.div`
   margin-top: 30px
   select {
   
   height: 5vh;
   width: 100%;
   z-index:100;
   
   }
`;

class Hazards extends React.Component {

    constructor(props) {
        super(props);
        //authGeoid(this.props.user);
        this.state = {
            geoid: this.props.geoid,
            dataType: 'severeWeather'
        }
    }

    fetchFalcorDeps(geoid, geoLevel, dataType) {
        if (!geoid) geoid = this.props.geoid;
        if (!dataType) dataType = this.state.dataType;
        return this.props.falcor.get(
            ['riskIndex', 'hazards'],
        )
            .then(response => {
               
                let hazards = response.json.riskIndex.hazards
                let contentIds = hazards.map(req => {
                    return `req-B1-${req}-${this.props.planId}-${this.props.geoid}`
                })
                    
                return this.props.falcor.get(
                    ['riskIndex', 'meta', hazards, ['id', 'name']],
                    ['content', 'byId', contentIds, ['body']]
                )
            })
    }

    render() {
        if(!this.props.geoid) {
            return <React.Fragment />
        }
        let profiles = get(this.props, `graph.riskIndex.hazards.value`, [])
            .filter(r =>
                this.props.hazard 
                 ? this.props.hazard.toLowerCase() === r.toLowerCase()
                 : true
            )
            .filter(req => get(this.props.graph, `content.byId[req-B1-${req}-${this.props.planId}-${this.props.geoid}].body.value`, '').length > 0)   

        return (
            <div>
                {

                       profiles.map(req => {
                            
                         return (
                            <div>
                                <h5>{get(this.props.graph,`riskIndex.meta[${req}].name`,'')}</h5>
                                <div 
                                    dangerouslySetInnerHTML={{ __html: get(this.props.graph, `content.byId[req-B1-${req}-${this.props.planId}-${this.props.geoid}].body.value`, '<span/>')}} 
                                />
                                
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    
}

const mapStateToProps = (state,ownProps) => {
    return {
        graph: state.graph,
        planId: state.user.activePlan
    };
};

const mapDispatchToProps = {};
export default  connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Hazards))

