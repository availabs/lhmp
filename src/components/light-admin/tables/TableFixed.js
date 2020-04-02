import React from 'react'
import styled from 'styled-components'
import { useTable, useFilters, useGlobalFilter, useSortBy } from 'react-table'
// A great library for fuzzy filtering/sorting items
import matchSorter from 'match-sorter'
import {Link} from "react-router-dom";

const DIV = styled.div`
${props => props.theme.panelDropdownScrollBar};
`

// Define a default UI for filtering
function DefaultColumnFilter({
                                 column: { filterValue, preFilteredRows, setFilter },
                             }) {
    const count = preFilteredRows.length

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val



function Table({ columns, data, height, tableClass, actions }) {
    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    )

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            defaultColumn, // Be sure to pass the defaultColumn option
            filterTypes
        },
        useFilters, // useFilters!
        useGlobalFilter, // useGlobalFilter!
        useSortBy,

)

    // We don't want to render all 2000 rows for this example, so cap
    // it at 20 for this use case
    const firstPageRows = rows// .slice(0, 20)

    return (
        <DIV style={{overflow: 'auto', height: height ? height : 'auto'}} className={tableClass ? tableClass : 'table table-sm table-lightborder table-hover dataTable'}>
            <table {...getTableProps()} style={{width: '100%'}}>
                <thead >
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            // Add the sorting props to control sorting. For this example
                            // we can add them into the header props
                            <th>
                                {
                                    column.sort ?
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
                                        ) : column.render('Header')

                                }
                                {/* Render the columns filter UI */}
                                <div>{column.canFilter && column.filter ? column.render('Filter') : null}</div>
                            </th>
                        ))}
                        {
                            Object.keys(actions)
                                .map(action => <th></th>)
                        }
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {firstPageRows.map(
                    (row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {
                                                cell.column.link ?
                                                    <Link to={typeof cell.column.link === 'boolean' ? cell.row.original.link : cell.column.link(cell.row.original.link)}>
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
                                        </td>
                                    )
                                })}
                                    {actions ?
                                        Object.keys(actions)
                                            .map(action =>
                                               <td>
                                                   <Link className={action === 'delete' ? 'btn btn-sm btn-outline-danger' : "btn btn-sm btn-outline-primary"}
                                                         to={ row.original[action] }>
                                                       {action}
                                                   </Link>
                                               </td>
                                            )
                                        : null}
                            </tr>
                        )}
                )}
                </tbody>
            </table>
        </DIV>
    )
}

export default Table