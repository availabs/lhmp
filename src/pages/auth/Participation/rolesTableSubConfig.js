const config = {
    title: 'Associated Roles',
    requirement: '',
    hideNav: true,
    type: 'formTable',
    fontSize: '0.70em',
    height: '600px',
    align: 'full',
    config: {
        type: 'roles',
        description: '',
        filterCol: 'roles',
        columns: [
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
        ],
        combineCols: {'Contact Agency + Department':[ 'contact_agency', 'contact_department']}
    },
    //align: 'full',
    prompt: 'Identify who represented each jurisdiction.',
    intent: 'Document the planning process, including how it was prepared and who was involved in the process for each jurisdiction?',
    activeGeoFilter: 'true',
    defaultSortCol: 'contact_agency',
    // defaultSortOrder: 'desc',
    colOrder: ['Jurisdiction', 'Name', 'Contact Agency + Department', 'Role', 'Participation'],
    minHeight: '80vh',
    icon: 'os-icon-user'
}

export default config