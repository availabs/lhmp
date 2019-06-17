import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { createMatchSelector } from 'react-router-redux';
import { falcorGraph } from "store/falcorGraph"
//import LandingNav from './components/LandingNav'

//import { signup } from 'store/modules/user';
import {sendSystemMessage} from 'store/modules/messages';

import 'pages/Landing/Login.css'

class Signup extends Component {
  constructor(props){
      super(props)
          this.state = {
              activeStep: 0,
              }
      this.handleChange = this.handleChange.bind(this)
      this._next = this._next.bind(this)
      this._prev = this._prev.bind(this)
      this.nextButton = this.nextButton.bind(this)
      this.previousButton = this.previousButton.bind(this)
      this.submitButton = this.submitButton.bind(this)
      this.setStep = this.setStep.bind(this)
  }



  handleChange(event) {
    const id = event.target.id;
    const value = event.target.value;
    this.setState({
      [id]: value
    });
  };


  _next() {
        let currentStep = this.state.activeStep
        let start = this.props.steps.length - 2
        let end = this.props.steps.length - 1
        currentStep = currentStep >= start? end: currentStep + 1
        this.setState({
            activeStep: currentStep
        })
  }
  _prev() {
        let currentStep = this.state.activeStep
        currentStep = currentStep <= 0? 1: currentStep - 1
        this.setState({
            activeStep: currentStep
        })
    }

  setStep(step) {
          if(this.state.activeStep !== step) {
              this.setState({activeStep: step})
          }
  }

  previousButton(){
    let currentStep = this.state.activeStep;
    if(currentStep !==0){
        return (
            <a className="btn btn-primary step-trigger-btn" href = {'#'} onClick = {this._prev}> Previous</a>
        )
    }
    return null;
  }

  nextButton(){
    let currentStep = this.state.activeStep;
    let endStep = this.props.steps.length-1
    if(currentStep !== endStep){
        return (
            <a className="btn btn-primary step-trigger-btn" href ={'#'} onClick = {this._next}> Continue</a>
        )
    }
    return null;
  }

  submitButton(){
      let currentStep = this.state.activeStep;
      let endStep = this.props.steps.length
      if(currentStep === endStep-1){
          return(
              <button class="btn btn-primary step-trigger-btn" href ={'#'}> Submit</button>
          )
      }
      return null
  }
  onSubmit(event){
      event.preventDefault();
      let args = []
      this.props.steps.map(step =>{
          Object.values(step.content._self.state).forEach(function(step_content){
                  args.push(step_content)

          })
      })
      args = args.filter (function (value, index, array) {
        return array.indexOf (value) === index;
      });
      console.log('args',args)
      return falcorGraph.call(['actions', 'worksheet','insert'], args, [], [])
          .then(response => {
              console.log('response',response)
              this.props.sendSystemMessage(`Action worksheet was successfully created.`, { type: "success" });
          })




  }



  render () {
    return (
      <div className="element-box">
                <form onSubmit={this.onSubmit.bind(this)}>
                    <div className="steps-w">
                        <div className="step-triggers">
                            {
                                this.props.steps.map((step,i) => {
                                    return (
                                        <a
                                            href={'#'}
                                            onClick={this.setStep.bind(this,i)}
                                            className={`step-trigger ${i <= this.state.activeStep ? 'complete' : ''} ${i === this.state.activeStep ? 'active' : ''}`} >{step.title}</a>
                                    )
                                })
                            }
                        </div>
                        <div className="step-contents">
                            {this.props.steps[this.state.activeStep].content}
                        </div>
                        <div class="form-buttons-w text-right">
                            {this.previousButton()}{this.nextButton()}
                            {this.submitButton()}
                        </div>
                    </div>
                </form>
            </div>

    )
  }
}

const mapDispatchToProps = {
    sendSystemMessage
};

const mapStateToProps = state => {
  return {
    isAuthenticated: !!state.user.authed,
    attempts: state.user.attempts // so componentWillReceiveProps will get called.
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
