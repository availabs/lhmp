import get from "lodash.get";

let HAZARD_META  = {
        'wind':{id:'wind', name:'Wind', description: '', sheldus: "Wind", zones: [], icon: 'os-icon-edit-1'},
        'wildfire':{id:'wildfire', name:'Wildfire', description: '', sheldus: "Wildfire", zones: [], icon: 'os-icon-edit-1'},
        'tsunami':{id:'tsunami', name:'Tsunami/Seiche', description: '', sheldus: "Tsunami/Seiche", zones: [], icon: 'os-icon-edit-1'},
        'tornado':{id:'tornado', name:'Tornado', description: '', sheldus: "Tornado", zones: []},
        'riverine':{id:'riverine', name:'Flooding', description: '', sheldus: "Flooding", zones: ['X', 'A', 'AR','AE','AO','VE'], icon: 'os-icon-edit-1'},
        'lightning':{id:'lightning', name:'Lightning', description: '', sheldus: "Lightning", zones: [], icon: 'os-icon-edit-1'},
        'landslide':{id:'landslide', name:'Landslide', description: '', sheldus: "Landslide", zones: [], icon: 'os-icon-edit-1'},
        'icestorm':{id:'icestorm', name:'Ice Storm', description: '', sheldus: "", zones: [], icon: 'os-icon-edit-1'},
        'hurricane':{id:'hurricane', name:'Hurricane', description: '', sheldus: "Hurricane/Tropical Storm", zones: [], icon: 'os-icon-edit-1'},
        'heatwave':{id:'heatwave', name:'Heat Wave', description: '', sheldus: "Heat", zones: [], icon: 'os-icon-edit-1'},
        'hail':{id:'hail', name:'Hail', description: '', sheldus:"Hail", zones: [], icon: 'os-icon-edit-1'},
        'earthquake':{id:'earthquake', name:'Earthquake', description: '', sheldus: "Earthquake", zones: [], icon: 'os-icon-edit-1'},
        'drought':{id:'drought', name:'Drought', description: '', sheldus: "Drought", zones: [], icon: 'os-icon-edit-1'},
        'avalanche':{id:'avalanche', name:'Avalanche', description: '', sheldus: "Avalanche", zones: [], icon: 'os-icon-edit-1'},
        'coldwave':{id:'coldwave', name:'Coldwave', description: '', zones: [], icon: 'os-icon-edit-1'},
        'winterweat':{id:'winterweat', name:'Snow Storm', description: '', sheldus: "Winter Weather", zones: [], icon: 'os-icon-edit-1'},
        'volcano':{id:'volcano', name:'Volcano', description: '', zones: [], icon: 'os-icon-edit-1'},
        'coastal': {id:'coastal', name:'Coastal Hazards', description:'',sheldus: "Coastal Hazards", zones: [], icon: 'os-icon-edit-1'},
        //'allHaz': {id:'allHaz', name:'All Hazards', description:'',sheldus: "All Hazards", zones: [], icon: ''},

        // --------- No Data ---------------//
        // expansive_soil: {id: 'expansive_soil', name: 'Expansive Soil', sheldus: '' },
        // landsubsidence: {id: 'landsubsidence', name: 'Land Subsidence' },
        // sealevel: {id: 'Sea Level', name: 'Sea Level'},

    }
let HazardConfig = [
    {
        title: ``,
        requirement: `hazard-hero-stat`,
        type: 'HazardHeroStats',
        additionalProps: true,
        showTitle: false,
        prompt: '',
        intent: '',
        callout: '',
        label:'', // Which you would like to see on the form
        height: 500,
        width: 900,
        border: 1,
    },
    {
        title: ``,
        requirement: `hazard-charts`,
        type: 'HazardCharts',
        additionalProps: true,
        filterByHaz: true,
        showTitle: false,
        prompt: '',
        intent: '',
        callout: '',
        label:'', // Which you would like to see on the form
        height: 500,
        width: 900,
        border: 1,
    },
];


Object.keys(HAZARD_META)
    .sort()
    .map(key => {
	HazardConfig.push({
        title: `${HAZARD_META[key].name} Characteristics`,
        requirement: `req-B1-${key}`,
            filterByHaz: true,
        type: 'content',
        prompt: 'Talk about local context for hazard of concern for your area',
        intent: 'Highlight locally specific hazards which have an enhanced profile in the community',
        // callout: 'Highlight locally specific hazards which have an enhanced profile in the community',
        // hideNav: true // hides key from public nav. Displays on page.
         /*2-non-county*/ pullCounty: true,
        ///*2-non-not-provided nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        ///*2-non-delete*/ hideIfNull: true 
    },{
            title: ``,
            requirement: `req-B1-${key}-image`,
            filterByHaz: true,
            type: 'image',
            prompt: '',
            intent: '',
            callout: '',
            label:'Image', // Which you would like to see on the form
            height: 500,
            width: 900,
            border: 1,
            // hideNav: true // hides key from public nav. Displays on page.
            // 2-non-county pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            /*2-non-delete*/ hideIfNull: true
        },
        {
            title: `::activeGeo - Local Impacts - ${HAZARD_META[key].name}`,
            requirement: `req-B1-${key}-local-impact`,
            filterByHaz: true,
            type: 'content',
            prompt: 'Talk about local context for hazard of concern for your area',
            intent: 'Highlight locally specific hazards which have an enhanced profile in the community',
            // callout: 'Highlight locally specific hazards which have an enhanced profile in the community',
            pullCounty: true,
            hideCounty: false,
            hideJurisdictionAnnex: false
        })
})

