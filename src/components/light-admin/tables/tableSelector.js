import React from "react";
import TableFixed from 'components/light-admin/tables/TableFixed'
import TableFlex from 'components/light-admin/tables/Table'

function selectTable({ columns, data, height, tableClass, flex = false }) {
    return flex ? <TableFlex columns={columns} data={data} height={height} tableClass={tableClass} /> :
        <TableFixed columns={columns} data={data} height={height} tableClass={tableClass} />
}

export default selectTable