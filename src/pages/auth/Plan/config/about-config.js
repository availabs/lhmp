const config =  {
	'Planning Image': [{
		title: 'Planning Image',
		requirement: `planning-image`,
		type: 'image',
		prompt: '',
		intent: '',
		callout: '',
		label:'Image', // Which you would like to see on the form
		height: 250,
		width: 500,
		border: 1,
		icon: 'os-icon-arrow-right7',
		onlyAdmin: true,
		pullCounty: true,
	}],
	'Header' : [{
		title: 'Planning Process Quote',
		requirement: 'planning-process-quote',
		type: 'content',
		prompt: '',
		intent: '',
		callout: '',
		icon: 'os-icon-arrow-right7',
		pullCounty: true,
		onlyAdmin: true // visible only in admin CMS by default. used if you want to load this key at a particular location on page.
	}],
	'Planning Context' : [
		{
			title: 'Local Orientation',
			requirement: 'Req-A-1A',
			type: 'content',
			prompt: 'Document the planning process, including how it was prepared and who was involved in the process for each jurisdiction.',
			intent: 'To inform the public and other readers about the overall approach to the plan’s development and serve as a permanent record of how decisions were made and who was involved. This record is also useful for the next plan update.',
			callout: 'To inform the public and other readers about the overall approach to the plan’s development and serve as a permanent record of how decisions were made.',
			icon: 'os-icon-globe',
			pullCounty: true,
			// hideNav: true // hides key from public nav. Displays on page.
			///*2-non-county*/ pullCounty: true,
			///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
			///*2-non-delete*/ hideIfNull: true
	}],
	'Pre-Planning' : [
		{
			title: 'Planning Teams',
			requirement: `Req-A-1B`,
			type: 'content',
			prompt: 'Document the planning process, including how it was prepared and who was involved in the process for each jurisdiction.',
			intent: 'To inform the public and other readers about the overall approach to the plan’s development and serve as a permanent record of how decisions were made and who was involved. This record is also useful for the next plan update.',
			callout: 'To inform the public and other readers about the overall approach to the plan’s development and serve as a permanent record of how decisions were made.',
			icon: 'os-icon-arrow-right7',
			pullCounty: true,
			// hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>` // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
		},
		{
			title:`planning-image`,
			requirement:'Req-A-1F',
			type: 'image',
			prompt: '',
			intent: '',
			callout: '',
			label:'Image', // Which you would like to see on the form
			height: 250,
			width: 500,
			border: 1,
			icon: 'os-icon-arrow-right7',
			onlyAdmin: true,
			hideNav: true,
		},

		{
			title: 'Outreach Strategy',
			requirement: 'Req-A-2',
			type: 'content',
			prompt: 'Document outreach methods used to engage county representatives, jurisdictions, state and federal partners, the public, neighboring communities, and additional stakeholders.',
			intent: 'To demonstrate a deliberative planning process that involves stakeholders with the data and expertise needed to develop the plan, with responsibility or authority to implement hazard mitigation activities, and who will be most affected by the plan’s outcomes.' +
					'To ensure citizens understand what the community is doing on their behalf, and to provide a chance for input on community vulnerabilities and mitigation activities that will inform the plan’s content.' +
					'Public involvement is also an opportunity to educate the public about hazards and risks in the community, types of activities to mitigate those risks, and how these impact them.',
			icon: 'os-icon-rotate-cw',
			// hideNav: true // hides key from public nav. Displays on page.
			/*2-non-county*/ pullCounty: true,
			///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
			///*2-non-delete*/ hideIfNull: true
		},

		{
			title: 'Participants',
			requirement: 'Req-A-2A',
			type: 'content',
			prompt: 'Provide an overview of participation of county representatives, jurisdictions, state and federal partners, the public, neighboring communities, regional stakeholders and additional stakeholders throughout the planning process. This summary will be supported by the tables that follow, which will display all participants and all meetings.',
			intent: 'To demonstrate a deliberative planning process that involves stakeholders with the data and expertise needed to develop the plan, with responsibility or authority to implement hazard mitigation activities, and who will be most affected by the plan’s outcomes.' +
					'To ensure citizens understand what the community is doing on their behalf, and to provide a chance for input on community vulnerabilities and mitigation activities that will inform the plan’s content.'+
					'Public involvement is also an opportunity to educate the public about hazards and risks in the community, types of activities to mitigate those risks, and how these impact them.',
			callout: 'Document opportunities for neighboring communities, local and regional agencies involved in hazard',
			icon: 'os-icon-user-plus',
			// hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
		},
		{
			title: 'Jurisdictional Participation',
			requirement: 'Req-A-1G',
			type: 'content',
			prompt: 'Plan updates must include documentation of the current planning process undertaken to update the plan.',
			intent: '',
			icon: 'os-icon-users',
			// hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
		},

		{
			title: '',
			requirement: 'Req-A-1C',
			hideNav: true,
			type: 'formTable',
			fontSize: '0.70em',
			height: '600px',
			align: 'full',
			config: {
				type:'roles',
        		columns : [
        			{
        				Header: 'Name',
        				accessor: 'contact_name',
						sort: true,
						filter: 'default'
        			},
        			// {
        			// 	Header: 'County',
        			// 	accessor: 'contact_county'
        			// },
        			// {
        			// 	Header: 'County',
        			// 	accessor: 'contact_municipality'
        			// },
        			{
        				Header: 'Agency',
        				accessor: 'contact_agency',
						sort: true,
						filter: 'default'
        			},
        			{
        				Header: 'Role',
        				accessor: 'contact_title_role',
						sort: true,
						filter: 'multi'
        			}
        		]
        
			},
			//align: 'full',
			prompt: 'Identify who represented each jurisdiction.',
			intent: 'Document the planning process, including how it was prepared and who was involved in the process for each jurisdiction?',
			icon: 'os-icon-user'
		},

		// {
		// 	title: 'Jurisdictional Participation',
		// 	requirement: 'Req-A-1E',
		// 	type: 'table',
		// 	prompt: '',
		// 	intent: 'Plan updates must include documentation of the current planning process undertaken to update the plan.'
		// },


	],
	'Local Resources' : [
		{
			title: 'Technical Data',
			requirement: 'Req-A-4A',
			type: 'content',
			prompt: 'Provide an overview of the technical data sources solicited and used for the plan (e.g. LFAs, ACS, etc). These sources should be referenced more formally in corresponding tables and in a bibliography.',
			intent: 'To demonstrate use of best available data for hazard analysis and risk assessment.',
			icon: 'os-icon-rotate-cw',
			// hideNav: true // hides key from public nav. Displays on page.
			/*2-non-county*/ pullCounty: true,
			///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
			///*2-non-delete*/ hideIfNull: true
		},

		{
			title: 'Existing Resources',
			requirement: 'Req-A-4B',
			type: 'content',
			prompt: 'Summarize how existing resources (plans, studies, reports, data) were collected, reviewed and integrated into this Hazard Mitigation Plan throughout the Planning Process.' +
			 		'How does reviewing and integrating existing resources help set a foundation for your communitys risk assessment and strategy development later in the planning process?',
			intent: 'To identify existing data and information, shared objectives, and past and ongoing activities that' +
				' can help inform the mitigation plan.  It also helps identify the existing capabilities and planning' +
				' mechanisms to implement the mitigation strategy.',
			icon: 'os-icon-rotate-cw',
			// hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
		},
		{
			title: '',
			requirement: 'Req-A-4C',
			//type: 'planningDocuments',

			//align: 'full',
			type: 'formTable',
			hideNav: true,
			fontSize: '0.70em',
			height: '600px',
			align: 'full',
			config: {
				type: 'capabilities',
				filters:[{column:'capability_category',value:'planning and regulatory'}],
        		columns : [
        			{
        				Header: 'Name',
        				accessor: 'capability_name',
						sort: true,
						filter: 'default'
        			},
        			{
        				Header: 'capability type',
        				accessor: 'capability_type',
						sort: true,
						filter: 'multi'
        			},
        			
        			{
        				Header: 'adopting authority',
        				accessor: 'adopting_authority',
						sort: true,
						filter: 'default'
        			},
        			{
        				Header: 'responsible authority',
        				accessor: 'responsible_authority',
						sort: true,
						filter: 'default'
        			},
        			{
        				Header: 'Link',
        				accessor: 'upload',
        				width: 50,
						sort: true,
						filter: 'default',
						link: true
        			},
        			
        		]
        
			},
			prompt: '',
			intent: '',
			icon: 'os-icon-tasks-checked'
		},
	],
	'Engagement' : [
		{
			title: 'Jurisdictional Engagement',
			requirement: 'Req-A-1E',
			type: 'content',
			prompt: 'Plan updates must include documentation of the current planning process undertaken to update the plan.',
			intent: '',
			icon: 'os-icon-users',
			// hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
		},
		{
			title: 'Public Participation',
			requirement: 'Req-A-3A',
			type: 'content',
			prompt: 'Document how the public was involved in the planning process during the drafting stage.',
			intent: 'To ensure citizens understand what the community is doing on their behalf, and to provide a chance' +
				' for input on community vulnerabilities and mitigation activities that will inform the plan’s content.' +
				' Public involvement is also an opportunity to educate the public about hazards and risks in the community,' +
				' types of activities to mitigate those risks, and how these impact them.',
				icon: 'os-icon-users',
				// hideNav: true // hides key from public nav. Displays on page.
			/*2-non-county*/ pullCounty: true,
			///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
			///*2-non-delete*/ hideIfNull: true
		},
		{
			title: 'Meetings',
			requirement: 'Req-A-1D',
			type: 'formTable',
			fontSize: '0.70em',
			height: 'auto',
			align: 'full',
			config: {
				type:'participation',
        		columns : [
        			{
        				Header: 'Date',
        				accessor: 'start_date',
        				width: 60,
						sort: true
        			},
        			{
        				Header: 'Name',
        				accessor: 'title',
        			},
        			{
        				Header: 'Hours',
        				accessor: 'hours',
        				width: 40
        			},
        			{
        				Header: 'Narrative',
        				accessor: 'narrative',
        				width: 400,
						filter: 'default'
        			}
        		]
        
			},
			prompt: '',
			intent: 'For each jurisdiction seeking plan approval, the plan must document how they were involved in the planning process.',
			icon: 'os-icon-user-check'
		},
		{
			title: 'Plan Review and Submittal',
			requirement: 'Req-NYS-F-10',
			type: 'content',
			prompt: 'Describe the process by which you offered all planning participants and the public an opportunity to review. Describe how you distributed the plan draft for review and feedback. Summarize the themes of any feedback that was received and describe how the feedback was incorporated into the plan. Provide an overview of the State/Federal submittal process.',
			intent: 'To document 1) the solicitation and incorporation of feedback from the planning team, stakeholders, and the public in the final plan document prior to submittal to the state and FEMA for review and approval and' +
			 		'2) notification from FEMA in the form of a "Requires Revisions", "Approvable Pending Adoption (APA)" or "Approval" letter to the State.',
				icon: 'os-icon-users',
				// hideNav: true // hides key from public nav. Displays on page.
			/*2-non-county*/ pullCounty: true,
			///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
			///*2-non-delete*/ hideIfNull: true
		},
		{
			title: 'Adoption',
			requirement: 'Req-E-1',
			type: 'formTable',
			align: 'full',
			fontSize: '.7em',
			config: {
				type:'capabilities', // type is same as the route path for now
				filters:[{column:'capability_type',value:'Hazard mitigation plan'}],
				columns : [
        			// {
        			// 	Header: 'Name',
        			// 	accessor: 'capability_name'
        			// },
        			// {
        			// 	Header: 'capability type',
        			// 	accessor: 'capability_type'
        			// },

        			{
        				Header: 'Municipality',
        				accessor: 'municipality',
        				sort: true,
        				filter: 'default'
        			},
        			
        			{
        				Header: 'adopting authority',
        				accessor: 'adopting_authority',
        				sort: true,
        				filter: 'default'
        			},
        			{
        				Header: 'responsible authority',
        				accessor: 'responsible_authority',
        				sort: true,
        				filter: 'default'
        			},
        			{
        				Header: 'Adoption Date',
        				accessor: 'adoption_date',
        				width: 90
        			},
        			// {
        			// 	Header: 'expiration Date',
        			// 	accessor: 'expiration_date',
        			// 	width: 70
        			// },
        			// {
        			// 	Header: 'Link',
        			// 	accessor: 'link_url',
        			// 	width: 50
        			// }
        			
        		]      		 
			},
			prompt: `The plan must include documentation of plan adoption, usually a resolution by the governing body or other authority.
			a.   Upload Prompts: 
				i.	Meeting minutes
				ii.	Formal resolution by governing body or other authority 
				iii.	Written proof of the adoption by clerk, attorney or highest elected official 
			`,
			intent: 'To demonstrate the jurisdiction’s commitment to fulfilling the hazard mitigation goals outlined in' +
				' the plan, and to authorize responsible agencies to execute their responsibilities. ',
			icon: 'os-icon-check-circle'
		},
	],	
	'Plan Maintenance' : [
		{
			title: 'Monitoring and Evaluating the Plan',
			requirement: 'Req-A-6',
			type: 'content',
			prompt: `Describe the method and schedule for keeping the plan current 
			a. Monitoring/Evaluating/Updating: (Must include title of individual or name of dept or agency responsible for leading each of these efforts)
				i.	Monitoring: How, when and by whom the plan will be monitored - tracking implementation of plan over time,
				ii.	Evaluating: How when and by whom the plan will be evaluated - assessing the effectiveness of the plan at achieving its stated purpose and goals
				iii.	Updating: How, when and by whom will update the mitigation plan within a 5-year cycle`,
			intent: 'To establish a process for jurisdictions to track the progress of the plan’s implementation.' +
				' This also serves as the basis of the next plan update.',
			icon: 'os-icon-battery-charging',
			// hideNav: true // hides key from public nav. Displays on page.
			/*2-non-county*/ pullCounty: true,
			///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
			///*2-non-delete*/ hideIfNull: true
		},
		{
			title: 'Continued Public Engagement',
			requirement: 'Req-A-5',
			type: 'content',
			prompt: `Describe how the community(ies) will continue to engage the public throughout the plan maintenance process described above. The plan must describe how the jurisdiction(s) will continue to seek public participation after the plan has been approved and during the plan’s maintenance.`,
			intent: 'To identify how the public will continue to have an opportunity to participate in the plan’s maintenance and implementation over time.' +
					'To establish a process for jurisdictions to track the progress of the plan’s implementation. This also serves as the basis of the next plan update',
			icon: 'os-icon-battery-charging',
			// hideNav: true // hides key from public nav. Displays on page.
			/*2-non-county*/ pullCounty: true,
			///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
			///*2-non-delete*/ hideIfNull: true
		},
		{
			title: 'Updating The Plan',
			requirement: 'Req-A-6A',
			type: 'content',
			prompt: `Describe the method and schedule for keeping the plan current 
			a. Monitoring/Evaluating/Updating: (Must include title of individual or name of dept or agency responsible for leading each of these efforts)
				i.	Monitoring: How, when and by whom the plan will be monitored - tracking implementation of plan over time,
				ii.	Evaluating: How when and by whom the plan will be evaluated - assessing the effectiveness of the plan at achieving its stated purpose and goals
				iii.	Updating: How, when and by whom will update the mitigation plan within a 5-year cycle`,
			intent: 'To establish a process for jurisdictions to track the progress of the plan’s implementation.' +
				' This also serves as the basis of the next plan update.',
			icon: 'os-icon-battery-charging',
			// hideNav: true // hides key from public nav. Displays on page.
			/*2-non-county*/ pullCounty: true,
			///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
			///*2-non-delete*/ hideIfNull: true
		},	
	],
	'Process Assessment' : [
		{
			title: 'Strengths',
			requirement: 'Req-R-1A',
			type: 'content',
			prompt: 'Describe planning process strengths: document successes the planning teams experienced in collecting information, soliciting and receiving input, gathering community resources, hazard risk and vulnerabilities assessment, mitigation strategies development, etc.', 
			intent: 'The process is as important as the plan itself. Bringing together local officials, stakeholders and the public in a community‐driven planning process to develop the plan also helps build the community’s overall hazard mitigation program.' +
					'Feedback and information on specific sections in the Plan where the community has gone above and beyond minimum requirements and suggested improvements to the planning process (via local, state or federal feedback/guidance) can record lessons learned and best practices for concurrent or future planning endeavors and plan implementation.',
			icon: 'os-icon-battery-charging',
			// hideNav: true // hides key from public nav. Displays on page.
			///*2-non-county*/ pullCounty: true,
			///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
			/*2-non-delete*/ hideIfNull: true
		},
		{
			title: 'Opportunities',
			requirement: 'Req-R-1B',
			type: 'content',
			prompt: 'Identify ways your community can improve upon the process during the 5-year life cycle of the plan and in preparation for the next update. Consider inclusion of significant Opportunities for Improvement identified by DHSES and FEMA reviewers.',
			intent: 'The process is as important as the plan itself. Bringing together local officials, stakeholders and the public in a community‐driven planning process to develop the plan also helps build the community’s overall hazard mitigation program.' +
					'Feedback and information on specific sections in the Plan where the community has gone above and beyond minimum requirements and suggested improvements to the planning process (via local, state or federal feedback/guidance) can record lessons learned and best practices for concurrent or future planning endeavors and plan implementation.',
			icon: 'os-icon-command',
			// hideNav: true // hides key from public nav. Displays on page.
			///*2-non-county*/ pullCounty: true,
			///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
			/*2-non-delete*/ hideIfNull: true
		},
	]
}

export default config