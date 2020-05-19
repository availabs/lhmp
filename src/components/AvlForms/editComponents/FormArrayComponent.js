import React from 'react'
import _ from 'lodash'
import get from 'lodash.get'
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import AvlFormsNewDataWizard from 'components/AvlForms/editComponents/newDataWithWizard'
import AvlFormsNewData from 'components/AvlForms/editComponents/newData'
import listNewComp from 'components/AvlForms/editComponents/formTypeToConfig.js'


class FormArrayComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            renderNewComp: false,
            result: this.props.state[this.props.title]
        }
        this.addButton = this.addButton.bind(this)
        this.cancelButton = this.cancelButton.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.addResult = this.addResult.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.state.result, prevState.result)) {
            this.props.handleChange({target: {id: this.props.title, value: this.state.result}})
        }
    }

    handleClick() {
        this.setState({renderNewComp: !this.state.renderNewComp})
    }

    addButton() {
        return (
            <a className='button mr-2 mb-2 btn btn-outline-primary btn-rounded'
               onClick={this.handleClick}
               href={'#'}
            >Add {this.props.addText} +</a>
        )
    }

    cancelButton() {
        return (
            <a className='button mr-2 mb-2 btn btn-outline-danger btn-rounded'
               onClick={this.handleClick}
               href={'#'}
            >Cancel x</a>
        )
    }

    addResult(id) {
        this.setState({result: [...this.state.result, id]})
    }

    render() {
        //console.log('check',this.props.state[this.props.title].slice(1,-1).split(",") || [])
        let colummMapping = Object.keys(this.props.state).reduce((a, c) => {
            if (Object.keys(get(this.props, `columnMap`, {})).includes(c)) {
                a[c] = this.props.state[c];
            }
            return a;
        }, {})
        let Component =
            get(listNewComp, `${this.props.formType}[0].sections`, []).length ? AvlFormsNewDataWizard : AvlFormsNewData
        return (
            <div>
                {this.state.renderNewComp ? this.cancelButton() : this.addButton()}
                <div style={{display: this.state.renderNewComp ? 'block' : 'none'}}>
                    <Component
                        json={listNewComp[this.props.formType]}
                        id={[]}
                        returnValue={this.addResult}
                        state={colummMapping}
                    />
                </div>
                <div>
                    Current ids: {this.state.result.join()}
                    {this.state.result.map(id =>{
                        return(
                            <div>
                                <AvlFormsViewData
                                    json={listNewComp[this.props.formType]}
                                    id={[id]}
                                    showHeader={false}
                                />
                            </div>
                        )
                    }
                        )
                    }
                </div>
            </div>
        )
    }

}

export default FormArrayComponent;