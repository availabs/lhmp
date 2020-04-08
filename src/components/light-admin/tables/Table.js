import React from 'react'
import styled from 'styled-components'
import {
    useFilters,
    useFlexLayout,
    useGlobalFilter,
    useResizeColumns,
    useRowSelect,
    useSortBy,
    useTable
} from 'react-table'
import matchSorter from "match-sorter";
import {Link} from "react-router-dom";


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
        border-bottom: none; #1px solid #999;
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
`;

const actionBtnStyle = {width:'80px'}
const headerProps = (props, {column}) => getStyles(props, column.align);

const cellProps = (props, {cell}) => getStyles(props, cell.column.align);

const getStyles = (props, align = 'left') => {
    return [
        props,
        {
            style: {
                justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
                textAlign: align,
                alignItems: 'flex-start',
                display: 'flex',
                flexWrap: 'wrap'
            },
        },
    ]
};

// Define a default UI for filtering
function DefaultColumnFilter({
                                 column: {filterValue, preFilteredRows, setFilter},
                             }) {
    const count = preFilteredRows.length;

    return (
        <input
            style={{width: 'inherit'}}
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, {keys: [row => row.values[id]]})
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val;

function Table({columns, data, tableClass, height, width, actions}) {
    /*  const defaultColumn = React.useMemo(
        () => ({
          // When using the useFlexLayout:
          minWidth: 30, // minWidth is only used as a limit for resizing
          width: 150, // width is used for both the flex-basis and flex-grow
          maxWidth: 400, // maxWidth is only used as a limit for resizing
        }),
        []
      )*/
    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    );

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
            minWidth: 30, // minWidth is only used as a limit for resizing
            width: 150, // width is used for both the flex-basis and flex-grow
            maxWidth: 400, // maxWidth is only used as a limit for resizing
        }),
        []
    );
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
            filterTypes
        },
        useResizeColumns,
        useFlexLayout,
        useFilters, // useFilters!
        useGlobalFilter, // useGlobalFilter!
        useSortBy,
        useRowSelect
    );

    return (
        <div {...getTableProps()}
             style={{overflow: 'auto',/* width: width ? width : 'fit-content'*/}}
             className={tableClass ? tableClass : 'table table-lightborder table-hover'}>
            <div>
                {headerGroups.map(headerGroup => (
                    <div
                        {...headerGroup.getHeaderGroupProps({
                            style: {paddingRight: '15px', borderBottom: '1px solid #999', /*width: 'fit-content'*/},
                        })}
                        className="tr"
                    >
                        {headerGroup.headers.map(column => (
                            <div {...column.getHeaderProps()} className="th">
                                {column.sort ?
                                    (
                                        <div {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Header')}
                                            {/* Add a sort direction indicator */}
                                            <span>
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? <i className="os-icon os-icon-arrow-up6"></i>
                                                            : <i className="os-icon os-icon-arrow-down6"></i>
                                                        : ''}
                                                </span>
                                        </div>
                                    ) : column.render('Header')}

                                {/* Render the columns filter UI */}
                                <div {...column.getHeaderProps()}>{column.canFilter && column.filter ? column.render('Filter') : null}</div>

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
                        {actions ?
                            Object.keys(actions)
                                .map(action => <div {...headerGroup.headers[0].getHeaderProps()} style={actionBtnStyle} className="th"></div>) : null
                        }
                    </div>
                ))}
            </div>
            <div {...getTableBodyProps()} className="tbody"
                 style={{height: height ? height : 'auto'}}

            >
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <div {...row.getRowProps()} className="tr">
                            {row.cells.map(cell => {
                                return (
                                    <div {...cell.getCellProps(cellProps)} className="td">
                                        {
                                            cell.column.link ?
                                                <Link
                                                    to={typeof cell.column.link === 'boolean' ? cell.row.original.link : cell.column.link(cell.row.original.link)}>
                                                    {
                                                        cell.column.formatValue ?
                                                            cell.column.formatValue(cell.value) :
                                                            cell.render('Cell')
                                                    }
                                                </Link> :
                                                cell.column.formatValue ?
                                                    cell.column.formatValue(cell.value) :
                                                    cell.render('Cell')

                                        }
                                    </div>
                                )
                            })}
                            {actions ?
                                Object.keys(actions)
                                    .map(action => {
                                            return (
                                                <div {...row.cells[0].getCellProps(cellProps)} style={actionBtnStyle} className="td">
                                                    {
                                                        typeof row.original[action] === 'string' ?
                                                            <Link
                                                                className={action === 'delete' ?
                                                                    'btn btn-sm btn-outline-danger' :
                                                                    "btn btn-sm btn-outline-primary"}
                                                                style={{textTransform: 'capitalize'}}
                                                                to={row.original[action]}>
                                                                {action}
                                                            </Link>
                                                            :
                                                            row.original[action]
                                                    }
                                                </div>)
                                        }
                                    )
                                : null}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


function StyledTable({columns: columns, data: data, height, width, actions}) {
    return (
        <Styles>
            <Table columns={columns} data={data} height={height} width={width} actions={actions}/>
        </Styles>
    )
}

export default StyledTable
