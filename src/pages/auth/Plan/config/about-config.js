const config =  {
	Process : [
		{
			requirement: 'Req-A-1A',
			type: 'content',
			prompt: 'Document the planning process, including how it was prepared and who was involved in the process for each jurisdiction.',
			intent: 'To inform the public and other readers about the overall approach to the plan’s development and serve as a permanent record of how decisions were made and who was involved. This record is also useful for the next plan update.'
		},
		{
			requirement: 'Req-A-1B',
			type: 'date',
			prompt: '',
			intent: ''
		},
		{
			requirement: 'Req-A-1C',
			type: 'rolesTable',
			prompt: 'Identify who represented each jurisdiction.',
			intent: 'Document the planning process, including how it was prepared and who was involved in the process for each jurisdiction?'
		},
		{
			requirement: 'Req-A-1D',
			type: 'table',
			prompt: '',
			intent: 'For each jurisdiction seeking plan approval, the plan must document how they were involved in the planning process.'
		},
		{
			requirement: 'Req-A-1E',
			type: 'table',
			prompt: '',
			intent: 'Plan updates must include documentation of the current planning process undertaken to update the plan.'
		},
		{
			requirement: 'Req-A-2',
			type: 'content',
			prompt: 'Document opportunities for neighboring communities, local and regional agencies involved in hazard' +
				' mitigation activities, agencies that have the authority to regulate development as well as other interests' +
				' to be involved in the planning process.',
			intent: 'To demonstrate a deliberative planning process that involves stakeholders with the data and expertise' +
				' needed to develop the plan, with responsibility or authority to implement hazard mitigation activities,' +
				' and who will be most affected by the plan’s outcomes.'
		},
		{
			requirement: 'Req-A-3',
			type: 'content',
			prompt: 'Document how the public was involved in the planning process during the drafting stage.',
			intent: 'To ensure citizens understand what the community is doing on their behalf, and to provide a chance' +
				' for input on community vulnerabilities and mitigation activities that will inform the plan’s content.' +
				' Public involvement is also an opportunity to educate the public about hazards and risks in the community,' +
				' types of activities to mitigate those risks, and how these impact them.'
		},
	],
	'Resource Review and Integration' : [
		{
			requirement: 'Req-A-4A',
			type: 'table',
			prompt: 'What existing plans, studies, reports, and technical information were reviewed?',
			intent: 'To identify existing data and information, shared objectives, and past and ongoing activities that' +
				' can help inform the mitigation plan.  It also helps identify the existing capabilities and planning' +
				' mechanisms to implement the mitigation strategy.'
		},
		{
			requirement: 'Req-A-4B',
			type: 'content',
			prompt: 'Describe the review and incorporation of existing plans, studies, reports, and technical information.',
			intent: 'To identify existing data and information, shared objectives, and past and ongoing activities that' +
				' can help inform the mitigation plan. It also helps identify the existing capabilities and planning' +
				' mechanisms to implement the mitigation strategy.'
		},
		{
			requirement: 'Req-C-6',
			type: 'content',
			prompt: 'Describe the community’s process to integrate the data, information, and hazard mitigation goals' +
				' and actions into other planning mechanisms.',
			intent: 'To assist communities in capitalizing on all available mechanisms that they have at their disposal' +
				' to accomplish hazard mitigation and reduce risk.'
		},
	],
	'Plan Evaluation, Implementation, Maintenance' : [
		{
			requirement: 'Req-A-5A',
			type: 'content',
			prompt: 'Describe how the community(ies) will continue public participation in the plan maintenance process.',
			intent: 'To identify how the public will continue to have an opportunity to participate in the plan’s' +
				' maintenance and implementation over time.'
		},
		{
			requirement: 'Req-A-5A2',
			type: 'table',
			prompt: '',
			intent: 'The plan must describe how the jurisdiction(s) will continue to seek public participation after the' +
				' plan has been approved and during the plan’s implementation, monitoring and evaluation. Participation' +
				' means engaged and given the chance to provide feedback. Examples include, but are not limited to,' +
				' periodic presentations on the plan’s progress to elected officials, schools or other community groups,' +
				' annual questionnaires or surveys, public meetings, postings on social media and interactive websites.'
		},
		{
			requirement: 'Req-A-6',
			type: 'content',
			prompt: `Describe the method and schedule for keeping the plan current 
			a. Monitoring/Evaluating/Updating: (Must include title of individual or name of dept or agency responsible for leading each of these efforts)
				i.	Monitoring: How, when and by whom the plan will be monitored - tracking implementation of plan over time,
				ii.	Evaluating: How when and by whom the plan will be evaluated - assessing the effectiveness of the plan at achieving its stated purpose and goals
				iii.	Updating: How, when and by whom will update the mitigation plan within a 5-year cycle
`,
			intent: 'To establish a process for jurisdictions to track the progress of the plan’s implementation.' +
				' This also serves as the basis of the next plan update.'
		},
	],
	Adoption: [
		{
			requirement: 'Req-E-1',
			type: 'upload',
			prompt: `The plan must include documentation of plan adoption, usually a resolution by the governing body or other authority.
			a.   Upload Prompts: 
				i.	Meeting minutes
				ii.	Formal resolution by governing body or other authority 
				iii.	Written proof of the adoption by clerk, attorney or highest elected official 
			`,
			intent: 'To demonstrate the jurisdiction’s commitment to fulfilling the hazard mitigation goals outlined in' +
				' the plan, and to authorize responsible agencies to execute their responsibilities.  '
		},
		{
			requirement: 'Req-E-2',
			type: 'table',
			prompt: 'Identify adopting authority and date of formal adoption.',
			intent: 'Each jurisdiction that is included in the plan must have its governing body adopt the plan prior to' +
				' FEMA approval, even when a regional agency has the authority to prepare such plans.'
		},
	]
}

export default config