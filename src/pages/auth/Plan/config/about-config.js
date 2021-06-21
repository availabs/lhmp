const config =  {
	'Planning Image': [{
		title: 'Planning Image',
		requirement: `planning-image`,
		type: 'image',
		prompt: '',
		intent: '',
		// callout: '',
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
		hideJurisdictionAnnex: true, // to hide jurisdiction annex
		// callout: '',
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
			// callout: 'To inform the public and other readers about the overall approach to the plan’s development and serve as a permanent record of how decisions were made.',
			icon: 'os-icon-globe',
			pullCounty: true,
			hideCounty: false, // when true, hides county content on selecting jurisdiction
			// hideNav: true // hides key from public nav. Displays on page.
			///*2-non-county*/ pullCounty: true,
			///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
			///*2-non-delete*/ hideIfNull: true,
			// showOnlyOnCounty: true
	}],
	'Pre-Planning' : [
		{
			title: 'Planning Teams',
			requirement: `Req-A-1B`,
			type: 'content',
			prompt: 'Document the planning process, including how it was prepared and who was involved in the process for each jurisdiction.',
			intent: 'To inform the public and other readers about the overall approach to the plan’s development and serve as a permanent record of how decisions were made and who was involved. This record is also useful for the next plan update.',
			// callout: 'To inform the public and other readers about the overall approach to the plan’s development and serve as a permanent record of how decisions were made.',
			icon: 'os-icon-arrow-right7',
			pullCounty: true,
			// hideNav: true // hides key from public nav. Displays on page.
            ///*2-non-county*/ pullCounty: true,
            /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>` // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true
		},
		// {
		// 	title:`planning-teams-image`,
		// 	requirement:'Req-A-1F',
		// 	type: 'image',
		// 	prompt: '',
		// 	intent: '',
		// 	callout: '',
		// 	label:'Image', // Which you would like to see on the form
		// 	height: 150,
		// 	width: 350,
		// 	border: 1,
		// 	icon: 'os-icon-arrow-right7',
		// 	// onlyAdmin: true,
		// 	// hideNav: true,
		// },

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
			title: 'Federal/State/County Representation',
			requirement: 'Req-A-2A',
			type: 'content',
			prompt: 'Provide an overview of participation of county representatives, jurisdictions, state and federal partners, the public, neighboring communities, regional stakeholders and additional stakeholders throughout the planning process. This summary will be supported by the tables that follow, which will display all participants and all meetings.',
			intent: 'To demonstrate a deliberative planning process that involves stakeholders with the data and expertise needed to develop the plan, with responsibility or authority to implement hazard mitigation activities, and who will be most affected by the plan’s outcomes.' +
					'To ensure citizens understand what the community is doing on their behalf, and to provide a chance for input on community vulnerabilities and mitigation activities that will inform the plan’s content.'+
					'Public involvement is also an opportunity to educate the public about hazards and risks in the community, types of activities to mitigate those risks, and how these impact them.',
			// callout: 'Document opportunities for neighboring communities, local and regional agencies involved in hazard',
			icon: 'os-icon-user-plus',
			// hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
		},
		{
			title: 'Regional Representation',
			requirement: 'Req-A-2B',
			type: 'content',
			prompt: 'Provide an overview of participation of county representatives, jurisdictions, state and federal partners, the public, neighboring communities, regional stakeholders and additional stakeholders throughout the planning process. This summary will be supported by the tables that follow, which will display all participants and all meetings.',
			intent: 'To demonstrate a deliberative planning process that involves stakeholders with the data and expertise needed to develop the plan, with responsibility or authority to implement hazard mitigation activities, and who will be most affected by the plan’s outcomes.' +
					'To ensure citizens understand what the community is doing on their behalf, and to provide a chance for input on community vulnerabilities and mitigation activities that will inform the plan’s content.'+
					'Public involvement is also an opportunity to educate the public about hazards and risks in the community, types of activities to mitigate those risks, and how these impact them.',
			callout: 'Document opportunities for neighboring communities, local and regional agencies involved in hazard',
			icon: 'os-icon-user-plus',
			// hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
		},
		{
			title: 'Jurisdictional Representation',
			requirement: 'Req-A-1G',
			type: 'content',
			prompt: 'Plan updates must include documentation of the current planning process undertaken to update the plan.',
			intent: '',
			icon: 'os-icon-users',
			// hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true 
		},

		{
			title: 'Mitigation Representatives',
			requirement: 'Req-A-1E',
			hideNav: true,
			type: 'formTable',
			fontSize: '0.70em',
			height: '600px',
			align: 'full',
			config: {
				type:'roles',
				description: 'The table below lists the participants from each jurisdiction that identified as the "Mitigation Representative" for their jurisdiction as part of the planning process and development of this Hazard Mitigation Plan.',
				filters:[{column:'is_hazard_mitigation_representative',value:'yes'}],
        		columns : [
					{
						Header: 'Jurisdiction',
						accessor: 'contact_municipality',
						sort: true,
						filter: 'default'
					},
        			{
        				Header: 'Name',
        				accessor: 'contact_name',
						sort: true,
						filter: 'default'
        			},
        			{
        				Header: 'Agency',
        				accessor: 'contact_agency',
						sort: true,
						filter: 'default'
        			},
					{
						Header: 'Department',
						accessor: 'contact_department',
						sort: true,
						filter: 'default'
					},
        			{
        				Header: 'Role',
        				accessor: 'contact_title_role',
						sort: true,
						filter: 'multi'
        			},
        			{
        				Header: 'Participation',
        				accessor: 'contact_planning_team',
						sort: true,
						filter: 'multi'
        			},
        			{
                        Header: 'viewLink',
                        accessor: 'viewLink',
                        width: 50,
                        expandable: 'true',
                    },
        		]
        
			},
			//align: 'full',
			prompt: 'Identify who represented each jurisdiction.',
			intent: 'Document the planning process, including how it was prepared and who was involved in the process for each jurisdiction?',
			activeGeoFilter: 'true',
			defaultSortCol: 'contact_agency',
			// defaultSortOrder: 'desc',
			colOrder: ['Jurisdiction', 'Name', 'Agency', 'Department', 'Role', 'Participation'],
			minHeight: '80vh',
			icon: 'os-icon-user'
		},

		// {
		// 	title: '',
		// 	requirement: 'Req-A-1C',
		// 	hideNav: true,
		// 	type: 'formTable',
		// 	fontSize: '0.70em',
		// 	height: '600px',
		// 	align: 'full',
		// 	config: {
		// 		type:'roles',
  //       		columns : [
  //       			{
  //       				Header: 'Name',
  //       				accessor: 'contact_name',
		// 				sort: true,
		// 				filter: 'default'
  //       			},
  //       			// {
  //       			// 	Header: 'County',
  //       			// 	accessor: 'contact_county'
  //       			// },
  //       			// {
  //       			// 	Header: 'County',
  //       			// 	accessor: 'contact_municipality'
  //       			// },
  //       			{
  //       				Header: 'Agency',
  //       				accessor: 'contact_agency',
		// 				sort: true,
		// 				filter: 'default'
  //       			},
  //       			{
  //       				Header: 'Role',
  //       				accessor: 'contact_title_role',
		// 				sort: true,
		// 				filter: 'multi'
  //       			}
  //       		]

		// 	},
		// 	//align: 'full',
		// 	prompt: 'Identify who represented each jurisdiction.',
		// 	intent: 'Document the planning process, including how it was prepared and who was involved in the process for each jurisdiction?',
		// 	activeGeoFilter: 'true',
		// 	defaultSortCol: 'contact_agency',
		// 	// defaultSortOrder: 'desc',
		// 	colOrder: ['Agency', 'Name', 'Role'],
		// 	minHeight: '80vh',
		// 	icon: 'os-icon-user'
		// },

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
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true
		},
		
		
		{
			title: '',
			requirement: 'Req-A-4C',
			//type: 'planningDocuments',

			//align: 'full',
			type: 'formTable',
			hideNav: true,
            height: '600px',
            align: 'full',
            config: {
                type: 'capabilities',
                description: 'Existing Resources Capabilities (plans, studies, reports, data) were collected, reviewed and integrated into this Hazard Mitigation Plan throughout the planning process. Existing resources capabilities are categorized as: Planning and Regulatory and Administrative and Technical, Education and Outreach, and Financial assets. The information displayed in the table below includes the selected jurisdiction’s capabilities. When the county is selected, the table includes capabilities for all jurisdictions in the plan, otherwise the table filters to the selected jurisdiction.', 
				filters:[{column:'capability_category',value:'planning and regulatory'}],
                columns : [
                    {
                        Header: 'Jurisdiction',
                        accessor: 'municipality',
                        width: 80,
                        sort: true,
                        filter: 'default'
                    },
                    {
                        Header: 'Name',
                        accessor: 'capability_name',
                        sort: true,
                        width: 120,
                        filter: 'default'
                    },
                    {
                        Header: 'category',
                        accessor: 'capability_category',
                        sort: true,
                        width: 100,
                        filter: 'multi'
                    },
                    {
                        Header: 'type',
                        accessor: 'capability_type',
                        sort: true,
                        width: 120,
                        filter: 'multi'
                    },

                    /*  {
                          Header: 'adopting authority',
                          accessor: 'adopting_authority',
                          sort: true,
                          filter: 'default'
                      },*/
                    {
                        Header: 'responsible authority',
                        accessor: 'responsible_authority',
                        sort: true,
                        width: 200,
                        filter: 'default'
                    },
                    {
                        Header: 'Link',
                        accessor: 'upload',
                        width: 50,
                        expandable: 'true',
                        expandableHeader: true
                    },
                    {
                        Header: 'jurisdiction_utilization',
                        accessor: 'jurisdiction_utilization',
                        width: 50,
                        expandable: 'true',
                        expandableHeader: true
                    },
                    {
                        Header: 'capability_description',
                        accessor: 'capability_description',
                        width: 50,
                        expandable: 'true',
                        expandableHeader: true
                    },
                    {
                        Header: 'viewLink',
                        accessor: 'viewLink',
                        width: 50,
                        expandable: 'true',
                        expandableHeader: true
                    },
                ]
            },
            prompt: 'Document each jurisdiction’s existing authorities, policies, programs and resources and its ability' +
                ' to expand on and improve these existing policies and program ' +
                ' a. Examples: Staff involved local planning activities,' +
                ' public works/emergency management, funding through taxing authority and annual budgets, regulatory authorities' +
                ' for comp. Planning building codes and ordinances',
            intent: 'To ensure that each jurisdiction evaluates its capabilities to accomplish hazard mitigation actions,' +
                ' through existing mechanisms. This is especially useful for multi‐jurisdictional plans where local' +
                ' capability varies widely.',
            viewLink: true,
            activeGeoFilter: 'true',
            defaultSortCol: 'adopting_authority',
            // defaultSortOrder: 'desc',
            colOrder: ['Jurisdiction','Name', 'category', 'type', 'Link', 'responsible authority', 'jurisdiction_utilization', 'capability_description', 'viewLink'],
            minHeight: '80vh',
            icon: 'os-icon-tasks-checked'
		},
	],
	'Engagement' : [
		{
			title: 'Jurisdictional Engagement',
			requirement: 'Req-A-1H',
			type: 'content',
			prompt: 'Plan updates must include documentation of the current planning process undertaken to update the plan.',
			intent: '',
			icon: 'os-icon-users',
			// hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true
		},
		{
			title: 'Jurisdictional Participants',
			requirement: 'Req-A-1F',
			hideNav: true,
			type: 'formTable',
			fontSize: '0.70em',
			height: '600px',
			align: 'full',
			config: {
				type:'roles',
        		description: '',
        		columns : [
					{
						Header: 'Jurisdiction',
						accessor: 'contact_municipality',
						sort: true,
						filter: 'default'
					},
        			{
        				Header: 'Name',
        				accessor: 'contact_name',
						sort: true,
						filter: 'default'
        			},
        			{
        				Header: 'Agency',
        				accessor: 'contact_agency',
						sort: true,
						filter: 'default'
        			},
					{
						Header: 'Department',
						accessor: 'contact_department',
						sort: true,
						filter: 'default'
					},
        			{
        				Header: 'Role',
        				accessor: 'contact_title_role',
						sort: true,
						filter: 'multi'
        			},
        			{
        				Header: 'Participation',
        				accessor: 'contact_planning_team',
						sort: true,
						filter: 'multi'
        			},
        			{
                        Header: 'viewLink',
                        accessor: 'viewLink',
                        width: 50,
                        expandable: 'true',
                        expandableHeader: true
                    },
        		]
        
			},
			//align: 'full',
			prompt: 'Identify who represented each jurisdiction.',
			intent: 'Document the planning process, including how it was prepared and who was involved in the process for each jurisdiction?',
			activeGeoFilter: 'true',
			defaultSortCol: 'contact_agency',
			// defaultSortOrder: 'desc',
			viewLink: 'true',
			colOrder: ['Jurisdiction', 'Name', 'Agency', 'Department', 'Role', 'Participation', 'viewLink'],
			minHeight: '80vh',
			icon: 'os-icon-user'
		},
		// {
		// 	title: 'Jurisdictional Participation',
		// 	requirement: 'Req-A-1E',
		// 	type: 'content',
		// 	prompt: 'Plan updates must include documentation of the current planning process undertaken to update the plan.',
		// 	intent: '',
		// 	icon: 'os-icon-users',
		// 	// hideNav: true // hides key from public nav. Displays on page.
  //           ///*2-non-county*/ pullCounty: true,
  //           ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
  //           /*2-non-delete*/ hideIfNull: true
		// },
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
				subType: 'meeting',
				description: 'The table below chronologically lists all of the meetings that occurred within the planning process to generate this Hazard Mitigation Plan with the most recent at the top. Each meeting has a Narrative section that describes major discussion points and anticipated deliverables from each meeting. These can be accessed by clicking on the row in the table. To view all details of the meeting click the View Link. Planning milestones met during that meeting are available in the table and can be searched for keywords using the search bar at the top of the table.',
        		columns : [
        			{
        				Header: 'Date',
        				accessor: 'start_date',
        				width: 50,
						sort: true
        			},
        			{
        				Header: 'Jurisdiction',
        				accessor: 'contact_municipality',
        				width: 80,
        				filter: 'default',
        			},
        			{
        				Header: 'Name',
        				accessor: 'title',
        				filter: 'default',
        			},
        			{
        				Header: 'Meeting Format',
        				accessor: 'meeting_format',
        				width: 50,
						sort: true
        			},
        			{
        				Header: 'Invitation Methods',
        				accessor: 'invite_method',
        				width: 50,
						sort: true
        			},
        			{
        				Header: 'Milestones',
        				accessor: 'milestones',
        				filter: 'default',
        				width: 100,
        			},
        			{
        				Header: 'Hours',
        				accessor: 'hours',
        				width: 40
        			},
        			{
        				Header: 'Narrative',
        				accessor: 'narrative',
						displayType: 'contentViewer',
        				width: 300,
						filter: 'default',
						expandable: 'true',
                        expandableHeader: true
        			},
        			{
        				Header: 'Participants',
        				accessor: 'roles',
        				width: 300,
						filter: 'default',
						expandable: 'true',
                        expandableHeader: true,
						displayType: 'AvlFormsJoin',
						formAttribute: 'contact_name',
        			},
        			{
                        Header: 'viewLink',
                        accessor: 'viewLink',
                        width: 50,
                        expandable: 'true',
                        expandableHeader: true
                    },
        		]
        
			},
			prompt: '',
			intent: 'For each jurisdiction seeking plan approval, the plan must document how they were involved in the planning process.',
			// activeGeoFilter: 'true',
			viewLink: 'true',
			defaultSortCol: 'start_date',
			defaultSortOrder: 'desc',
			colOrder: ['Date','Jurisdiction', 'Name', 'Meeting Format', 'Invitation Methods', 'Milestones', 'Hours', 'Narrative', 'Participants', 'viewLink' ],
			minHeight: '80vh',
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
			requirement: 'Req-E-2',
			type: 'content',
			prompt: `The plan must include documentation of plan adoption, usually a resolution by the governing body or other authority.
			a.   Upload Prompts: 
				i.	Meeting minutes
				ii.	Formal resolution by governing body or other authority 
				iii.	Written proof of the adoption by clerk, attorney or highest elected official 
			`,
			intent: 'To demonstrate the jurisdiction’s commitment to fulfilling the hazard mitigation goals outlined in' +
				' the plan, and to authorize responsible agencies to execute their responsibilities.',
				icon: 'os-icon-users',
				// hideNav: true // hides key from public nav. Displays on page.
			/*2-non-county*/ pullCounty: true,
			///*2-non-not-provided*/ nullMessage: `<i>Jurisdiction info not provided.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
			///*2-non-delete*/ hideIfNull: true
		},
		{
			title: '',
			requirement: 'Req-E-1',
			hideNav: true,
			type: 'formTable',
			align: 'full',
			fontSize: '.7em',
			config: {
				type:'capabilities', // type is same as the route path for now
				description:'The table below lists the municipalities that have adopted this hazard mitigation plan, the name of the authorities that adopted the plan, and the date of adoption.',
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
			activeGeoFilter: 'true',
			defaultSortCol: 'municipality',
			// defaultSortOrder: 'desc',
			colOrder: ['Municipality', 'adopting authority', 'responsible authority', 'Adoption Date'],
			// minHeight: '80vh',
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