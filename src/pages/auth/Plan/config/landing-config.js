
let config = {
    'Landing Image': [{
        title: 'Landing Image',
        requirement: `landing-image`,
        type: 'image',
        prompt: '',
        intent: '',
        callout: '',
        label:'Image', // Which you would like to see on the form
        height: 250,
        width: 500,
        border: 1,
        icon: 'os-icon-arrow-right7',
    }],
    'Landing Quote': [{
        title: 'Landing Quote',
        requirement: `landing-quote`,
        type: 'content',
        prompt: '',
        intent: '',
        callout: '',
        icon: 'os-icon-arrow-right7'
    }],
    'County Description': [{
        title: 'County Description',
        requirement: `landing-countydesc`,
        type: 'content',
        prompt: '',
        intent: '',
        callout: '',
        icon: 'os-icon-arrow-right7'
    }],
/*    'Roles': [{
        title: 'Roles',
        requirement: `landing-roles`,
        type: 'formTable',
        fontSize: '0.70em',
        height: '600px',
        align: 'full',
        config: {
            type:'roles',
            columns : [
                {
                    Header: 'Name',
                    accessor: 'contact_name'
                },
                {
                    Header: 'Agency',
                    accessor: 'contact_agency'
                },
                {
                    Header: 'Role',
                    accessor: 'contact_title_role'
                }
            ]

        },
        prompt: '',
        intent: '',
        callout: '',
        icon: 'os-icon-arrow-right7'

    }],*/
    'Strategy Text': [{
        title: 'Strategy Text',
        requirement: `landing-strategytext`,
        type: 'content',
        prompt: '',
        intent: '',
        callout: '',
        icon: 'os-icon-arrow-right7'
    }],
    'Goals and Objectives Text': [{
        title: 'Goals and Objectives Text',
        requirement: `landing-goalsandobjectives`,
        type: 'content',
        prompt: '',
        intent: '',
        callout: '',
        icon: 'os-icon-arrow-right7'
    }],

}

export default config;