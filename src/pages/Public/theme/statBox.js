import React, { Component } from 'react';

import get from 'lodash.get'
import styled from "styled-components"


class StatBox extends React.Component {
   
    render(){
        return(
          <div style={ { height: "100%", position: "relative" } }>
            <div className='el-tablo' style={{padding: "10px", position: "relative"}}>

                <div className='title' style={{fontSize: '1.2em', textAlign: 'center'}}>
                    {this.props.title}
                </div>
                <div className='value' style={{ textAlign: 'center', display: 'block'}}>
                    {this.props.valuePrefix}
                    {this.props.value}
                    {this.props.valueSuffix}
                </div>
               
            </div>
          </div>
        )

    }

}

export default StatBox
