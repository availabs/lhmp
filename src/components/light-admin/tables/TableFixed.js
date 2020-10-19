import React from 'react'
import styled from 'styled-components'
import {useFilters, useGlobalFilter, useSortBy, useTable} from 'react-table'
import {CSVLink, CSVDownload} from 'react-csv';
// A great library for fuzzy filtering/sorting items
import matchSorter from 'match-sorter'
import {Link} from "react-router-dom";
import _ from 'lodash'
import MultiSelectFilter from "../../filters/multi-select-filter";
import megaAvlFormsConfig from 'pages/auth/megaAvlFormsConfig.js';

const DIV = styled.div`
${props => props.theme.panelDropdownScrollBar};
.expandable {
        cursor: pointer;
    }
.displayNone { display: none; }
.displayTableRow { display: table-row;}
`;
const _MultiSelectFilter = styled.div`
    * {
        font-weight: 0;
    }
    text-transform: capitalize;
	margin: 0px !important;
	display: flex;

    .item-selector {
        border: none;
    }
    .item-selector>div>div {
        border: 0.5px solid ${props => props.theme.borderColorLight};
            color: #b5b5b7;

    }
	:hover {
		border-color: ${props => props.theme.textColorHl};
	}

	> div:first-child {
		padding-right: 0px;
	}
	>div {
		width: 100%;
	}
`

const COL_SIZE_STYLE = {maxWidth: '30vw', overflowWrap: 'anywhere'}
// Define a default UI for filtering
function DefaultColumnFilter({
                                 column: {filterValue, preFilteredRows, setFilter},
                             }) {
    const count = preFilteredRows.length;

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
// This is a custom filter UI for selecting
// a unique option from a list
function MultiSelectColumnFilter({
                                     column: { filterValue, setFilter, preFilteredRows, id },
                                 }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])
    const count = preFilteredRows.length;

    // Render a multi-select box
    return (
        <_MultiSelectFilter>
            <MultiSelectFilter
                filter={{
                    domain: options,
                    value: filterValue ? filterValue : []//this.props.state[this.props.title] ? this.props.state[this.props.title] : this.props.defaultValue ? this.props.defaultValue : []
                }}
                setFilter={(e) => {
                    setFilter(e || undefined) // Set undefined to remove the filter entirely
                }}
                placeHolder={`Search ${count} records...`}
            />
        </_MultiSelectFilter>
    )
}
function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, {keys: [row => row.values[id]]})
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val;

function renderCell(cell) {
    return (
        cell.column.link ?
            cell.column.linkOnClick ?
                <div
                    className={'a'}
                    style={{cursor: 'pointer'}}
                    onClick={() => cell.column.linkOnClick(
                        {
                            link: typeof cell.column.link === 'boolean' ? cell.row.original.link : cell.column.link(cell.row.original.link),
                            header: cell.column.Header,
                            row0: cell.row.allCells[0].value
                        }
                    )
                    }>
                    {
                        cell.column.formatValue ?
                            cell.column.formatValue(cell.value) :
                            cell.render('Cell')
                    }
                </div> :
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
    )
}

