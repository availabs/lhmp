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
        onlyAdmin: true
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
        'Annex' : [
        {
            title: 'Glossary',
            requirement: 'Req-S-5',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-folder',
        },
        {
            title: 'Guiding Authorities and References',
            requirement: 'Req-S-5A',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-folder' 
        },
        {
            title: 'Acronmys',
            requirement: 'Req-S-5B',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-folder'

        },
        {
            title: 'Mitigation News',
            requirement: 'Req-S-5C',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-folder'
        },
        {
            title: 'Change Log',
            requirement: 'Req-S-5D',
            type: 'content',
            prompt: '',
            intent: '',
            icon: 'os-icon-folder'
        },
        {
            title: 'Public Comment',
            requirement: 'Req-S-5E',
            type: 'content',
            prompt:'',
            intent: '',
            icon: 'os-icon-folder'
        }
    ]
}

export default config