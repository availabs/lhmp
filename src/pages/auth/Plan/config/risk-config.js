const config = {
    'Risk Image': [{
        title: 'Risk Image',
        requirement: `risk-image`,
        type: 'image',
        prompt: '',
        intent: '',
        callout: '',
        label:'Image', // Which you would like to see on the form
        height: 250,
        width: 500,
        border: 1,
        icon: 'os-icon-arrow-right7',
        onlyAdmin: true
    }],
    'Header' : [{
        title: 'Risk Quote',
        requirement: 'risk-quote',
        type: 'content',
        prompt: '',
        intent: '',
        callout: '',
        icon: 'os-icon-arrow-right7',
        onlyAdmin: true
    }],
    'Vulnerability' : [
        {
            title: 'Statement',
            requirement: 'Req-B-3B-1',
            type: 'content',
            prompt: 'Provide an overall summary of each jurisdiction’s vulnerability to the identified hazards.',
            intent: 'The plan must provide an overall summary of each jurisdiction’s vulnerability to the identified' +
                ' hazards. The overall summary of vulnerability identifies structures, systems, populations or other' +
                ' community assets as defined by the community that are susceptible to damage and loss from hazard events.' +
                ' a. *Vulnerable assets and potential losses is more than a list of the total exposure of population,' +
                ' structures, and critical facilities in the planning area. An example of an overall summary is a list' +
                ' of key issues or problem statements that clearly describes the community’s greatest vulnerabilities' +
                ' and that will be addressed in the mitigation strategy.',
            icon: 'os-icon-alert-triangle'
        },
        {
            title: 'Inventory',
            requirement: 'Req-B-3B-1B',
            type: 'inventoryTable',
            //align: '',
            intent: 'Overview of loss by asset type by scenario',
            icon: 'os-icon-alert-circle'
        },
        {
            title: 'Critical Facilities',
            requirement: 'Req-NYS-F-2B',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-loader'
        },
        
        {
            title: 'Critical Facilities Table',
            requirement: 'Req-NYS-F-2',
            type: 'criticalFacilitiesTable',
            prompt: '',
            intent: '',
            icon: 'os-icon-loader',
            hideNav: true
        },
         {
            title: 'Social Vulnerability',
            requirement: 'Req-D-2C',
            type: 'sociallyVulnerableDemographicsMap',
            prompt: '',
            intent: '',
            icon: 'os-icon-grid-squares-2'
        },
    ],
        'National Flood Insurance Program (NFIP)' : [
        {
            title: 'NFIP Participation',
            requirement: 'Req-C-2',
            type: 'content',
            prompt: 'Address each jurisdiction’s participation in the NFIP and continued compliance with NFIP requirements, as appropriate.' +
                ' a. Describe FPMP for continued compliance, Adoption and enforcement of floodplain management requirements, including regulating new construction in Special Flood Hazard Areas (SFHAs);\n' +
                '   i.Floodplain identification and mapping, including any local requests for map updates; or' +
                '   ii.Description of community assistance and monitoring activities.' +
                ' b. If jurisdiction is not taking part in NFIP describe why' +
                ' Describe Floodplain Management (include/use current FIRMS, DFIRMS or best available data)' +
                ' Review, describe and discuss NFIP Participation, Program and Repetitive Loss Properties' +
                ' CAV Dates from DEC Received' + 
                ' Policy Information from DEC/FEMA Received' +
                ' Claims Information from DEC/FEMA Received' + 
                ' Repetitive/Severe Repetitive Loss Properties from FEMA Received' + 
                ' Describe commitment to maintaining NFIP compliance',
            intent: 'To demonstrate flood hazard mitigation efforts by the community through NFIP activities. Where FEMA' +
                ' is the official administering Federal agency of the NFIP, participation in the program is a basic community' +
                ' capability and resource for flood hazard mitigation activities.',
            icon: 'os-icon-bar-chart-up'
        },
        {
            title: 'NFIP Properties',
            requirement: 'Req-B-4',
            type: 'Visualizations - NFIP',
            prompt: '',
            intent: 'The plan must describe the types (residential, commercial, institutional, etc.) and estimate the' +
                ' numbers of repetitive loss properties located in identified flood hazard areas.',
            icon: 'os-icon-home'
        },
        {
            title: 'NFIP Problem Areas',
            requirement: 'Req-B-4A',
            type: 'content',
            prompt: 'Using data visualizations and local knowledge add narrative content about the stock of properties' +
                ' that have suffered repetitive damage due to flooding, particularly problem areas that may not be apparent' +
                ' on floodplain maps. How does this relate to mitigation actions/the overall mitigation strategy?',
            intent: 'The plan must describe the types (residential, commercial, institutional, etc.) and estimate the' +
                ' numbers of repetitive loss properties located in identified flood hazard areas. Information on repetitive' +
                ' loss properties helps inform FEMA hazard  mitigation assistance programs under the National Flood Insurance Act.',
            icon: 'os-icon-alert-circle'
        },
    ], 
    
    'Changes in Development' : [
        {
            title: 'Overview',
            requirement: 'Req-D-1A',
            type: 'content',
            prompt: 'The plan must describe changes in development that have occurred in hazard prone areas and increased' +
                ' or decreased the vulnerability of each jurisdiction since the last plan was approved.  If no changes in' +
                ' development impacted the jurisdiction’s overall vulnerability, plan updates may validate the information' +
                ' in the previously approved plan. Was the plan revised to reflect changes in development?',
            intent: 'To ensure that the mitigation strategy continues to address the risk and vulnerabilities to existing' +
                ' and potential development, and takes into consideration possible future conditions that can impact the' +
                ' vulnerability of the community.',
            icon: 'os-icon-repeat'
        },
       
        {
            title: 'Development Zones',
            requirement: 'Req-D-1B',
            type: 'developementZonesFilteredTable',
            filterBy: {zone_type: ['Future Development Zone', 'Recent Development Zone']},
            prompt: '',
            intent: '',
            icon: 'os-icon-grid-squares-2'
        },
        {
            title: 'Development Map',
            requirement: 'Req-D-1C',
            type: 'developementZonesFilteredMap',
            filterBy: {zone_type: ['Future Development Zone', 'Recent Development Zone']},
            prompt: '',
            intent: '',
            icon: 'os-icon-globe'
        },
        {
            title: 'Open Space ',
            requirement: 'Req-E-1A',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-globe'
        },
        {
            title: 'Open Space Statistics',
            requirement: 'Req-E-1B',
            type: 'map?',
            prompt: '',
            intent: '',
            icon: 'os-icon-globe'
        }
    ]
}

export default config