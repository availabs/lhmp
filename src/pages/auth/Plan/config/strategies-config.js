const config = {
    Capabilities : [
        {
            requirement: 'Req-C-1A',
            type: 'content',
            prompt: 'Document each jurisdiction’s existing authorities, policies, programs and resources and its ability' +
                ' to expand on and improve these existing policies and programs ' +
                ' a. Examples: Staff involved local planning activities, public works/emergency management, funding through' +
                ' taxing authority and annual budgets, regulatory authorities for comp. Planning building codes and ordinances',
            intent: 'To ensure that each jurisdiction evaluates its capabilities to accomplish hazard mitigation actions,' +
                ' through existing mechanisms. This is especially useful for multi‐jurisdictional plans where local' +
                ' capability varies widely.'
        },
        {
            requirement: 'Req-C-1A-1',
            type: 'table',
            prompt: 'Document each jurisdiction’s existing authorities, policies, programs and resources and its ability' +
                ' to expand on and improve these existing policies and program ' +
                ' a. Examples: Staff involved local planning activities,' +
                ' public works/emergency management, funding through taxing authority and annual budgets, regulatory authorities' +
                ' for comp. Planning building codes and ordinances',
            intent: 'To ensure that each jurisdiction evaluates its capabilities to accomplish hazard mitigation actions,' +
                ' through existing mechanisms. This is especially useful for multi‐jurisdictional plans where local' +
                ' capability varies widely.'
        },
        {
            requirement: 'Req-C-1B',
            type: 'table',
            prompt: '',
            intent: ''
        },
        {
            requirement: 'Req-C-2',
            type: 'content',
            prompt: 'Address each jurisdiction’s participation in the NFIP and continued compliance with NFIP requirements, as appropriate.' +
                ' a. Describe FPMP for continued compliance, Adoption and enforcement of floodplain management requirements, including regulating new construction in Special Flood Hazard Areas (SFHAs);\n' +
                '   i.Floodplain identification and mapping, including any local requests for map updates; or' +
                '   ii.Description of community assistance and monitoring activities.' +
                ' b. If jurisdiction is not taking part in NFIP describe why',
            intent: 'To demonstrate flood hazard mitigation efforts by the community through NFIP activities. Where FEMA' +
                ' is the official administering Federal agency of the NFIP, participation in the program is a basic community' +
                ' capability and resource for flood hazard mitigation activities.'
        },
        {
            requirement: 'Req-B-4',
            type: 'Visualizations - NFIP',
            prompt: '',
            intent: 'The plan must describe the types (residential, commercial, institutional, etc.) and estimate the' +
                ' numbers of repetitive loss properties located in identified flood hazard areas.'
        },
        {
            requirement: 'Req-B-4A',
            type: 'content',
            prompt: 'Using data visualizations and local knowledge add narrative content about the stock of properties' +
                ' that have suffered repetitive damage due to flooding, particularly problem areas that may not be apparent' +
                ' on floodplain maps. How does this relate to mitigation actions/the overall mitigation strategy?',
            intent: 'The plan must describe the types (residential, commercial, institutional, etc.) and estimate the' +
                ' numbers of repetitive loss properties located in identified flood hazard areas. Information on repetitive' +
                ' loss properties helps inform FEMA hazard  mitigation assistance programs under the National Flood Insurance Act.'
        },
    ],
    Actions: [
        {
            requirement: 'Req-C-4',
            type: 'form',
            prompt: 'Action form to be designed later. The plan must include a mitigation strategy that 1) analyzes actions' +
                ' and/or projects that the jurisdiction considered to reduce the impacts of hazards identified in the risk' +
                ' assessment, and 2) identifies the actions and/or projects that the jurisdiction intends to implement.' +
                ' a. Each jurisdiction participating in the plan must have mitigation actions specific to that jurisdiction' +
                ' that are based on the community’s risk and  vulnerabilities, as well as community priorities.' +
                ' b. The plan must identify the position, office, department, or agency responsible for implementing and' +
                ' administering the action (for each jurisdiction), and identify potential funding sources and expected' +
                ' timeframes for completion. ',
            intent: 'To ensure the hazard mitigation actions are based on the identified hazard vulnerabilities, are within' +
                ' the capability of each jurisdiction, and reduce or avoid future losses.  This is the heart of the' +
                ' mitigation plan, and is essential to leading communities to reduce their risk.  Communities, not FEMA,' +
                ' “own” the hazard mitigation actions in the strategy.' +
                ' a. Mitigation actions and projects means a hazard mitigation action, activity or process (for example,' +
                '  adopting a building code) or it can be a physical project (for example, elevating structures or retrofitting' +
                ' critical  infrastructure) designed to reduce or eliminate the long term risks from hazards.' +
                ' b. Integrate elements of Req-C-5 and Req-C-6'
        },
        {
            requirement: 'Req-D-2',
            type: 'form',
            prompt: 'Describe the status of hazard mitigation actions in the previous plan by identifying those that have' +
                ' been completed or not completed. For actions that have not been completed, the plan must either describe' +
                ' whether the action is no longer relevant or be included as part of the updated action plan.',
            intent: 'To evaluate and demonstrate progress made in the past five years in achieving goals and implementing' +
                ' actions outlined in their mitigation strategy.'
        },
        {
            requirement: 'Req-C-5A',
            type: 'content',
            prompt: 'Describe the criteria used for prioritizing implementation of the actions.' +
                ' a. The plan must demonstrate when prioritizing hazard mitigation actions that the local jurisdictions' +
                ' considered the benefits that would result from the hazard mitigation actions versus the cost of those' +
                ' actions.  The requirement is met as long as the economic considerations are summarized in the plan as' +
                ' part of the community’s analysis.  A complete benefit‐cost analysis is not required.  Qualitative benefits' +
                ' (for example, quality of life, natural and beneficial values, or other “benefits”) can also be included' +
                ' in how actions will be prioritized.',
            intent: 'To identify how the plan will directly lead to implementation of the hazard mitigation actions.' +
                '  As opportunities arise for actions or projects to be  implemented, the responsible entity will be able' +
                ' to take action towards completion of the activities.'
        },
    ],
    Objectives: [
        {
            requirement: 'Req-C-3-A',
            type: 'content',
            prompt: 'Include goals to reduce/avoid long-term vulnerabilities to the identified hazards. These goals are' +
                ' broad policy statements that explain what is to be achieved through mitigation plan implementation.',
            intent: 'To guide the development and implementation of hazard mitigation actions for the community(ies).' +
                '  Goals are statements of the community’s visions for the future.'
        },
        {
            requirement: 'Req-C-3-A-1',
            type: 'form',
            prompt: 'Include goals to reduce/avoid long-term vulnerabilities to the identified hazards. These goals are' +
                ' broad policy statements that explain what is to be achieved through mitigation plan implementation.',
            intent: 'To guide the development and implementation of hazard mitigation actions for the community(ies).' +
                '  Goals are statements of the community’s visions'
        },
        {
            requirement: 'Req-D-3',
            type: 'content',
            prompt: ' If applicable, describe changes to goals and objectives.',
            intent: 'To ensure the plan reflects current conditions, including financial, legal, and political realities' +
                ' as well as post‐disaster conditions.'
        },
    ]
}

export default config