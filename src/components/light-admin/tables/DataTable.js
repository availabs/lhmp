
import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom'

const ScrollBody = styled.tbody`
   ${props => props.theme.panelDropdownScrollBar}
`


export default ({ tableData=[], columns=[], links={}, onClick=null, maxHeight=false, tableScroll=false, widths=[] }) => {
  if (!tableData || tableData.length === 0) {
    return ('No Data Sent to table. Loading ...')
  }
  if (!columns.length) {
    columns = Object.keys(tableData[0])
  }
  return (
    <table className="table table-lightborder table-hover">
      <thead style={{
        tableLayout: 'fixed',
        borderCollapse: 'collapse',
        width: '100%'
      }} >
        <tr style={tableScroll ? {display: 'block', width: '100%'}
              : {}}>
          { columns.map((col, i) => (<th key={ i } style={ tableScroll ? {width: widths[i] || `${100 /columns.length}%`, textAlign: 'center'  } : {}}>{ col }</th>)) }
        </tr>
      </thead>
      <ScrollBody style={{
         maxHeight: maxHeight || 'none',
         overflowY: tableScroll ? 'auto' : 'inherit',
         display: tableScroll ? 'block' : 'table-row-group',
         
      }}>
        {
          tableData.map((row, i) => (
            <tr key={ i } onClick={ onClick ? onClick.bind(null, row) : null } style={
              tableScroll ? {display: 'block', width: '100%'}
              : {}
            }>
              { columns.map((col, ii) => {
                  return (
                    (col in links) ?
                    <td key={ ii } style={ tableScroll ? {width: widths[ii] || `${100 /columns.length}%`  } : {}}>
                      <Link to={ links[col](row) }>{ row[col] }</Link>
                    </td>
                    : <td key={ ii } style={ tableScroll ? {width: widths[ii] || `${100 /columns.length}%`, textAlign: 'center', float: 'left'  } : {}}>{ row[col] }</td>
                  )
                })
              }
            </tr>
          ))
        }
      </ScrollBody>
    </table>

  )
}

