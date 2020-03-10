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
  ${props => props.theme.panelDropdownScrollBar};
  overflow: auto;
  .table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      ${'' /* In this example we use an absolutely position resizer,
       so this is required. */}
      position: relative;

      :last-child {
        border-right: 0;
      }
      .tbody {
          ${props => props.theme.panelDropdownScrollBar};
          overflow: auto;
      }
      .resizer {
        display: inline-block;
        background: blue;
        width: 10px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;
        ${'' /* prevents from scrolling while dragging on touch devices */}
        touch-action:none;

        &.isResizing {
          background: red;
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

    return (
        <div {...getTableProps()} className="table">
            <div>
                {headerGroups.map(headerGroup => (
                    <div {...headerGroup.getHeaderGroupProps()} className="tr">
                        {headerGroup.headers.map(column => (
                            <div {...column.getHeaderProps(headerProps)} className="th">
                                {column.render('Header')}
                                {/* Use column.getResizerProps to hook up the events correctly */}
                                <div
                                    {...column.getResizerProps()}
                                    className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div {...getTableBodyProps()} style={{height: height ? height : 'auto'}} className='tbody'>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <div {...row.getRowProps()} className="tr">
                            {row.cells.map(cell => {
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
