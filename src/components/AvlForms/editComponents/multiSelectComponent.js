import React from 'react'
import _ from 'lodash'
import MultiSelectFilter from 'components/filters/multi-select-filter.js'
import functions from "../../../pages/auth/Plan/functions";
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
                /*.filter(item =>
                    Object.keys(this.props.geoRelations)
                        .filter(geoid => this.props.state[this.props.depend_on].includes(geoid))
                        .reduce((a,c) => {
                            a.push(...this.props.geoRelations[c]);
                            return a;
                        }, []).includes(item.value))*/
                .map((item,i) => ({value: item.value, name: functions.formatName(item.name, item.value)}))
        }else{
            data = this.props.meta ? this.props.meta : this.props.filterData;
        }
        //console.log('data after conditions', data, this.props)data = data[0] && data[0].category ? _.uniqBy(data,'category').map(m => m.category) : data
        let finalValue = this.props.state[this.props.title] ? this.props.state[this.props.title] : this.props.defaultValue ? this.props.defaultValue : [];
        return (
            <div className="col-sm-12" onClick={this.props.onClick ? this.props.onClick : () => {
            }}>
                <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}
                    <span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span>
                </label><span
                    style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                    <MultiSelectFilter
                        filter={{
                            domain: this.props.addAll === 'true' ?
                                data ? ['Select All', 'Select None', ...data] : ['Select All', 'Select None'] :
                                data || [],
                            value: finalValue && typeof finalValue === "object" ? finalValue.filter(f => f && f !== '') :
                                finalValue && typeof finalValue === "string" ? [finalValue] : []
                        }}
                        setFilter={(e) => {
                            this.props.handleMultiSelectFilterChange(e, this.props.title, data.map(d => typeof d === "object" ? d.value || d : d));
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
