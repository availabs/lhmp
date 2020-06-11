import React from 'react'
import _ from 'lodash'
import MultiSelectFilter from 'components/filters/multi-select-filter.js'

class MultiSelectComponent extends React.PureComponent {
    constructor(props) {
        super(props);

    }

    render() {
        let data = this.props.meta ? this.props.meta : this.props.filterData ? this.props.filterData.map(fd => ({name: fd, value: fd})) : [];
        if(this.props.area === 'true' && this.props.depend_on === undefined){
            data = data.map((item,i) => item)
        }else if(this.props.depend_on === undefined && this.props.area === undefined && this.props.state[this.props.depend_on] === undefined){
            if(this.props.formType.includes('zones')){
                data = data[0] && data[0].type ? _.uniqBy(data,'type').map(m => m.type) : data
            }else{
                data = data[0] && data[0].category ? _.uniqBy(data,'category').map(m => m.category) : data
            }
        }else if(this.props.state[this.props.depend_on] !== undefined && this.props.area === undefined
            && this.props.state[this.props.depend_on] !== 'None'){
            data = data.filter(m => this.props.state[this.props.depend_on].includes(m.category)).map(m => m.type)
        }else if(this.props.state[this.props.depend_on] !== undefined && this.props.area ==='true'
            && this.props.state[this.props.depend_on] !== 'None'){
            data = data
                .filter(item => this.props.state[this.props.depend_on].includes(item.value.slice(0,5)))
                .map((item,i) => item)
        }else{
            data = this.props.meta ? this.props.meta : this.props.filterData;
        }
        //console.log('data after conditions', data, this.props)data = data[0] && data[0].category ? _.uniqBy(data,'category').map(m => m.category) : data
        return (
            <div className="col-sm-12" onClick={this.props.onClick ? this.props.onClick : () => {
            }}>
                <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}
                    <span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span>
                </label><span
                    style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                    <MultiSelectFilter
                        filter={{
                            domain: data || [],
                            value: this.props.state[this.props.title] ? this.props.state[this.props.title] : this.props.defaultValue ? this.props.defaultValue : []
                        }}
                        setFilter={(e) => {
                            this.props.handleMultiSelectFilterChange(e, this.props.title, data);
                            if (this.props.onClick) {
                                this.props.onClick({target: {value: e}})
                            }
                        }}
                        placeHolder={this.props.placeholder}
                    />
                </div>
                <br/>
            </div>

        )
    }

}

export default MultiSelectComponent;