HazardConfig.push({
        title: 'All Hazards Characteristics',
        requirement: `req-B1-`,
        filterByHaz: true,
        type: 'content',
        prompt: 'Talk about local context for hazard of concern for your area',
        intent: 'Highlight locally specific hazards which have an enhanced profile in the community',
        // callout: 'Highlight locally specific hazards which have an enhanced profile in the community',
        // hideNav: true // hides key from public nav. Displays on page.
        /*2-non-county*/ pullCounty: true,
        ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        ///*2-non-delete*/ hideIfNull: true
    },
    {
        title: ``,
        requirement: `req-B1--image`,
        filterByHaz: true,
        type: 'image',
        prompt: '',
        intent: '',
        // callout: '',
        label:'Image', // Which you would like to see on the form
        height: 400,
        width: 500,
        border: 1,
        // onlyAdmin: true,
        // hideNav: true // hides key from public nav. Displays on page.
        /*2-non-county*/ pullCounty: true,
        ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        ///*2-non-delete*/ hideIfNull: true
    },
    {
        title: `::activeGeo - Local Impacts - ::haz`,
        requirement: `req-B1--local-impact`,
        filterByHaz: true,
        type: 'content',
        prompt: 'Talk about local context for hazard of concern for your area',
        intent: 'Highlight locally specific hazards which have an enhanced profile in the community',
        // callout: 'Highlight locally specific hazards which have an enhanced profile in the community',
        pullCounty: true
    })

const config =  {
	'Local Hazards' : [
        ...HazardConfig,
        {
            title: 'Hazard Overview',
            requirement: `req-B1-hazard-overview`,
            filterByHaz: true,
            type: 'content',
            prompt: 'Talk about local context for hazard of concern for your area',
            intent: 'Highlight locally specific hazards which have an enhanced profile in the community',
            // callout: 'Highlight locally specific hazards which have an enhanced profile in the community'
        },
        {
            title: 'Other Hazards',
            requirement: `req-B1-other-hazards`,
            filterByHaz: true,
            type: 'content',
            prompt: 'Talk about local context for hazard of concern for your area',
            intent: 'Highlight locally specific hazards which have an enhanced profile in the community',
        },
        {
            title: 'Other Hazards Local Impact',
            requirement: `req-B1-other-hazards-local-impact`,
            filterByHaz: true,
            type: 'content',
            prompt: 'Talk about local context for hazard of concern for your area',
            intent: 'Highlight locally specific hazards which have an enhanced profile in the community',
            // callout: 'Highlight locally specific hazards which have an enhanced profile in the community',
            hideIfNull: true
        },
        {
            title: '::activeGeo - Local Hazards of Concern Table - ::haz',
            requirement: `req-B1-local-haz-concern-table`,
            type: 'localHazardsOfConcernTable',
            hideGeoProp: true,
            config: {
                // description: 'This table identifies hazard events specific to each jurisdiction with a primary focus on occurrence, severity and impact. This information was obtained directly from jurisdictional representatives during community-specific interviews.',
                title: '',
                //requirement: 'Req-C-1A',
                type: 'formTable',
                //fontSize: '0.70em',
                height: '600px',
                align: 'full',
                config: {
                    type: 'hazardid',
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
                        // {
                        //     Header: 'EXTENT_DESCRIPTION',
                        //     accessor: 'extent_description',
                        //     sort: true,
                        //     filter: 'default'
                        // },
                        {
                            Header: 'LOCATION_DESCRIPTION',
                            accessor: 'location_description',
                            width: 50
                        },
                    ],
                    matchSubstring: true
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
            },
            prompt: '',
            intent: '',
            callout: ''
        },

        {
            title: 'Events with Highest Reported Loss in Dollars',
            requirement: `req-B1-hazard-events-table`,
            type: 'HazardEventsTable',
            prompt: '',
            intent: '',
            callout: ''
        },

        {
            title: '',
            requirement: `hazard-loss-municipality`,
            type: 'HazardLossByMunicipality',
            showTitle: false,
            prompt: '',
            intent: '',
            callout: ''
        },
        {
            title: 'Presidential Disaster Declarations',
            requirement: `presidential-disaster-declarations`,
            type: 'PresidentialDisasterDeclarations',
            showTitle: false,
            prompt: '',
            intent: '',
            callout: ''
        },
        {
            title: '',
            requirement: `hazard-events-map`,
            type: 'HazardEventsPublicMap',
            showTitle: false,
            prompt: '',
            intent: '',
            callout: ''
        },
	]
}
export default config;