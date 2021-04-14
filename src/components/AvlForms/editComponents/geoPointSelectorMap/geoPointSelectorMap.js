import React from 'react'
import AvlMap from 'components/AvlMap'
import selectorLayer from './selectorLayer'
import styled from "styled-components";

const DIV = styled.div`
${props => props.theme.panelDropdownScrollBar};
`;

class geoPointSelectorMap extends React.PureComponent {
    constructor(props) {
        super(props);

    }

    renderResults() {
        return JSON.stringify(this.state)
    }

    renderMap(id = 'tmpid') {
        console.log('??', this.props.state[this.props.title])
        if (this.props.state[this.props.title]) {
            console.log('???', JSON.parse(this.props.state[this.props.title]))
        }
        return (
            <div>
                <button className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded" type="button"
                        onClick={
                            (e) => document.getElementById('closeMe' + id).style.display =
                                document.getElementById('closeMe' + id).style.display === 'block' ? 'none' : 'block'
                        }
                        style={{'float': 'center'}}> {(this.props.state[this.props.title] || []).length === 0 ? `Select location(s)` : `Update location(s)`}
                </button>
                <div aria-labelledby="mySmallModalLabel"
                     className="onboarding-modal modal fade animated show" role="dialog"
                     id={`closeMe` + id}
                     tabIndex="0"
                     style={{display: 'none', margin: '0vh 0vw'}}
                     onClick={(e) => {
                         if (e.target.id === `closeMe` + id) {
                             e.target.closest(`#closeMe` + id).style.display = 'none'
                         }
                     }}
                     aria-hidden="true">
                    <div className="modal-dialog modal-centered modal-lg"
                         style={{width: '60vw', height: '100vh', padding: '5vh 5vw'}}>
                        <div className="modal-content text-center"
                             style={{width: '60vw', height: '80vh ', overflow: 'auto'}}>

                            <div className="modal-header"><h6 className="modal-title">Prompt
                                {JSON.stringify(this.props.state[this.props.title])}
                            </h6>
                                <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                        onClick={(e) => {
                                            e.target.closest(`#closeMe` + id).style.display = 'none'
                                        }}>
                                    <span aria-hidden="true"> ×</span></button>
                            </div>
                            <div style={{height: '100%', width: '100%'}}>
                                <AvlMap
                                    sidebar={false}
                                    mapactions={false}
                                    scrollZoom={true}
                                    showStyleControl={true}
                                    zoom={6}
                                    layers={[selectorLayer]}
                                    layerProps={{
                                        [selectorLayer.name]: {
                                            onChange: (e) => {
                                                console.log('changing..', JSON.stringify(e.map((l, lI) => ({[lI]: l})).reduce((a, c) => ({...a, ...c}), {})))
                                                this.props.handleChange(
                                                    {
                                                        target: {
                                                            id: this.props.title,
                                                            value: JSON.stringify(e.map((l, lI) => ({[lI]: l})).reduce((a, c) => ({...a, ...c}), {}))
                                                        }
                                                    })
                                            },
                                            value: this.props.state[this.props.title] ? Object.values(JSON.parse(this.props.state[this.props.title])) : []
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if (this.props.display_condition !== '' && this.props.display_condition) {
            return (
                <div className="col-sm-12"
                     style={{display: this.props.display_condition.check.includes(this.props.state[this.props.display_condition.attribute]) ? 'block' : 'none'}}>
                    <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}
                        <span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span>
                    </label><span
                        style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                        {this.renderMap()}
                    </div>
                    <br/>
                </div>

            )
        } else {
            return (
                <div className="col-sm-12">
                    <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}
                        <span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span>
                    </label><span
                        style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                        {this.renderMap()}
                    </div>
                    <br/>
                </div>

            )
        }

    }

}

export default geoPointSelectorMap;