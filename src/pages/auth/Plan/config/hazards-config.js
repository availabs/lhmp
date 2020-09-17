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

        // --------- No Data ---------------//
        // expansive_soil: {id: 'expansive_soil', name: 'Expansive Soil', sheldus: '' },
        // landsubsidence: {id: 'landsubsidence', name: 'Land Subsidence' },
        // sealevel: {id: 'Sea Level', name: 'Sea Level'},

    }
let HazardConfig = Object.keys(HAZARD_META).map(key => {
	return {
			title: HAZARD_META[key].name,
			requirement: `req-B1-${key}`,
			type: 'content',
			prompt: 'Talk about local context for hazard of concern for your area',
			intent: 'Highlight locally specific hazards which have an enhanced profile in the community',
			callout: 'Highlight locally specific hazards which have an enhanced profile in the community'
		}
})

console.log('HazardConfig',)
const config =  {
	'Local Hazards' : [
        {
            title: 'Hazard Overview',
            requirement: `req-B1-hazard-overview`,
            type: 'content',
            prompt: 'Talk about local context for hazard of concern for your area',
            intent: 'Highlight locally specific hazards which have an enhanced profile in the community',
            callout: 'Highlight locally specific hazards which have an enhanced profile in the community'
        },

		...HazardConfig,
        {
            title: 'Other Hazards',
            requirement: `req-B1-other-hazards`,
            type: 'content',
            prompt: 'Talk about local context for hazard of concern for your area',
            intent: 'Highlight locally specific hazards which have an enhanced profile in the community',
            callout: 'Highlight locally specific hazards which have an enhanced profile in the community'
        },
	]
}
export default config;