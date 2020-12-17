const config = {
    title: 'Associated Meetings',
    requirement: '',
    hideNav: true,
    type: 'formTable',
    fontSize: '0.70em',
    height: '600px',
    align: 'full',
    config: {
        type: 'participation',
        description: '',
        filterCol: 'participation',
        columns: [
            {
                Header: 'Start Date',
                accessor: 'start_date',
                sort: true,
                filter: 'default'
            },
            {
                Header: 'Title',
                accessor: 'title',
                sort: true,
                filter: 'default'
            },
            {
                Header: 'Sub Type',
                accessor: 'sub_type',
                sort: true,
                filter: 'default'
            },
            {
                Header: 'Milestones',
                accessor: 'milestones',
                sort: true,
                filter: 'default'
            }
        ],
    },
    //align: 'full',
    prompt: '',
    intent: '',
    activeGeoFilter: 'true',
    defaultSortCol: 'start_date',
    // defaultSortOrder: 'desc',
    // colOrder: ['Jurisdiction', 'Name', 'Contact Agency + Department', 'Role', 'Participation'],
    minHeight: '80vh',
    icon: 'os-icon-user'
}

export default config