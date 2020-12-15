export const colors = {
    'Does not Apply' : 'gray',
    'Started' : '#f7f714',
    'Ready for review': '#1f90f2',
    'Requirement not met': '#f2351f',
    'Requirement met': '#0fd95c',
}
let config = {
    elements: [
        {
            element: 'A1',
            requirements_from_software: `Req-A-1A, Req-A-1B, Req-A-1D, Req-A-1E, Req-A-1F, Req-A-1G, Req-A-1H`,
            objective: 'Does the Plan document the planning process, including how it was prepared and who was involved in ' +
                'the process for each jurisdiction? 44 CFR 201.6(c)(1)',
            intent: 'To inform the public and other readers about the overall approach to the plan’s development and serve ' +
                'as a permanent record of how decisions were made and who was involved. This record also is useful for the ' +
                'next plan update.',
            element_requirements: 'a. Documentation of how the plan was prepared must include the\n' +
                'schedule or timeframe and activities that made up the plan’s\n' +
                'development as well as who was involved. Documentation\n' +
                'typically is met with a narrative description, but may also include,\n' +
                'for example, other documentation such as copies of meeting\n' +
                'minutes, sign‐in sheets, or newspaper articles.\n' +
                'Document means provide the factual evidence for how the\n' +
                'jurisdictions developed the plan.\n' +
                'b. The plan must list the jurisdiction(s) participating in the plan that\n' +
                'seek approval.\n' +
                'c. The plan must identify who represented each jurisdiction. The\n' +
                'Plan must provide, at a minimum, the jurisdiction represented and\n' +
                'the person’s position or title and agency within the jurisdiction.\n' +
                'd. For each jurisdiction seeking plan approval, the plan must\n' +
                'document how they were involved in the planning process. For\n' +
                'example, the plan may document meetings attended, data\n' +
                'provided, or stakeholder and public involvement activities offered.\n' +
                'Jurisdictions that adopt the plan without documenting how they\n' +
                'participated in the planning process will not be approved.\n' +
                'Involved in the process means engaged as participants and given\n' +
                'the chance to provide input to affect the plan’s content. This is\n' +
                'more than simply being invited (See “opportunity to be involved\n' +
                'in the planning process” in A2 below) or only adopting the plan.\n' +
                'e. Plan updates must include documentation of the current planning\n' +
                'process undertaken to update the plan.',
            municipal: 'true',
            county: 'true',
        },
        {
            element: 'A2',
            requirements_from_software: `Req-A-2, Req-A-2A, Req-A-2B, Req-A-1F`,
            objective: 'Does the Plan document an opportunity for neighboring communities, local and regional agencies ' +
                'involved in hazard mitigation activities, agencies that have the authority to regulate development as ' +
                'well as other interests to be involved in the planning process? 44 CFR 201.6(b)(2)',
            intent: 'To demonstrate a deliberative planning process that involves stakeholders with the data and expertise ' +
                'needed to develop the plan, with responsibility or authority to implement hazard mitigation activities, ' +
                'and who will be most affected by the plan’s outcomes.',
            element_requirements: 'a. The plan must identify all stakeholders involved or given an\n' +
                'opportunity to be involved in the planning process. At a\n' +
                'minimum, stakeholders must include:\n' +
                '1)Local and regional agencies involved in hazard mitigation\n' +
                'activities;\n' +
                '2)Agencies that have the authority to regulate development; and\n' +
                '3)Neighboring communities.\n' +
                'An opportunity to be involved in the planning process means that\n' +
                'the stakeholders are engaged or invited as participants and given\n' +
                'the chance to provide input to affect the plan’s content.\n' +
                'b. The Plan must provide the agency or organization represented\n' +
                'and the person’s position or title within the agency.\n' +
                'c. The plan must identify how the stakeholders were invited to\n' +
                'participate in the process.\n' +
                'Examples of stakeholders include, but are not limited to:\n' +
                ' Local and regional agencies involved in hazard mitigation\n' +
                'include public works, zoning, emergency management, local\n' +
                'floodplain administrators, special districts, and GIS\n' +
                'departments.\n' +
                ' Agencies that have the authority to regulate development\n' +
                'include planning and community development departments,\n' +
                'building officials, planning commissions, or other elected\n' +
                'officials.\n' +
                ' Neighboring communities include adjacent counties and\n' +
                'municipalities, such as those that are affected by similar\n' +
                'hazard events or may be partners in hazard mitigation and\n' +
                'response activities.\n' +
                ' Other interests may be defined by each jurisdiction and will\n' +
                'vary with each one. These include, but are not limited to,\n' +
                'business, academia, and other private and non‐profit\n' +
                'interests depending on the unique characteristics of the\n' +
                'community.',
            municipal: 'true',
            county: 'true'
        },
        {
            element: 'A3',
            requirements_from_software: `Req-A-3A, Req-A-2`,
            objective: 'Does the Plan document how the public was involved in the planning process during the drafting ' +
                'stage? 44 CFR 201.6(b)(1) and 201.6(c)(1)',
            intent: 'To ensure citizens understand what the community is doing on their behalf, and to provide a chance ' +
                'for input on community vulnerabilities and mitigation activities that will inform the plan’s content. ' +
                'Public involvement is also an opportunity to educate the public about hazards and risks in the community, ' +
                'types of activities to mitigate those risks, and how these impact them.',
            element_requirements: 'a. The plan must document how the public was given the opportunity to be involved in ' +
                'the planning process and how their feedback was incorporated into the plan. Examples include, ' +
                'but are not limited to, sign‐in sheets from open meetings, interactive\n' +
                'websites with drafts for public review and comment,\n' +
                'questionnaires or surveys, or booths at popular community\n' +
                'events.\n' +
                'b. The opportunity for participation must occur during the plan\n' +
                'development, which is prior to the comment period on the final\n' +
                'plan and prior to the plan approval / adoption.',
            municipal: false,
            county: true
        },
        {
            element: 'A4',
            requirements_from_software: `Req-A-4A, Req-A-4B, Req-A-4C`,
            objective: 'Does the Plan document the review and incorporation of existing plans, studies, reports, and ' +
                'technical information? 44 CFR 201.6(b)(3)',
            intent: 'To identify existing data and information, shared objectives, and past and ongoing activities that ' +
                'can help inform the mitigation plan. It also helps identify the existing capabilities and planning ' +
                'mechanisms to implement the mitigation strategy.',
            element_requirements: 'a. The plan must document what existing plans, studies, reports, and technical ' +
                'information were reviewed. Examples of the types of existing sources reviewed include, but are not ' +
                'limited to, the state hazard mitigation plan, local comprehensive plans, hazard specific reports, ' +
                'and flood insurance studies.\n' +
                'b. The plan must document how relevant information was incorporated into the mitigation plan. ' +
                'Incorporate means to reference or include information from other\n' +
                'existing sources to form the content of the mitigation plan.',
            municipal: 'false',
            county: 'true'
        },
        {
            element: 'A5',
            requirements_from_software: `Req-A-5`,
            objective: 'Is there discussion on how the community(ies) will continue public participation in the plan ' +
                'maintenance process? 44 CFR 201.6(c)(4)(iii)',
            intent: 'To identify how the public will continue to have an opportunity to participate in the plan’s ' +
                'maintenance and implementation over time.',
            element_requirements: 'a. The plan must describe how the jurisdiction(s) will continue to\n' +
                'seek public participation after the plan has been approved and\n' +
                'during the plan’s implementation, monitoring and evaluation.\n' +
                'Participation means engaged and given the chance to provide\n' +
                'feedback. Examples include, but are not limited to, periodic\n' +
                'presentations on the plan’s progress to elected officials, schools or\n' +
                'other community groups, annual questionnaires or surveys, public\n' +
                'meetings, postings on social media and interactive websites.',
            municipal: 'false',
            county: 'true'
        },
        {
            element: 'A6',
            requirements_from_software: `Req-A-6, Req-A-6A, Req-A-1E`,
            objective: 'Is there a description of the method and schedule for keeping the plan current (monitoring, ' +
                'evaluating and updating the mitigation plan within a 5‐year cycle)? 44 CFR 201.6(c)(4)(i)',
            intent: 'To establish a process for jurisdictions to track the progress of the plan’s implementation. This ' +
                'also serves as the basis of the next plan update.',
            element_requirements: 'a. The plan must identify how, when, and by whom the plan will be\n' +
                'monitored. Monitoring means tracking the implementation of the\n' +
                'plan over time. For example, monitoring may include a system for\n' +
                'tracking the status of the identified hazard mitigation actions.\n' +
                'b. The plan must identify how, when, and by whom the plan will be\n' +
                'evaluated. Evaluating means assessing the effectiveness of the\n' +
                'plan at achieving its stated purpose and goals.\n' +
                'c. The plan must identify how, when, and by whom the plan will be\n' +
                'updated. Updating means reviewing and revising the plan at least\n' +
                'once every five years.\n' +
                'd. The plan must include the title of the individual or name of the\n' +
                'department/ agency responsible for leading each of these efforts.',
            municipal: 'false',
            county: 'true'
        },
        {
            element: 'B1',
            requirements_from_software:
                'req-B1-, req-B1--local-impact, req-B1-local-haz-concern-table,' +
                'req-B1-riverine, req-B1-riverine-local-impact, req-B1-hurricane, req-B1-hurricane-local-impact, req-B1-tornado, req-B1-tornado-local-impact,' +
                'req-B1-landslide, req-B1-landslide-local-impact, req-B1-wind, req-B1-wind-local-impact, req-B1-wildfire, req-B1-wildfire-local-impact,' +
                'req-B1-tsunami, req-B1-tsunami-local-impact, req-B1-lightning, req-B1-lightning-local-impact, req-B1-icestorm, req-B1-icestorm-local-impact,'+ 
                'req-B1-coastal, req-B1-coastal-local-impact, req-B1-heatwave, req-B1-heatwave-local-impact, req-B1-hail, req-B1-hail-local-impact,' +
                'req-B1-earthquake, req-B1-earthquake-local-impact, req-B1-drought, req-B1-drought-local-impact,  req-B1-avalanche, req-B1-avalanche-local-impact,' +
                'req-B1-coldwave, req-B1-coldwave-local-impact, req-B1-winterweat, req-B1-winterweat-local-impact, req-B1-volcano, req-B1-volcano-local-impact,',          
            objective: 'Does the Plan include a description of the type, location, and extent of all natural hazards ' +
                'that can affect each jurisdiction? 44 CFR 201.6(c)(2)(i) and 44 CFR 201.6(c)(2)(iii)',
            intent: 'To understand the potential and chronic hazards affecting the planning area in order to identify ' +
                'which hazard risks are most significant and which jurisdictions or locations are most adversely affected. ',
            element_requirements: 'a. The plan must include a description of the natural hazards that\n' +
                'can affect the jurisdiction(s) in the planning area.\n' +
                'A natural hazard is a source of harm or difficulty created by a\n' +
                'meteorological, environmental, or geological event3. The plan\n' +
                'must address natural hazards. Manmade or human‐caused\n' +
                'hazards may be included in the document, but these are not\n' +
                'required and will not be reviewed to meet the requirements for\n' +
                'natural hazards. In addition, FEMA will not require the removal of\n' +
                'this extra information prior to plan approval.\n' +
                'b. The plan must provide the rationale for the omission of any\n' +
                'natural hazards that are commonly recognized to affect the\n' +
                'jurisdiction(s) in the planning area.\n' +
                'c. The description, or profile, must include information on location,\n' +
                'extent, previous occurrences, and future probability for each\n' +
                'hazard. Previous occurrences and future probability are addressed\n' +
                'in sub‐element B2.\n' +
                'The information does not necessarily need to be described or\n' +
                'presented separately for location, extent, previous occurrences,\n' +
                'and future probability. For example, for some hazards, one map\n' +
                'with explanatory text could provide information on location,\n' +
                'extent, and future probability.\n' +
                'Location means the geographic areas in the planning area that are\n' +
                'affected by the hazard. For many hazards, maps are the best way\n' +
                'to illustrate location. However, location may be described in other\n' +
                'formats. For example, if a geographically‐specific location cannot\n' +
                'be identified for a hazard, such as tornados, the plan may state\n' +
                'that the entire planning area is equally at risk to that hazard.\n' +
                'Extent means the strength or magnitude of the hazard. For\n' +
                'example, extent could be described in terms of the specific\n' +
                'measurement of an occurrence on a scientific scale (for example,\n' +
                'Enhanced Fujita Scale, Saffir‐Simpson Hurricane Scale, Richter\n' +
                'Scale, flood depth grids) and/or other hazard factors, such as\n' +
                'duration and speed of onset. Extent is not the same as impacts,\n' +
                'which are described in sub‐element B3.',
            municipal: 'false',
            county: 'true'
        },
        {
            element: 'B2',
            requirements_from_software: `req-B1-hazard-events-table, req-B1-local-haz-concern-table`,
            objective: 'Does the Plan include information on previous occurrences of hazard events and on the probability ' +
                'of future hazard events for each jurisdiction? 44 CFR 201.6(c)(2)(i)',
            intent: 'To understand potential impacts to the community based on information on the hazard events that have ' +
                'occurred in the past and the likelihood they will occur in the future.',
            element_requirements: 'a. The plan must include the history of previous hazard events for\n' +
                'each of the identified hazards.\n' +
                'b. The plan must include the probability of future events for each\n' +
                'identified hazard.\n' +
                'Probability means the likelihood of the hazard occurring and may\n' +
                'be defined in terms of general descriptors (for example, unlikely,\n' +
                'likely, highly likely), historical frequencies, statistical probabilities\n' +
                '(for example: 1% chance of occurrence in any given year), and/or\n' +
                'hazard probability maps. If general descriptors are used, then they\n' +
                'must be defined in the plan. For example, “highly likely” could be\n' +
                'defined as equals near 100% chance of occurrence next year or\n' +
                'happens every year.\n' +
                'c. Plan updates must include hazard events that have occurred since\n' +
                'the last plan was developed.',
            municipal: 'true',
            county: 'true'
        },
        {
            element: 'B3',
            requirements_from_software: `Req-B-3B, req-B1-local-haz-concern-table, Req-B-3B-1, Req-B-3B-2, Req-NYS-F-2, Req-NYS-F-3, Req-B-3B-3, Req-B-3B-4, Req-B-3B-5, Req-B-3A, Req-B-3B-6, Req-B-3B-8, Req-B-4A-1, req-B1-riverine-local-impact,
                req-B1-hurricane-local-impact, req-B1-tornado-local-impact, req-B1-landslide-local-impact, req-B1-wildfire-local-impact, req-B1-tsunami-local-impact, req-B1-lightning-local-impact,
                req-B1-icestorm-local-impact, req-B1-coastal-local-impact, req-B1-heatwave-local-impact, req-B1-hail-local-impact, req-B1-earthquake-local-impact, req-B1-drought-local-impact, req-B1-avalanche-local-impact, req-B1-coldwave-local-impact, req-B1-winterweat-local-impact, req-B1-volcano-local-impact,`,
            objective: 'Is there a description of each identified hazard’s impact on the community as well as an overall ' +
                'summary of the community’s vulnerability for each jurisdiction? 44 CFR 201.6(c)(2)(ii)',
            intent: 'For each jurisdiction to consider their community as a whole and analyze the potential impacts of ' +
                'future hazard events and the vulnerabilities that could be reduced through hazard mitigation actions.',
            element_requirements: 'a. For each participating jurisdiction, the plan must describe the\n' +
                'potential impacts of each of the identified hazards on the\n' +
                'community.\n' +
                'Impact means the consequence or effect of the hazard on the\n' +
                'community and its assets. Assets are determined by the\n' +
                'community and include, for example, people, structures, facilities,\n' +
                'systems, capabilities, and/or activities that have value to the\n' +
                'community. For example, impacts could be described by\n' +
                'referencing historical disaster impacts and/or an estimate of\n' +
                'potential future losses (such as percent damage of total\n' +
                'exposure).\n' +
                'b. The plan must provide an overall summary of each jurisdiction’s\n' +
                'vulnerability to the identified hazards. The overall summary of\n' +
                'vulnerability identifies structures, systems, populations or other\n' +
                'community assets as defined by the community that are\n' +
                'susceptible to damage and loss from hazard events. A plan will\n' +
                'meet this sub‐element by addressing the requirements described\n' +
                'in §201.6(c)(2)(ii)(A‐C).\n' +
                'Vulnerable assets and potential losses is more than a list of the\n' +
                'total exposure of population, structures, and critical facilities in\n' +
                'the planning area. An example of an overall summary is a list of\n' +
                'key issues or problem statements that clearly describes the\n' +
                'community’s greatest vulnerabilities and that will be addressed in\n' +
                'the mitigation strategy.',
            municipal: 'true',
            county: 'true'
        },
        {
            element: 'B4',
            requirements_from_software: `Req-B-4, Req-B-4A, Req-B-4B, Req-B-B-4C`,
            objective: 'Does the Plan address NFIP insured structures within each jurisdiction that have been repetitively ' +
                'damaged by floods? 44 CFR 201.6(c)(2)(ii)',
            intent: 'To inform hazard mitigation actions for properties that have suffered repetitive damage due to ' +
                'flooding, particularly problem areas that may not be apparent on floodplain maps. Information on repetitive ' +
                'loss properties helps inform FEMA hazard mitigation assistance programs under the National Flood Insurance Act.',
            element_requirements: 'a. The plan must describe the types (residential, commercial,\n' +
                'institutional, etc.) and estimate the numbers of repetitive loss\n' +
                'properties located in identified flood hazard areas.\n' +
                'Repetitive loss properties are those for which two or more losses\n' +
                'of at least $1,000 each have been paid under the National Flood\n' +
                'Insurance Program (NFIP) within any 10‐year period since 1978.\n' +
                'Severe repetitive loss properties are residential properties that\n' +
                'have at least four NFIP payments over $5,000 each and the\n' +
                'cumulative amount of such claims exceeds $20,000, or at least two\n' +
                'separate claims payments with the cumulative amount exceeding\n' +
                'the market value of the building.\n' +
                'Use of flood insurance claim and disaster assistance information is\n' +
                'subject to The Privacy Act of 1974, as amended, which prohibits\n' +
                'public release of the names of policy holders or recipients of\n' +
                'financial assistance and the amount of the claim payment or\n' +
                'assistance. However, maps showing general areas where claims\n' +
                'have been paid can be made public. If a plan includes the names\n' +
                'of policy holders or recipients of financial assistance and the\n' +
                'amount of the claim payment or assistance, the plan cannot be\n' +
                'approved until this Privacy Act covered information is removed\n' +
                'from the plan.',
            municipal: 'true',
            county: 'true'
        },
        {
            element: 'C1',
            requirements_from_software: `Req-C-6, Req-C-1A, Req-C-1B-1B, Req-A-4C`,
            objective: 'Does the plan document each jurisdiction’s existing authorities, policies, programs and resources, ' +
                'and its ability to expand on and improve these existing policies and programs? 44 CFR 201.6(c)(3)',
            intent: 'To ensure that each jurisdiction evaluates its capabilities to accomplish hazard mitigation actions, ' +
                'through existing mechanisms. This is especially useful for multi‐jurisdictional plans where local capability ' +
                'varies widely.',
            element_requirements: 'Does the plan document each jurisdiction’s existing authorities, policies, programs and resources and its ability to expand on and improve these existing policies and programs? (Requirement §201.6(c)(3))'+
                'a. The plan must describe each jurisdiction’s existing authorities,\n' +
                'policies, programs and resources available to accomplish hazard\n' +
                'mitigation.\n' +
                'Examples include, but are not limited to: staff involved in local\n' +
                'planning activities, public works, and emergency management;\n' +
                'funding through taxing authority, and annual budgets; or\n' +
                'regulatory authorities for comprehensive planning, building codes,\n' +
                'and ordinances.',
            municipal: 'true',
            county: 'true'
        },
        {
            element: 'C2',
            requirements_from_software: `Req-C-2A, Req-C-2B, Req-B-4B, Req-B-4, Req-B-4A, Req-B-B-4C`,
            objective: 'Does the Plan address each jurisdiction’s participation in the NFIP and continued compliance with ' +
                'NFIP requirements, as appropriate? 44 CFR 201.6(c)(3)(ii)',
            intent: 'To demonstrate flood hazard mitigation efforts by the community through NFIP activities. Where FEMA ' +
                'is the official administering Federal agency of the NFIP, participation in the program is a basic community ' +
                'capability and resource for flood hazard mitigation activities.',
            element_requirements: 'a. The plan must describe each jurisdiction’s participation in the NFIP\n' +
                'and describe their floodplain management program for continued\n' +
                'compliance. Simply stating “The community will continue to\n' +
                'comply with NFIP,” will not meet this requirement. The\n' +
                'description could include, but is not limited to:\n' +
                ' Adoption and enforcement of floodplain management\n' +
                'requirements, including regulating new construction in\n' +
                'Special Flood Hazard Areas (SFHAs);\n' +
                ' Floodplain identification and mapping, including any local\n' +
                'requests for map updates; or\n' +
                ' Description of community assistance and monitoring\n' +
                'activities.\n' +
                'Jurisdictions that are currently not participating in the NFIP and\n' +
                'where an FHBM or FIRM has been issued may meet this\n' +
                'requirement by describing the reasons why the community does\n' +
                'not participate.',
            municipal: 'true',
            county: 'true'
        },
        {
            element: 'C3',
            requirements_from_software: `Req-C-3-A, Req-D-3`,
            objective: 'Does the Plan include goals to reduce/avoid long‐term vulnerabilities to the identified hazards? 44 CFR 201.6(c)(3)(i)',
            intent: 'To guide the development and implementation of hazard mitigation actions for the community(ies). ' +
                'Goals are statements of the community’s visions for the future.',
            element_requirements: 'a. The plan must include general hazard mitigation goals that\n' +
                'represent what the jurisdiction(s) seeks to accomplish through\n' +
                'mitigation plan implementation.\n' +
                'Goals are broad policy statements that explain what is to be\n' +
                'achieved.\n' +
                'b. The goals must be consistent with the hazards identified in the\n' +
                'plan.',
            municipal: 'true',
            county: 'true'
        },
        {
            element: 'C4',
            requirements_from_software: `Req-NYS-F-7B, Req-NYS-F-7, Req-C-4`,
            objective: 'Does the Plan identify and analyze a comprehensive range of specific mitigation actions and projects ' +
                'for each jurisdiction being considered to reduce the effects of hazards, with emphasis on new and existing ' +
                'buildings and infrastructure? 44 CFR 201.6(c)(3)(ii) and 44 CFR 201.6(c)(3)(iv)',
            intent: 'To ensure the hazard mitigation actions are based on the identified hazard vulnerabilities, are within ' +
                'the capability of each jurisdiction, and reduce or avoid future losses. This is the heart of the mitigation ' +
                'plan, and is essential to leading  communities to reduce their risk. Communities, not FEMA, “own” ' +
                'the hazard mitigation actions in the strategy.',
            element_requirements: 'a. The plan must include a mitigation strategy that 1) analyzes\n' +
                'actions and/or projects that the jurisdiction considered to reduce\n' +
                'the impacts of hazards identified in the risk assessment, and 2)\n' +
                'identifies the actions and/or projects that the jurisdiction intends\n' +
                'to implement.\n' +
                'Mitigation actions and projects means a hazard mitigation action,\n' +
                'activity or process (for example, adopting a building code) or it\n' +
                'can be a physical project (for example, elevating structures or\n' +
                'retrofitting critical infrastructure) designed to reduce or eliminate\n' +
                'the long term risks from hazards. This sub‐element can be met\n' +
                'with either actions or projects, or a combination of actions and\n' +
                'projects.\n' +
                'The mitigation plan may include non‐mitigation actions, such as\n' +
                'actions that are emergency response or operational preparedness\n' +
                'in nature. These will not be accepted as hazard mitigation actions,\n' +
                'but neither will FEMA require these to be removed from the plan\n' +
                'prior to approval.\n' +
                'A comprehensive range consists of different hazard mitigation\n' +
                'alternatives that address the vulnerabilities to the hazards that the\n' +
                'jurisdiction(s) determine are most important.\n' +
                'b. Each jurisdiction participating in the plan must have mitigation\n' +
                'actions specific to that jurisdiction that are based on the\n' +
                'community’s risk and vulnerabilities, as well as community\n' +
                'priorities.\n' +
                'c. The action plan must reduce risk to existing buildings and\n' +
                'infrastructure as well as limit any risk to new development and\n' +
                'redevelopment. With emphasis on new and existing building and\n' +
                'infrastructure means that the action plan includes a consideration\n' +
                'of actions that address the built environment.',
            municipal: '',
            county: 'true'
        },
        {
            element: 'C5',
            requirements_from_software: `Req-C-5A, Req-C-4`,
            objective: 'Does the Plan contain an action plan that  describes how the actions identified will be prioritized ' +
                '(including cost benefit review), implemented, and administered by each jurisdiction? 44 CFR 201.6(c)(3)(iii) ' +
                'and 44 CFR (c)(3)(iv)',
            intent: 'To identify how the plan will directly lead to implementation of the hazard mitigation actions. ' +
                'As opportunities arise for actions or projects to be implemented, the responsible entity will be able to ' +
                'take action towards completion of the activities.',
            element_requirements: 'a. The plan must describe the criteria used for prioritizing\n' +
                'implementation of the actions.\n' +
                'b. The plan must demonstrate when prioritizing hazard mitigation\n' +
                'actions that the local jurisdictions considered the benefits that\n' +
                'would result from the hazard mitigation actions versus the cost of\n' +
                'those actions. The requirement is met as long as the economic\n' +
                'considerations are summarized in the plan as part of the\n' +
                'community’s analysis. A complete benefic‐cost analysis is not\n' +
                'required. Qualitative benefits (for example, quality of life, natural\n' +
                'and beneficial values, or other “benefits”) can also be included in\n' +
                'how actions will be prioritized.\n' +
                'c. The plan must identify the position, office, department, or agency\n' +
                'responsible for implementing and administering the action (for\n' +
                'each jurisdiction), and identify potential funding sources and\n' +
                'expected timeframes for completion.',
            municipal: 'true',
            county: 'true'
        },
        {
            element: 'C6',
            requirements_from_software: `Req-C-6, Req-C-6A, Req-C-1B-1B`,
            objective: 'Does the Plan describe a process by which local governments will integrate the requirements of ' +
                'the mitigation plan into other planning mechanisms, such as comprehensive or capital improvement plans, ' +
                'when appropriate? 44 CFR 201.6(c)(4)(ii)',
            intent: 'To assist communities in capitalizing on all available mechanisms that they have at their disposal ' +
                'to accomplish hazard mitigation and reduce risk.',
            element_requirements: 'a. The plan must describe the community’s process to integrate the\n' +
                'data, information, and hazard mitigation goals and actions into\n' +
                'other planning mechanisms.\n' +
                'b. The plan must identify the local planning mechanisms where\n' +
                'hazard mitigation information and/or actions may be\n' +
                'incorporated.\n' +
                'Planning mechanisms means governance structures that are used\n' +
                'to manage local land use development and community decisionmaking,\n' +
                'such as comprehensive plans, capital improvement plans,\n' +
                'or other long‐range plans.\n' +
                'c. A multi‐jurisdictional plan must describe each participating\n' +
                'jurisdiction’s individual process for integrating hazard mitigation\n' +
                'actions applicable to their community into other planning\n' +
                'mechanisms.\n' +
                'd. The updated plan must explain how the jurisdiction(s)\n' +
                'incorporated the mitigation plan, when appropriate, into other\n' +
                'planning mechanisms as a demonstration of progress in local\n' +
                'hazard mitigation efforts.\n' +
                'e. The updated plan must continue to describe how the mitigation\n' +
                'strategy, including the goals and hazard mitigation actions will be\n' +
                'incorporated into other planning mechanisms.',
            municipal: 'true',
            county: 'true'
        },
        {
            element: 'D1',
            requirements_from_software: `Req-D-1A, Req-D-1B, Req-D-1C`,
            objective: 'Was the plan revised to reflect changes in development? 44 CFR 201.6(d)(3)',
            intent: 'To ensure that the mitigation strategy continues to address the risk and vulnerabilities to existing ' +
                'and potential development, and takes into consideration possible future conditions that can impact ' +
                'the vulnerability of the community.',
            element_requirements: 'a. The plan must describe changes in development that have\n' +
                'occurred in hazard prone areas and increased or decreased the\n' +
                'vulnerability of each jurisdiction since the last plan was approved.\n' +
                'If no changes in development impacted the jurisdiction’s overall\n' +
                'vulnerability, plan updates may validate the information in the\n' +
                'previously approved plan.\n' +
                'Changes in development means recent development (for\n' +
                'example, construction completed since the last plan was\n' +
                'approved), potential development (for example, development\n' +
                'planned or under consideration by the jurisdiction), or conditions\n' +
                'that may affect the risks and vulnerabilities of the jurisdictions (for\n' +
                'example, climate variability, declining populations or projected\n' +
                'increases in population, or foreclosures). Not all development will\n' +
                'affect a jurisdiction’s vulnerability.',
            municipal: 'true',
            county: 'true'
        },
        {
            element: 'D2',
            requirements_from_software: `Req-D-1F, Req-D-1G`,
            objective: 'Was the plan revised to reflect progress in local mitigation efforts? 44 CFR 201.6(d)(3)',
            intent: 'To evaluate and demonstrate progress made in the past five years in achieving goals and implementing ' +
                'actions outlined in their mitigation strategy.',
            element_requirements: 'a. The plan must describe the status of hazard mitigation actions in\n' +
                'the previous plan by identifying those that have been completed\n' +
                'or not completed. For actions that have not been completed, the\n' +
                'plan must either describe whether the action is no longer relevant\n' +
                'or be included as part of the updated action plan.',
            municipal: 'true',
            county: 'true'
        },
        {
            element: 'D3',
            requirements_from_software: `Req-D-3`,
            objective: 'Was the plan revised to reflect changes in priorities? 44 CFR 201.6(d)(3)',
            intent: 'To ensure the plan reflects current conditions, including financial, legal, and political realities ' +
                'as well as post‐disaster conditions.',
            element_requirements: 'a. The plan must describe if and how any priorities changed since the\n' +
                'plan was previously approved.\n' +
                'If no changes in priorities are necessary, plan updates may\n' +
                'validate the information in the previously approved plan.',
            municipal: 'true',
            county: 'true'
        },
        {
            element: 'E1',
            requirements_from_software: `Req-E-1`,
            objective: 'Does the Plan include documentation that the plan has been formally adopted by the governing body ' +
                'of the jurisdiction requesting approval? 44 CFR 201.6(c)(5)',
            intent: 'To demonstrate the jurisdiction’s commitment to fulfilling the hazard mitigation goals outlined in ' +
                'the plan, and to authorize responsible agencies to execute their responsibilities.',
            element_requirements: 'a. The plan must include documentation of plan adoption, usually a\n' +
                'resolution by the governing body or other authority.\n' +
                'If the local jurisdiction has not passed a formal resolution, or used\n' +
                'some other documentation of adoption, the clerk or city attorney\n' +
                'must provide written confirmation that the action meets their\n' +
                'community’s legal requirements for official adoption and/or the\n' +
                'highest elected official or their designee must submit written\n' +
                'proof of the adoption. The signature of one of these officials is\n' +
                'required with the explanation or other proof of adoption.\n' +
                'Minutes of a council or other meeting during which the plan is\n' +
                'adopted will be sufficient if local law allows meeting records to be\n' +
                'submitted as documentation of adoption. The clerk of the\n' +
                'governing body, or city attorney, must provide a copy of the law\n' +
                'and a brief, written explanation such as, “in accordance with\n' +
                'section ___ of the city code/ordinance, this constitutes formal\n' +
                'adoption of the measure,” with an official signature.\n' +
                'If adopted after FEMA review, adoption must take place within\n' +
                'one calendar year of receipt of FEMA’s “Approval Pending\n' +
                'Adoption.”',
            municipal: '',
            county: ''
        },
        {
            element: 'E2',
            requirements_from_software: `Req-E-2`,
            objective: 'For multi‐jurisdictional plans, has each jurisdiction requesting approval of the plan documented ' +
                'formal plan adoption? 44 CFR 201.6(c)(5)',
            intent: 'To demonstrate the jurisdiction’s commitment to fulfilling the hazard mitigation goals outlined in the plan, ' +
                'and to authorize responsible agencies to execute their responsibilities.',
            element_requirements: 'a. Each jurisdiction that is included in the plan must have its\n' +
                'governing body adopt the plan prior to FEMA approval, even\n' +
                'when a regional agency has the authority to prepare such plans.\n' +
                'As with single jurisdictional plans, in order for FEMA to give\n' +
                'approval to a multi‐jurisdictional plan, at least one participating\n' +
                'jurisdiction must formally adopt the plan within one calendar year\n' +
                'of FEMA’s designation of the plan as “Approvable Pending\n' +
                'Adoption.” See Section 5, Plan Review Procedure for more\n' +
                'information on “Approvable Pending Adoption.”',
            municipal: '',
            county: ''
        },
        {
            element: 'F1',
            requirements_from_software: `Req-A-2, Req-A-2A, Req-A-3A`,
            objective: 'Does the plan document how stakeholders were invited to participate at each phase of the planning ' +
                'process and provide a summary of feedback?',
            intent: 'Plans developed with the participation of the widest range of organizations and stakeholders personally ' +
                'familiar with past damages to local infrastructure are likely to contain valuable, relevant information that ' +
                'will lead to a comprehensive plan and feasible projects.',
            element_requirements: '',
            municipal: '',
            county: ''
        },
        {
            element: 'F2',
            requirements_from_software: `Req-B-3B-2, Req-NYS-F-2, Req-NYS-F-3`,
            objective: 'Do jurisdictions identify critical facilities, assess vulnerabilities and ensure protection to ' +
                'a 500-year flood event or worst case scenario?',
            intent: 'Critical facilities must remain accessible and functional before, during and after disasters to meet ' +
                'the jurisdiction’s Continuity of Government (COG) and Continuity of Operations (COOP) standards, ' +
                'and to support emergency, government and sheltering functions.',
            element_requirements: '',
            municipal: '',
            county: ''
        },
        {
            element: 'F3',
            requirements_from_software: `Req-NYS-F-4B, Req-NYS-F-3A, Req-NYS-F-3B-1`,
            objective: 'Do jurisdictions containing an SFHA identify:\n' +
                'a. potential sites for the placement of temporary housing units for residents displaced by disaster; and\n' +
                'b. potential sites within the jurisdiction suitable for relocating houses out of the floodplain, ' +
                'or building new houses once properties in the floodplain are razed?',
            intent: 'Intermediate and long-term housing options must be available for relocating displaced residents ' +
                'and maintain post-disaster social and economic stability.',
            element_requirements: '',
            municipal: '',
            county: ''
        },
        {
            element: 'F4',
            requirements_from_software: `Req-NYS-F-4B, Req-NYS-F-4A, Req-NYS-F-4A-1, Req-NYS-F-4B-2`,
            objective: 'Do jurisdictions identify:\n' +
                'a. routes and procedures to evacuate citizens prior to and during an event; and\n' +
                'b. shelters for evacuated citizens, to include provisions for a range of medical needs, accommodation ' +
                'for pets, and compliance with the Americans with Disabilities Act (www.ada.gov)?',
            intent: 'Evacuation and sheltering measures must be in place and available for public awareness to protect ' +
                'residents and mitigate risk, stress and personal hardships during hazard events',
            element_requirements: '',
            municipal: '',
            county: ''
        },
        {
            element: 'F5',
            requirements_from_software: `Req-D-1F, Req-D-1G`,
            objective: 'Do jurisdictions identify mitigation projects completed since the approval of the previous ' +
                'mitigation plan (or within the last five years)?',
            intent: 'Past mitigation actions provide a context for the jurisdiction’s projects, and can help to evaluate ' +
                'accuracy of assumptions to support future mitigation planning.',
            element_requirements: '',
            municipal: '',
            county: ''
        },
        {
            element: 'F6',
            requirements_from_software: `Req-A-1G`,
            objective: 'Does the plan include an annex for every jurisdiction within the County’s boundaries?',
            intent: 'Jurisdictional annexes provide a unique, stand-alone guide to mitigation planning for each jurisdiction.',
            element_requirements: '',
            municipal: '',
            county: ''
        },
        {
            element: 'F7',
            requirements_from_software: `Req-NYS-F-7A, Req-NYS-F-7B, Req-C-4`,
            objective: 'Within each jurisdictional annex, are:\n' +
                'a. projects developed in accordance with the NYS DHSES Proposed Projects Table; and\n' +
                'b. two (2) NYS DHSES Action Worksheets provided?',
            intent: 'Projects that are well developed and documented in one place are more quickly identifiable for ' +
                'selection when grants become available, making implementation that much more likely.',
            element_requirements: '',
            municipal: '',
            county: ''
        },
        {
            element: 'F8',
            requirements_from_software: `Req-NYS-F-8`,
            objective: 'Does the plan include a list of potential funding sources?',
            intent: 'Identifying strategic funding sources is integral to successful coordination and implementation of mitigation actions',
            element_requirements: '',
            municipal: '',
            county: ''
        },
        {
            element: 'F9',
            requirements_from_software: `req-B1-, req-B1--local-impact`,
            objective: 'Does the plan assess how climate change may affect vulnerability to hazards, propose actions to ' +
                'address this, and discuss sea level rise (if applicable)?',
            intent: 'Acknowledging and planning for climate change protects residents, avoids or reduces damage to property ' +
                'and public infrastructure, and reduces personal hardship.',
            element_requirements: '',
            municipal: '',
            county: ''
        },
        {
            element: 'F10',
            requirements_from_software: `Req-A-2`,
            objective: 'Was the draft plan posted for public comment?',
            intent: '',
            element_requirements: '',
            municipal: '',
            county: ''
        },
        {
            element: 'General',
            requirements_from_software: ``,
            objective: 'Figures. Maps should be better described and have zoomed in quadrant or sectional views like ' +
                'Figure 4-20 or graphic call-out boxes like Figure 4-21',
            intent: 'Hazard zones should be included in all critical infrastructure maps',
            element_requirements: '',
            municipal: '',
            county: ''
        },
    ],

};

export default config;