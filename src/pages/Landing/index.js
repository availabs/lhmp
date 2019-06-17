import React from 'react'
import LandingNav from './components/LandingNav'
import './LandingView.css'

class Landing extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div style={{ height: '100%' }}>
        <div className='view-blue'>
          <LandingNav page='home' />
          <section className='landingView' style={{ height: '100%' }}>
            <div className='container-fluid' style={{ height: '100%' }}>
              <div className='fp'>
                <div className='row '>
                   <div className='col-md-1' />
                  <div className='col-md-3' style={{ textAlign: 'right' }}>
                    <div className='fp'>
                      <div className='vc-text'>
                        <h1 style={{ fontSize: '1.5em', fontWeight: 500, color: '#fefefe' }}>
                          A CONGESTION PERFORMANCE MEASUREMENT TOOL SUITE
                        </h1>
                        <p style={{ fontSize: '1em', fontWeight: 300 }}>
                          The NPMRDS Performance Measurement Tool Suite provides you with the visualization tools you need to analyze
                          and report network performance, run corridor analyses, and conduct project analyses at various geographic and temporal resolutions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-7'>
                    <img className='img img-fluid thumbnail' src='/img/new-npmrds3.jpg' alt='Congestion Measurement'/>
                  </div>
                  <div className='col-md-1' />
                </div>
              </div>
            </div>
        </section>
      </div>
      <div className='view-lime fp2'>
          <section className='landingView' style={{ height: '100%' }}>
            <div className='container-fluid' style={{ height: '100%' }}>
              <div className='fp'>
                <div className='row '>
                   <div className='col-md-1' />
                  <div className='col-md-7'>
                    <img className='img img-fluid thumbnail' src='/img/pm3-dashboard.jpg'  alt='Performance Measures'/>
                  </div>
                  <div className='col-md-3' style={{ textAlign: 'left' }}>
                    <div className='fp'>
                      <div className='vc-text'>
                        <h1 style={{ fontSize: '1.5em',color: '#fefefe', fontWeight: 500 }}>
                          PM3 Reporting and Analysis
                        </h1>
                        <p style={{ fontSize: '1em', fontWeight: 300 }}>
                          <span className='bold-text'>Multi-geographic </span><br/> PM3 measures by state, MPO, county, and urbanized area or by TMC, route, and corridor<br/><br/>
                          <span className='bold-text'>Multi-temporal </span><br/> View Measures by year, month, and day.<br/><br/>
                          <span className='bold-text'>Fast Loading Times</span><br/> PM3 measures for the entire state load in under 1 second.<br/><br/>
                          
                           
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-1' />
                </div>
              </div>
            </div>
        </section>
      </div>
      <div className='view-red fp2'>
          <section className='landingView' style={{ height: '100%' }}>
            <div className='container-fluid' style={{ height: '100%' }}>
              <div className='fp'>
                <div className='row '>
                   <div className='col-md-1' />
                  <div className='col-md-3' style={{ textAlign: 'right' }}>
                    <div className='fp'>
                      <div className='vc-text'>
                        <h1 style={{ fontSize: '1.5em',color: '#fefefe', fontWeight: 500 }}>
                          Set More Informed PM3 Targets. 
                        </h1>
                        <p style={{ fontSize: '1em', fontWeight: 300 }}>
                           <span className='bold-text'>Pinpoint Analysis of PM3 Measures</span><br/>
                           Discover which TMCs are contributing negatively to your performance scores.<br/><br/>
                           <span className='bold-text'>Track PM3 Progress</span><br/>
                           Month over month and year over year analysis.<br/><br/>
                           <span className='bold-text'>Easy to Use Visualization and Analysis Tools</span><br/>
                           Default Templates for quick and easy analysis as well as highly customizable features for more in-depth analyses.<br/><br/>
                           <span className='bold-text'>Publish Reports Directly to the Web</span><br/>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-7'>
                    <img className='img img-fluid thumbnail' src='/img/pm3-root-causes.jpg' alt='Congestion Measurement'/>
                  </div>
                  <div className='col-md-1' />
                </div>
              </div>
            </div>
        </section>
      </div>
      <div className='view-gold fp2'>
          <section className='landingView' style={{ height: '75%' }}>
            <div className='container-fluid' style={{ height: '100%' }}>
              <div className='fp'>
                <div className='row '>
                   <div className='col-md-1' />
                  <div className='col-md-7'>
                    <img className='img img-fluid thumbnail' src='/img/new-npmrds-route.jpg' alt='Congestion Measurement' />
                  </div>
                  <div className='col-md-3' style={{ textAlign: 'left' }}>
                    <div className='fp'>
                      <div className='vc-text'>
                        <h1 style={{ fontSize: '1.5em',color: '#fefefe', fontWeight: 500 }}>
                          Tools are Highly customizable
                        </h1>
                        <p style={{ fontSize: '1em', fontWeight: 300 }}>
                          <span className='bold-text'>Create Your Own Geographies for Analysis</span><br/>
                           User-friendly tools to create your own Routes, Corridors, and Networks.<br/><br/>
                           <span className='bold-text'>Customizable Reporting and Analysis Tools</span><br/>
                           Highly customizable components allow you to build reports to meet your needs<br/><br/>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-1' />
                </div>
              </div>
            </div>
        </section>
      </div>
    </div>
    )
  }
}


export default {
  icon: 'icon-map',
  path: '/landing',
  name: 'AVAIL NPMRDS Analysis Tools',
  mainNav: false,
  menuSettings: {hide: true},
  component: Landing
}