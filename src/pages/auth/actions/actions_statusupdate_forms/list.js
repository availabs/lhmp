import React from 'react';
import AvlFormsListTable from 'components/AvlForms/displayComponents/listTable.js';
import ProjectConfig from './config'

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
        path: '/action_status_update/',
        name: 'Actions Status Update',
        auth: true,
        exact: true,
        mainNav: false,
        icon: 'os-icon-pencil-2',
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
