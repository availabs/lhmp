import React, {Component} from 'react';
import AvlMap from 'components/AvlMap'
import {reduxFalcor} from 'utils/redux-falcor'
import {connect} from "react-redux";
import TractsLayer from './layers/TractsLayer'
import CensusStatBox from './components/CensusStatBox'
import SvgMap from "components/mapping/escmap/SvgMap.react"
import * as d3color from 'd3-color';
import {getChildGeo, getGeoMerge, getGeoMesh} from 'store/modules/geo'


import get from "lodash.get";
import Viewport from "components/mapping/escmap/Viewport"

import {backgroundColor, ContentHeader, HeaderContainer, PageContainer, SectionBox} from 'pages/Public/theme/components'
import config from "pages/auth/Plan/config/landing-config";
import {RenderConfig} from 'pages/Public/theme/ElementFactory'


TractsLayer.backgroundColor = backgroundColor;

class LocalContext extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
        };
    }

    fetchFalcorDeps() {
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();
        return this.props.falcor.get(
            ['geo',  parseInt(this.props.activeGeoid), 'counties'],
            ['acs', parseInt(this.props.activeCousubid), ['2017'], ['B19013_001E', 'B01003_001E', 'B17001_002E']],
            ['geo', parseInt(this.props.activeCousubid), 'name']
        )
    }

    componentWillMount() {
        const {activeGeoid} = this.props;
        this.props.getChildGeo(activeGeoid.slice(0, 2), 'counties');
        this.props.getGeoMesh(activeGeoid.slice(0, 2), 'counties');
        this.props.getGeoMerge(activeGeoid.slice(0, 2), 'counties');
        this.props.getChildGeo(activeGeoid.slice(0, 2), 'cousubs');
    }
    componentDidMount() {
        Viewport().register(this, this.setState);
    }

    componentWillReceiveProps(newProps) {
        const {activeGeoid, geoLevel, hazard} = newProps;
        let geojson = null,
            counties = null;
        let padding = this.props.zoomPadding

        switch (geoLevel) {
            case 'counties':
                geojson = newProps.geo['merge'][activeGeoid.slice(0, 2)]['counties']
                counties =  newProps.geo[activeGeoid.slice(0, 2)]['counties'].features
                    .reduce((a, c) => (c.properties.geoid === activeGeoid) ? c : a, null);
                break;
            case 'cousubs':
                geojson = newProps.geo[activeGeoid.slice(0, 2)]['cousubs'].features
                    .reduce((a, c) => (c.properties.geoid === activeGeoid) ? c : a, null);
                break;
        }

        if (!geojson) return;

        Viewport().fitGeojson(geojson, {padding});

        this.setState({bounds: geojson, countiesGeojson: counties})
        if ((activeGeoid !== this.props.activeGeoid) ||
            (hazard !== this.props.hazard)) {
            this.setState({loadedRanges: {}});
            this.fetchFalcorDeps(newProps);
        }
    }

    renderStats(stats, flow = 'vertical') {
        let statsMeta = [
            {
                title: 'Population',
                geoids: [parseInt(this.props.activeCousubid)],
                censusKeys: ['B01003_001E']
            },
            {
                title: 'Household Income Below Poverty Level',
                sumType: 'pct',
                valueSuffix: '%',
                censusKeys: ['B17001_002E'],
                divisorKeys: ['B01003_001E'],
                geoids: [parseInt(this.props.activeCousubid)],
            },
            {
                title: 'Median Household Income',
                censusKeys: ['B19013_001E'],
                valuePrefix: '$',
                geoids: [parseInt(this.props.activeCousubid)],
            },
            {
                title: 'Median Property Value',
                censusKeys: ['B25077_001E'],
                valuePrefix: '$',
                geoids: [parseInt(this.props.activeCousubid)],
            },
            {
                title: 'Median Age',
                censusKeys: ['B01002_001E'],
                geoids: [parseInt(this.props.activeCousubid)],
            },
            {
                title: 'Number of Employees',
                censusKeys: ['B08604_001E'],
                geoids: [parseInt(this.props.activeCousubid)],
            },
        ]

        return flow === "vertical" ?
            (
                statsMeta
                    .filter(f => stats ? stats.includes(f.title) : true)
                    .map((d, i) => {
                        return (
                            <div className="row mb-xl-2 mb-xxl-3" key={i}>
                                <div className="col-sm-6" style={{margin: '0 auto'}}>
                                    <CensusStatBox
                                        {...d}
                                    />
                                </div>
                            </div>
                        )
                    })
            ) :
            (
                <div className="row mb-xl-2 mb-xxl-3">
                    {statsMeta
                        .filter(f => stats ? stats.includes(f.title) : true)
                        .map((d, i) =>
                            <div className="col-sm-3" style={{margin: '0 auto'}}>
                                <CensusStatBox
                                    {...d}
                                />
                            </div>
                        )
                    }
                </div>
            )

    }

    generateLayers() {
        return [

            { id: 'cousubs-layer-filled',
                data: this.state.bounds,
                filled: true,
                getFillColor: [242, 239, 233, 255]
            },
            { id: 'cousubs-layer-stroked',
                data: this.state.countiesGeojson,
                filled: true,
                getFillColor: [65, 131, 215, 255]
                /*getLineColor:
                    (d) =>
                    d.properties.geoid === this.props.activeGeoid ? [255, 0, 0, 255] : [255, 0, 0, 0],*/
            }
        ];

    }
    render() {
        return (
            <PageContainer>
                <HeaderContainer>
                    <div className='row'>
                        <div className='col-12' style={{textAlign: 'center'}}>
                            <ContentHeader>
                                {get(this.props.graph, `geo[${parseInt(this.props.activeCousubid)}].name`, '')} Context
                            </ContentHeader>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            {this.renderStats(['Population', 'Household Income Below Poverty Level', 'Median Household Income', 'Median Property Value', 'Median Age', 'Number of Employees'], 'horizontal')}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-8'>
                            <SectionBox>
                                <RenderConfig
                                    config={{'County Description': config['County Description']}}
                                    user={this.props.user}
                                    showTitle={false}
                                    showHeader={false}
                                />
                            </SectionBox>
                        </div>
                        <div className='col-4'>

                            <div style={{height: '100%', width: '100%'}}>
                                <SvgMap layers={ this.generateLayers() }
                                        height={ this.props.height }
                                        viewport={ Viewport() }
                                        //controls={ this.generateMapControls() }
                                        padding={ 5 }
                                        bounds={ this.props.bounds }/>
                            </div>
                        </div>
                    </div>

                </HeaderContainer>
            </PageContainer>
        )
    }
}

LocalContext.defaultProps = {
    yearDelta: 0,
    height: 300,
    dragPan: true,
    scrollZoom: true,
    dragRotate: true,
    padding: null,
    mapLegendLocation: "bottom-left",
    mapLegendSize: "large",
    mapControlsLocation: "top-left",
    hazard: null,
    allTime: false,
    geoLevel: 'counties',
}
const mapStateToProps = (state, ownProps) => {
    return {
        activePlan: state.user.activePlan || null,
        activeCousubid: state.user.activeCousubid || null,
        activeGeoid: state.user.activeGeoid || null,
        router: state.router,
        graph: state.graph,
        user: state.user,
        geo: state.geo
    };
};

const mapDispatchToProps = {
    getChildGeo,
    getGeoMesh,
    getGeoMerge
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(LocalContext))