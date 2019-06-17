import React from 'react'

class HomeNav extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  render(){
    var badge = (this.props.numUnreadNotifications > 0) ? (<span className="badge badge-pill badge-danger">{this.props.numUnreadNotifications}</span>) : null
    return(
        <div id="homeNav" className='fr'>
          <div className="row">
            <div className="col7">
              <h6 id="dashboard" onClick={this.props.changePage} className={this.props.page == "dashboard" ? "active " : ""}>Dashboard</h6>
            </div>
            
            <div className="col6">
              <h6 id="guide" onClick={this.props.changePage} className={this.props.page == "guide" ? "active " : ""}>Guide</h6>
            </div>
          </div>
        </div>
      )

  }


}

export default HomeNav