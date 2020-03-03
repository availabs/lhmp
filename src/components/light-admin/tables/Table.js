import React from 'react'
import styled from 'styled-components'
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useRowSelect,
} from 'react-table'


const Styles = styled.div`
  padding: 1rem;

  .table {
    ${'' /* These styles are suggested for the table fill all available space in its containing element */}
    display: block;
    ${'' /* These styles are required for a horizontaly scrollable table overflow */}
    ${props => props.theme.panelDropdownScrollBar};
      
    overflow: auto;

    border-spacing: 0;
    
    .thead {
      ${'' /* These styles are required for a scrollable body to align with the header properly */}
      overflow-y: auto;
      overflow-x: hidden;
     
    }

    .tbody {
      ${'' /* These styles are required for a scrollable table body */}
      ${props => props.theme.panelDropdownScrollBar};
      
      overflow-y: auto;
      overflow-x: hidden;
      height: ${props => props.height ? props.height : 'auto'};
    }

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
      
    }

     .th {
        font-size: 0.75rem;
        text-transform: uppercase;
        border-top: none;
        border-bottom: 1px solid #999
        margin: 0;
        padding: 0.75rem;
        font-weight: 500;
        vertical-align: middle;
    }

    .td {
      margin: 0;
      padding: 0.75rem;
      vertical-align: middle;
      border-top: 1px solid rgba(83, 101, 140, 0.08);
}

      
      ${'' /* In this example we use an absolutely position resizer,
       so this is required. */}
      position: relative;

      :last-child {
        border-right: 0;
      }

      .resizer {
        right: -10px;
        background: #efefef;
        width: 1px;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 1;
        ${'' /* prevents from scrolling while dragging on touch devices */}
        touch-action:none;

        &.isResizing {
          background: red;
        }
      }
    }

    .th {
      &:last-of-type {
        .resizer {
          ${'' /* note that the 15 is the scroll width and if also referenced in the getHeaderGroupProps for the header row below */}
          ${'' /* todo: resolve this value dynamicaly from element.scrollWidth to account for OS/Browser differences  */}
          right: -15px;
        }
      }
    }
  }
`
const headerProps = (props, { column }) => getStyles(props, column.align)

const cellProps = (props, { cell }) => getStyles(props, cell.column.align)

const getStyles = (props, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
      textAlign: align,
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
]
function Table({ columns, data, tableClass, height }) {
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 400, // maxWidth is only used as a limit for resizing
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useResizeColumns,
    useFlexLayout,
    useRowSelect,
    
  )

    console.log('usetable',
        'params', columns,
        data,
        defaultColumn,
        'res',
        useTable(
        {
            columns,
            data,
            defaultColumn,
        },
        useResizeColumns,
        useFlexLayout,
        useRowSelect,

    ))
  return (
    <div {...getTableProps()} className={tableClass ? tableClass : 'table table-lightborder table-hover'}>
      <div>
        {headerGroups.map(headerGroup => (
          <div
            {...headerGroup.getHeaderGroupProps({
              style: { paddingRight: '15px' },
            })}
            className="tr"
          >
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps(headerProps)} className="th">
                {column.render('Header')}
                {/* Use column.getResizerProps to hook up the events correctly */}
                {column.canResize && (
                  <div
                    {...column.getResizerProps()}
                    className={`resizer ${
                      column.isResizing ? 'isResizing' : ''
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div {...getTableBodyProps()} className="tbody" style={{height: height ? height : 'auto', display: 'inline-block'}}>
        {rows.map((row, i) => {
          prepareRow(row)
            console.log('prepareRow(row)',prepareRow(row), row.getRowProps(), getTableBodyProps())
          return (
            <div {...row.getRowProps()} className="tr">
              {row.cells.map(cell => {
                  console.log('cell.getCellProps(cellProps)',cell.getCellProps(cellProps))
                  return (
                  <div {...cell.getCellProps(cellProps)} className="td">
                    {cell.render('Cell')}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}


function StyledTable({columns: columns, data: data, height}) {  
  console.log('table', columns, data)
  return (
    <Styles>
      <Table columns={columns} data={data} height={height} />
    </Styles>
  )
}

export default StyledTable
