import React, {Component} from 'react';
// import { Link } from 'react-router-dom'
import AvlMap from 'components/AvlMap'
import Element from 'components/light-admin/containers/Element'
import { connect } from 'react-redux';
import reduxFalcor from "utils/redux-falcor";
import styled from "styled-components";
import backgroundImg from 'img/public_home_background.png'

const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
let backgroundCss = {
    background: '#fafafa',
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: '100vw 100vh',
    backgroundAttachment: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    position: 'relative',
    zIndex:'2',
    top: '0px',
    left: '0px'
};
const HEADER = styled.div`
    margin-bottom: 0.5rem;
    color: rgb(239, 239, 239);
    font-size: 2rem;
    font-weight: 700;
    font-size: 40px;
    font-family: "Proxima Nova W01";
    line-height: 0.9;
    text-shadow: rgb(68, 68, 102) -1px -1px 0px, rgb(68, 68, 102) 1px -1px 0px, rgb(68, 68, 102) -1px 1px 0px, rgb(68, 68, 102) 1px 1px 0px;
    text-align: center;
`
const FLEXBOX = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 70vw;
    height: 200px;
`
const BOX = styled.div`
     color: rgb(239, 239, 239); 
     background: rgba(0, 0, 0, 0.7); 
     border-radius: 4px;
     height: 150px;
     width: 20vw;
     overflow: auto;
     margin-left: 10px;
     margin-right: 10px;
     padding: 5px;
     ${props => props.theme.modalScrollBar}
`

const LABEL = styled.div`
    color: rgb(239, 239, 239);
    display: block;
    font-size: 1rem;
    font-weight: 500;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 1px;
`
class Introduction extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
        };
    }
    render() {
        return (
            <div style={{...backgroundCss, width:'100vw', height:'100vh'}}>
                <div style={{width:'70vw'}}>
                    <HEADER>
                        We should do mitigation because we have $12,312,312 and 2,001 people at risk in the floodplain.
                    </HEADER>
                    <FLEXBOX className='flex-container'>
                        <BOX>
                            <LABEL>Context</LABEL>
                            <div className=''>
                                {loremIpsum.substring(0,100)}
                            </div>
                        </BOX>
                        <BOX>
                            <LABEL>Risks</LABEL>
                            <div className=''>
                                {loremIpsum.substring(100,250)}
                            </div>
                        </BOX>
                        <BOX>
                            <LABEL>Strategies</LABEL>
                            <div className=''>
                                {loremIpsum.substring(200,250)}
                            </div>
                        </BOX>
                    </FLEXBOX>
                </div>
            </div>
        )
    }
}

export default Introduction