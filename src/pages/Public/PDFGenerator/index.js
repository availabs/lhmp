import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import get from "lodash.get";
import config from "pages/auth/Plan/config/risk-config";
import {setActiveCousubid} from 'store/modules/user'
import './style.css'
import ElementFactory from "../theme/ElementFactory";
const COLS = ['body'];
const emptyBody = ['<p></p>', '']

class About extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            imageReq: 'annex-image'
        }
        this.getCurrentImageKey = this.getCurrentImageKey.bind(this)
        this.getCurrentKey = this.getCurrentKey.bind(this)
    }

    getCurrentImageKey = (requirement, county = false) =>
        this.props.scope === 'global' ?
            requirement :
            requirement + '-' + this.props.user.activePlan + '-' + `${county ? this.props.user.activeGeoid : this.props.user.activeCousubid}`

    getCurrentKey = (requirement, county = false) =>
        this.props.scope === 'global' ?
            requirement :
            requirement + '-' + this.props.user.activePlan + '-' + `${county ? this.props.user.activeGeoid : this.props.user.activeCousubid}`

    async fetchFalcorDeps() {
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined' || !this.props.user.activePlan) return Promise.resolve();
        let contentId = this.getCurrentImageKey(this.state.imageReq);
        let contentIdCounty = this.getCurrentImageKey(this.state.imageReq, true);
        let allRequirements = [];

        // get reqs to filter by jurisdictions
        let formType = 'filterRequirements',
            formAttributes = ['municipality', 'hiddenRequirements']

        let response = await this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'length'])
        let length = get(response, ['json', 'forms', formType, 'byPlanId', this.props.activePlan, 'length'], 0);
        if (length > 0) {
            await this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'byIndex', [{
                from: 0,
                to: length - 1
            }], ...formAttributes])
        }

        Object.keys(config)
            .filter(section => config[section].filter(item => !item.onlyAdmin).length > 0)
            .map(section => config[section]
                .filter(item => !item.onlyAdmin)
                .map(requirement => allRequirements.push(['content', 'byId', this.getCurrentKey(requirement.requirement), COLS])))

        return this.props.falcor.get(
            ['geo', parseInt(this.props.activeCousubid), 'name'],
            ['content', 'byId', [contentId], COLS],
            ['content', 'byId', [contentIdCounty], COLS],
            ...allRequirements
        ).then(contentRes => {
            let tmpImg = get(contentRes, `json.content.byId.${contentId}.body`, null)
            tmpImg = tmpImg && !emptyBody.includes(tmpImg.trim()) ? tmpImg :
                get(config["Annex Image"][0], `pullCounty`) ?
                    get(contentRes, `json.content.byId.${contentIdCounty}.body`, '/img/sullivan-min.png') :
                    tmpImg || '/img/sullivan-min.png'

            this.setState({
                image: tmpImg,
                'currentKey': contentId,
                status: get(contentRes.json.content.byId[contentId], `attributes.status`, ''),
            })
        })
    }
    componentDidMount() {
        this.addElement()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activeCousubid !== this.props.activeCousubid || prevState.currentKey !== this.getCurrentImageKey(this.state.imageReq)) {
            this.fetchFalcorDeps()
        }
    }

    getReqsToFilter() {
        let formType = 'filterRequirements'
        let graph = get(this.props.falcor.getCache(), [`forms`], null);
        let id = get(graph, [formType, 'byPlanId', this.props.activePlan, 'byIndex'], {});
        let reqToFilter;

        if (id) {
            id = Object.keys(id)
                .map(i => get(id[i], ['value', 2], null))
                .filter(i => i)
            let data = id.map(i => get(graph, ['byId', i], {}))
            if (data) {
                reqToFilter =
                    Object.keys(data)
                        .reduce((a, g) => {
                            let tmpReqs = get(data[g], `value.attributes`, {})
                            Object.keys(tmpReqs)
                                .filter(tr => tr === this.props.activeCousubid && tmpReqs[tr])
                                .forEach(tr => a.push(...tmpReqs[tr].slice(2, -2).split(',').filter(r => r !== "")))
                            return a
                        }, [])
            }
        }
        return reqToFilter
    }

    // async setupPagedJS() {
    //     window.PagedConfig = {
    //         auto: false,
    //     };
    //     const previewer = require('pagedjs/dist/paged.legacy.polyfill');
    //     const printRoot = document.querySelector('#config');
    //     const printPreview = document.querySelector('#preview');
    //     await previewer.preview(printRoot, false, printPreview);
    // }
    addElement () {
        // create a new div element
        const newDiv = document.createElement("script");

        newDiv.setAttribute('src', "https://unpkg.com/pagedjs/dist/paged.polyfill.js");

        const currentDiv = document.getElementById("preview");
        document.body.insertBefore(newDiv, currentDiv);
    }


    render() {
        let sample = (
            <div id="config">
                {
                    Object.keys(config)
                        .map(section => {
                            return (
                                <div className='pdfPage'>
                                    <h4 className='pdfHeader'>{section}</h4>
                                    <div className='pdfContent'>
                                        {
                                            config[section].map(requirement => {
                                                    return (
                                                        <div className='pdfElement'>
                                                            <ElementFactory
                                                                element={requirement}
                                                                user={this.props.user}
                                                                autoLoad={true}
                                                                pureElement={true}
                                                            />
                                                        </div>
                                                    )
                                                }
                                                )
                                        }
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
        )
        return sample
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        user: state.user,
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        graph: state.graph,
        contentGraph: get(state.graph, `content.byId`, {}),
        formData: get(state.graph, [`forms`, 'filterRequirements'], null)
    };
};

const mapDispatchToProps = {setActiveCousubid};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/pdf',
    exact: true,
    name: 'PDF',
    auth: false,
    mainNav: false,
    menuSettings: {
        noMenu: true
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(About))
}];