function Table({columns, data, height, tableClass, actions, csvDownload}) {
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
            multi: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined && filterValue.length
                        ? filterValue.map(fv => String(fv).toLowerCase()).includes(String(rowValue).toLowerCase())
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
            defaultColumn, // Be sure to pass the defaultColumn option
            filterTypes
        },
        useFilters, // useFilters!
        useGlobalFilter, // useGlobalFilter!
        useSortBy,
    );
    if (!rows) return null;
    let downloadData;
    if (csvDownload.length){
        downloadData = [...rows.map(r => r.original)]
        downloadData = downloadData.map(row => {
            let tmpRow = {}
            Object.keys(row)
                .filter(f => !['edit', 'view', 'delete', 'update status'].includes(f))
                .forEach(key => {
                    if (csvDownload.includes(key)){
                        tmpRow[
                            megaAvlFormsConfig[key].label && megaAvlFormsConfig[key].label.length ?
                                megaAvlFormsConfig[key].label : key
                            ] = row[key]
                    }
                // if (!csvDownload.includes(key)) delete row[key]
            })
            return tmpRow
        })
    }

    return (
        <DIV style={{overflow: 'auto', height: height ? height : 'auto'}}
             className={tableClass ? tableClass : 'table table-sm table-lightborder table-hover dataTable'}>
            <table {...getTableProps()} style={{width: '100%'}}>
                <thead>
                {headerGroups.map((headerGroup,i) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key ={i}>
                        {headerGroup.headers
                            .filter(cell => cell.expandable !== 'true')
                            .map((column,j) => (
                            // Add the sorting props to control sorting. For this example
                            // we can add them into the header props
                            <th key ={j} style={{verticalAlign: 'middle', maxWidth: '30vw'}}>
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
                                <div>{column.canFilter && column.filter ?
                                    column.filter === 'multi' ?
                                        column.render(MultiSelectColumnFilter) : column.render('Filter') : null}</div>
                            </th>
                        ))}
                        {csvDownload.length ?
                            <th colSpan={4} key={i}>
                                <CSVLink className='btn btn-secondary btn-sm'
                                         style={{width:'100%'}}
                                         data={downloadData} filename={'table_data.csv'}>Download CSV</CSVLink>
                            </th> :
                            actions ? Object.keys(actions).map((action,i) => <th key={i}></th>) : null
                        }
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map(
                    (row, i) => {
                        prepareRow(row);
                        return (
                            <React.Fragment key={i}>
                            <tr {...row.getRowProps()}
                                className={row.cells
                                    .filter(cell => cell.column.expandable === 'true').length ? "expandable" : ""}
                                onClick={(e) => {
                                    let siblings = e.target.parentNode.parentNode.children;
                                    for(let s = i; s < siblings.length - 1; s++){
                                        if (siblings[s] && siblings[s].id === `expandable${i}`){
                                            if (siblings[s].classList.contains('displayNone')){
                                                siblings[s].classList.remove('displayNone');
                                                siblings[s].classList.add('displayTableRow');
                                            }else{
                                                siblings[s].classList.add('displayNone');
                                                siblings[s].classList.remove('displayTableRow');
                                            }
                                        }
                                    }
                                }}
                            >
                                {row.cells
                                    .filter(cell => cell.column.expandable !== 'true')
                                    .map(cell => {
                                    if (cell.column.Header.includes('.')){
                                        cell.value = cell.row.original[cell.column.Header]
                                    }
                                    return (
                                        <td {...cell.getCellProps()} style={COL_SIZE_STYLE}>
                                            {renderCell(cell)}
                                        </td>
                                    )
                                })}
                                {actions ?
                                    Object.keys(actions)
                                        .map((action,i) => {
                                                return (
                                                    <td key={i}>
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
                                                    </td>)
                                            }
                                        )
                                    : null}
                            </tr>
                                {row.cells
                                    .filter(cell => cell.column.expandable === 'true')
                                    .map(cell => {
                                        return (
                                            <tr
                                                className='displayNone'
                                                id={`expandable${i}`} style={{backgroundColor: 'rgba(0,0,0,0.06)',
                                                /*display: 'none'*/}}>
                                                <td {...cell.getCellProps()}
                                                    colSpan={
                                                        row.cells.filter(cell => cell.column.expandable !== 'true').length +
                                                        (actions ? Object.keys(actions).length : 0)
                                                    } style={COL_SIZE_STYLE}>
                                                    {cell.column.expandableHeader ?
                                                        <div style={{paddingTop: '5px',paddingBottom: '5px'}}>{cell.column.Header}</div> :
                                                        null}
                                                    {renderCell(cell)}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }

                            </React.Fragment>
                        )
                    }
                )}
                </tbody>
            </table>
        </DIV>
    )
}

export default Table
