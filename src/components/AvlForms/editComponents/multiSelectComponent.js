import React from 'react'
import MultiSelectFilter from 'components/filters/multi-select-filter.js'

class MultiSelectComponent extends React.PureComponent{
    constructor(props){
        super(props);

    }

    render() {
        console.log('multi?', this.props)
        return (
            <div className="col-sm-12">
                <div className="form-group"><label htmlFor>{this.props.label}</label><span style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                    <MultiSelectFilter
                        filter={{
                            domain: this.props.filterData || [],
                            value: this.props.state[this.props.title] ? this.props.state[this.props.title] : this.props.defaultValue ? this.props.defaultValue : []
                        }}
                        setFilter={(e) => {
                            this.props.handleMultiSelectFilterChange(e, this.props.title,this.props.filterData)
                        }}
                    />
                </div>
                <br/>
            </div>

        )
    }

}

export default MultiSelectComponent;
