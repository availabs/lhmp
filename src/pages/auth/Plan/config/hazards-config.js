let HAZARD_META  = {
        'wind':{id:'wind', name:'Wind', description: '', sheldus: "Wind", zones: []},
        'wildfire':{id:'wildfire', name:'Wildfire', description: '', sheldus: "Wildfire", zones: []},
        'tsunami':{id:'tsunami', name:'Tsunami/Seiche', description: '', sheldus: "Tsunami/Seiche", zones: []},
        'tornado':{id:'tornado', name:'Tornado', description: '', sheldus: "Tornado", zones: []},
        'riverine':{id:'riverine', name:'Flooding', description: '', sheldus: "Flooding", zones: ['X', 'A', 'AR','AE','AO','VE']},
        'lightning':{id:'lightning', name:'Lightning', description: '', sheldus: "Lightning", zones: []},
        'landslide':{id:'landslide', name:'Landslide', description: '', sheldus: "Landslide", zones: []},
        'icestorm':{id:'icestorm', name:'Ice Storm', description: '', sheldus: "", zones: []},
        'hurricane':{id:'hurricane', name:'Hurricane', description: '', sheldus: "Hurricane/Tropical Storm", zones: []},
        'heatwave':{id:'heatwave', name:'Heat Wave', description: '', sheldus: "Heat", zones: []},
        'hail':{id:'hail', name:'Hail', description: '', sheldus:"Hail", zones: []},
        'earthquake':{id:'earthquake', name:'Earthquake', description: '', sheldus: "Earthquake", zones: []},
        'drought':{id:'drought', name:'Drought', description: '', sheldus: "Drought", zones: []},
        'avalanche':{id:'avalanche', name:'Avalanche', description: '', sheldus: "Avalanche", zones: []},
        'coldwave':{id:'coldwave', name:'Coldwave', description: '', zones: []},
        'winterweat':{id:'winterweat', name:'Snow Storm', description: '', sheldus: "Winter Weather", zones: []},
        'volcano':{id:'volcano', name:'Volcano', description: '', zones: []},
        'coastal': {id:'coastal', name:'Coastal Hazards', description:'',sheldus: "Coastal Hazards", zones: []},

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
		...HazardConfig
	]
}
export default config;