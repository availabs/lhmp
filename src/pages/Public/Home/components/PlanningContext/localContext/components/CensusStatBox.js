import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";

import get from 'lodash.get'
import styled from "styled-components"

const YearDiv = styled.div`
  position: ${ props => props.position === "block" ? "static" : "absolute" };
  text-align: ${ props => props.position === "block" ? "center" : "left" };
  bottom: ${ props => props.position.includes("bottom") ? "10px" : "auto" };
  left: ${ props => props.position.includes("left") ? "20px" : "auto" };
  right: ${ props => props.position.includes("right") ? "20px" : "auto" };
`

class CensusStatBox extends React.Component {
    fetchFalcorDeps(){
        console.log('getting stuff', this.props.geoids, this.props.years,)
        if( this.props.geoids.includes(NaN)) {
          return Promise.resolve({})
        }
        return this.props.falcor.get(
          ['acs', this.props.geoids, this.props.years,
            [...this.props.censusKeys, ...this.props.divisorKeys]
          ]
        )
    }

    calculateValues(){
      let value = this.props.geoids.reduce((a, c) =>
        a + this.props.censusKeys.reduce((aa, cc) =>
          aa + get(this.props.graph, ["acs", c, this.props.year, cc], 0)
        , 0)
      , 0)

        // let value = this.props.geoids
        //     .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.year}.${this.props.censusKey}`, 0))
        //     .reduce((a,b) => a + b )

        if(this.props.sumType === 'avg') {
            value /= this.props.geoids.length
        } else if (this.props.sumType === 'pct') {
            // let divisorValue = this.props.geoids
            // .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.year}.${this.props.divisorKey}`, 0))
            // .reduce((a,b) => a + b )
              let divisorValue = this.props.geoids.reduce((a, c) =>
                a + this.props.divisorKeys.reduce((aa, cc) =>
                  aa + get(this.props.graph, ["acs", c, this.props.year, cc], 0)
                , 0)
              , 0)

            // console.log('calculateValues', value, divisorValue, value / divisorValue * 100)
            value /= divisorValue
            value *= 100
        }

        // console.log('got the value', value)
        if(!value) {
            return {value: '', change: ''}
        }

        let change = 0
        // console.log('compareYear', this.props.compareYear)

        if(this.props.compareYear) {
          let compareValue = this.props.geoids.reduce((a, c) =>
            a + this.props.censusKeys.reduce((aa, cc) =>
              aa + get(this.props.graph, ["acs", c, this.props.compareYear, cc], 0)
            , 0)
          , 0)
            // let compareValue = this.props.geoids
            //     .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.compareYear}.${this.props.censusKey}`, 0))
            //     .reduce((a,b) => a + b )

            if (this.props.sumType === 'pct') {
                // let divisorValue = this.props.geoids
                //   .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.year}.${this.props.divisorKey}`, 0))
                //   .reduce((a,b) => a + b )
                  let divisorValue = this.props.geoids.reduce((a, c) =>
                    a + this.props.divisorKeys.reduce((aa, cc) =>
                      aa + get(this.props.graph, ["acs", c, this.props.year, cc], 0)
                    , 0)
                  , 0)

                // console.log('calculateValues', value, divisorValue, value / divisorValue * 100)
                compareValue /= divisorValue
                compareValue *= 100
            }



            change = (((value - compareValue) / compareValue) * 100)
            // console.log('comparevalue', this.props.compareYear)

            change = isNaN(change) ? '' : change.toFixed(2)
        }

        return {
            value,
            change
        }
    }

    render(){
        const displayData = this.calculateValues(),
          growthColors = [this.props.increaseColor, this.props.decreaseColor];
        this.props.invertColors && growthColors.reverse();
        const growthColor = displayData.change ? growthColors[displayData.change >= 0 ? 0 : 1] : "currentColor";
        return(
          <div style={ { height: "100%", position: "relative" } }>
            <div className='el-tablo' style={{padding: "10px", position: "relative"}}>

                <div className='title' style={{fontSize: '1.2em', textAlign: 'center'}}>
                    {this.props.title}
                </div>
                <div className='value' style={{ textAlign: 'center', display: 'block', color: growthColor}}>
                    {this.props.valuePrefix}
                    {displayData.value.toLocaleString('en-us',{maximumFractionDigits: this.props.maximumFractionDigits})}
                    {this.props.valueSuffix}
                </div>
                {this.props.compareYear &&
                    <div style={{ textAlign: 'center', color: growthColor}}>
                        {Math.abs(displayData.change)}% {displayData.change >= 0 ? 'Growth' : 'Decline'}
                    </div>
                 }
            </div>
            { this.props.compareYear && (this.props.yearPosition !== "none") &&
              <YearDiv position={ this.props.yearPosition }>
                 <b>{ this.props.year }</b> vs <b>{ this.props.compareYear }</b>
              </YearDiv>
            }
          </div>
        )

    }

    static defaultProps = {
        censusKeys: [],
        geoids: [],
        years: [2017],
        year:'2017',
        compareYear: null,
        maximumFractionDigits: 0,
        divisorKeys: [],
        yearPosition: "bottom-left",
        increaseColor: "#090",
        decreaseColor: "#900",
        invertColors: false
    }
}

const mapDispatchToProps = { };

const mapStateToProps = (state) => {
    return {
        graph: state.graph // so componentWillReceiveProps will get called.
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusStatBox))
