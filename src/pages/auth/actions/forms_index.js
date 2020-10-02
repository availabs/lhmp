import React from 'react';
import AvlFormsListTable from 'components/AvlForms/displayComponents/listTable.js';
import ProjectConfig from 'pages/auth/actions/actions_project_forms/config.js'

const ActionsFormsIndex = () => (
    <AvlFormsListTable
    json = {ProjectConfig}
    createButtons = {true}
    editButton = {true}
    viewButton = {true}
    deleteButton = {true}
    />
)

export default [
    {
        path: '/actions/',
        name: 'Actions',
        auth: true,
        exact: true,
        mainNav: false,
        icon: 'os-icon-pencil-2',
        breadcrumbs: [
            { name: 'Actions', path: '/actions/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: ActionsFormsIndex
    }
]
