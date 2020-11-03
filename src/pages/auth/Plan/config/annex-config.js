const config = {
    'Annex Image': [{
        title: 'Annex Image',
        requirement: `annex-image`,
        type: 'image',
        prompt: '',
        intent: '',
        callout: '',
        label:'Image', // Which you would like to see on the form
        height: 250,
        width: 500,
        border: 1,
        icon: 'os-icon-',
        onlyAdmin: true,
        pullCounty: false
    }],
    'Header' : [{
        title: 'Annex Quote',
        requirement: 'annex-quote',
        type: 'content',
        prompt: '',
        intent: '',
        callout: '',
        icon: 'os-icon-folder',
        onlyAdmin: true
    }],
        'About This Plan' : [
        {
            title: 'Disclaimer',
            requirement: 'Req-S-5E',
            type: 'content',
            prompt:'',
            intent: '',
            icon: 'os-icon-folder',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true
        },
        {
            title: 'Public Comment',
            requirement: 'Req-S-5F',
            type: 'content',
            prompt:'',
            intent: '',
            icon: 'os-icon-folder',
            // hideNav: true // hides key from public nav. Displays on page.
            /*2-non-county*/ pullCounty: true,
            ///*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
            ///*2-non-delete*/ hideIfNull: true
        },
        // {
        //     title: 'Glossary',
        //     requirement: 'Req-S-5',
        //     type: 'content',
        //     prompt: '',
        //     intent: '',
        //     icon: 'os-icon-folder',
        //     // hideNav: true // hides key from public nav. Displays on page.
        //     ///*2-non-county*/ pullCounty: true,
        //     /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        //     ///*2-non-delete*/ hideIfNull: true
        // },
        // {
        //     title: 'Guiding Authorities and References',
        //     requirement: 'Req-S-5A',
        //     type: 'content',
        //     prompt: '',
        //     intent: '',
        //     icon: 'os-icon-folder' ,
        //     // hideNav: true // hides key from public nav. Displays on page.
        //     ///*2-non-county*/ pullCounty: true,
        //     /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        //     ///*2-non-delete*/ hideIfNull: true
        // },
        // {
        //     title: 'Acronmys',
        //     requirement: 'Req-S-5B',
        //     type: 'content',
        //     prompt: '',
        //     intent: '',
        //     icon: 'os-icon-folder',
        //     // hideNav: true // hides key from public nav. Displays on page.
        //     ///*2-non-county*/ pullCounty: true,
        //     /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        //     ///*2-non-delete*/ hideIfNull: true

        // },
        // {
        //     title: 'Mitigation News',
        //     requirement: 'Req-S-5C',
        //     type: 'content',
        //     prompt: '',
        //     intent: '',
        //     icon: 'os-icon-folder',
        //     // hideNav: true // hides key from public nav. Displays on page.
        //     ///*2-non-county*/ pullCounty: true,
        //     /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        //     ///*2-non-delete*/ hideIfNull: true
        // },
        // {
        //     title: 'Change Log',
        //     requirement: 'Req-S-5D',
        //     type: 'content',
        //     prompt: '',
        //     intent: '',
        //     icon: 'os-icon-folder',
        //     // hideNav: true // hides key from public nav. Displays on page.
        //     ///*2-non-county*/ pullCounty: true,
        //     /*2-non-not-provided*/ nullMessage: `<i>Content coming soon.</i>`, // Other possible styles:  `<h1>No Data</h1>`, No data
        //     ///*2-non-delete*/ hideIfNull: true
        // },
    ]
}

export default config