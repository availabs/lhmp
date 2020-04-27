import React from "react";
import TableFixed from 'components/light-admin/tables/TableFixed'
import TableFlex from 'components/light-admin/tables/Table'

function selectTable({ columns, data, height, width, tableClass, flex = false, actions = {}, csvDownload = [] }) {
    return flex ? <TableFlex columns={columns} data={data} height={height} width={width} tableClass={tableClass} actions={actions} csvDownload={csvDownload}/> :
        <TableFixed columns={columns} data={data} height={height} tableClass={tableClass} actions={actions} csvDownload={csvDownload}/>
}

export default selectTable