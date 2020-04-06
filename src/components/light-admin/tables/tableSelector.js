import React from "react";
import TableFixed from 'components/light-admin/tables/TableFixed'
import TableFlex from 'components/light-admin/tables/Table'

function selectTable({ columns, data, height, width, tableClass, flex = false, actions = {} }) {
    return flex ? <TableFlex columns={columns} data={data} height={height} width={width} tableClass={tableClass} actions={actions}/> :
        <TableFixed columns={columns} data={data} height={height} tableClass={tableClass} actions={actions}/>
}

export default selectTable