import React,{PureComponent} from 'react'
import ElementBox from '../containers/ElementBox'
import DataTable from './DataTable'
import Pagination from './Pagination'
import { reduxFalcor } from 'utils/redux-falcor'
import {connect} from "react-redux";
import get from "lodash.get";
import pick from "lodash.pick";
import table from "../../common/icons/table";
const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

class TableBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        page: 0,
        filter: "",
        filteredColumns: {},
        sortColumn: "",
        sortOrder: 1,
        loading:false
    };

    this.setPage = this.setPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.setFilter = this.setFilter.bind(this);
  }
  setPage(page) {
      this.setState({
          page,
          loading : true
      });
      let start = this.props.pageSize * page ;
      let end= Math.min(this.props.length,this.props.pageSize * page +this.props.pageSize + 1);
      this.props.onPage(start,end);
      return {start,end}

  }

  previousPage() {
    const page = Math.max(0, this.state.page - 1);
    this.setState({
        page
    });
  }
  nextPage() {
          const maxPages = Math.ceil( this.props.length / this.props.pageSize);
          let page = Math.min(maxPages - 1, this.state.page + 1);
          this.setState({
              page
          });
  }

  getFilteredData() {
    let filterKey = this.props.filterKey,
      filter = this.state.filter;
    if (!filter) return this.props.data;
    if (!filterKey.length) {
      filterKey = Object.keys(this.props.data[0])[0];
    }
    return this.props.data.filter(d => d[filterKey].toString().toLowerCase().includes(filter));
  }
toggleFilterColumn(column, value) {
    let { filteredColumns } = this.state;
    if (!(column in filteredColumns)) {
        filteredColumns[column] = [value];
    }
    else {
        if (filteredColumns[column].includes(value)) {
            filteredColumns[column] = filteredColumns[column].filter(v => v !== value)
            if (!filteredColumns[column].length) {
                delete filteredColumns[column];
            }
        }
        else {
            filteredColumns[column].push(value)
        }
    }
    this.setState({ filteredColumns });
}
    toggleSortColumn(sortColumn) {
        if (sortColumn === this.state.sortColumn) {
            this.setState({ sortOrder: -this.state.sortOrder })
        }
        else {
            this.setState({ sortColumn, sortOrder: -1 })
        }
    }
  setFilter(e) {
    this.setState({ filter: e.target.value.toLowerCase() });
  }

  componentDidUpdate(newState){
      if(this.state.page !== newState.page){

      }
  }

  render() {
      const {loading} =  this.state;
      if(this.props.filterData || this.props.tableData.length) {
              const data = this.props.tableData,
                  paginate = data.length > this.props.pageSize ? ( // data.length
                      <div className='controls-below-table'>
                          <Pagination
                              length={this.props.length} //data.length
                              page={this.state.page}
                              size={this.props.pageSize}
                              set={this.setPage}
                              prev={this.previousPage}
                              next={this.nextPage}
                          />
                      </div>
                  ) : null;
          const page = this.state.page,
              size = this.props.pageSize;
          let tableData = data.slice();
          if (!this.props.tableScroll) {
              //tableData = data.slice(0,size);
              tableData = tableData.slice(page * size, page * size + size);
          }
          const filterColumns = this.props.filterColumns.map(column =>
              ({ column, values: this.getFilterValues(column) }));
          const tableLink = this.props.tableLink ? <a href={ this.props.tableLink }>{ this.props.tableLinkLabel }</a> : null;
          const loading = this.state.loading ? <div>Loading...</div> : <div></div>;
              return (
                  <ElementBox title={this.props.title} desc={this.props.desc || tableLink}>
                      { !this.props.showControls ? null :
                          <div className="controls-above-table">
                              <div className="row">
                                  <div className="col-sm-6">
                                      <form className="form-inline">
                                          <input className="form-control form-control-sm bright"
                                                 onChange={ this.setFilter }
                                                 placeholder="Search" type="text" />
                                      </form>
                                  </div>
                                  <div className="col-sm-6">
                                      <form className="form-inline justify-content-sm-end">
                                          <a className="btn btn-sm btn-secondary" href="#">Download CSV</a>
                                      </form>
                                  </div>
                              </div>
                          </div>
                      }
                      <div>
                          <DataTable tableData={ tableData }
                                     columns={ this.props.columns }
                                     links={ this.props.links }
                                     onClick={ this.props.onClick }
                                     toggleFilterColumn={ this.toggleFilterColumn.bind(this) }
                                     filteredColumns={ this.state.filteredColumns }
                                     filterColumns={ filterColumns }
                                     expandColumns={ this.props.expandColumns }
                                     urlColumn={ this.props.urlColumn }
                                     toggleSortColumn={ this.toggleSortColumn.bind(this) }
                                     sortColumn={ this.state.sortColumn }
                                     sortOrder={ this.state.sortOrder }
                                     length = {this.props.length}
                                     onPageChange = {this.props.onPage.bind(this)}
                          />
                      </div>
                      { paginate}
                      {loading}
                  </ElementBox>
              )
          }
      }
}

TableBox.defaultProps = {
  pageSize: 50,
  tableData: [],
  columns: [],
  links: {},
  filterKey: "",
  onClick: null,
  showControls: true,
  height : '1020px',
  filterColumns: [],
  expandColumns: [],
  urlColumn: null,
  columnTypes: {},
  columnFormats: {},
  tableScroll: false,
  tableLink: null,
  tableLinkLabel: "Link",
  downloadedFileName: "table-data"
}

const mapStateToProps = (state,ownProps) => {
    return {
        geoid : ownProps.geoid,
        cousubs: get(state.graph, 'geo',{})

    }
};

const mapDispatchToProps =  {
    //sendSystemMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(TableBox))
