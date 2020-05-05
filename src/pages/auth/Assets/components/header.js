import React from "react";
import styled from "styled-components";
import geoDropdown from 'pages/auth/Plan/functions'
import config from "../../Plan/config/guidance-config";
import {Link} from "react-router-dom";
import get from "lodash.get";

const DROPDOWN = styled.div`
                    div > select {
                    color: #3E4B5B;
                    border: none;
                    background: none;
                    font-size: 0.81rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    white-space: nowrap;
                    letter-spacing: 2px;
                    padding: 0px;
                    }
                    `
export const header = (caller, geoGraph,setActiveCousubid, activeCousubid,allowedGeos) => {
    return (
        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <ul className="nav nav-tabs upper">
                <li className="nav-item"><a aria-expanded="false" className= {caller === 'assets' ? "nav-link active" : "nav-link"} data-toggle="tab"
                                            href="/assets">Assets</a></li>
                <li className="nav-item"><a aria-expanded="false" className= {caller === 'search' ? "nav-link active" : "nav-link"} data-toggle="tab"
                                            href="/assets/search">Search</a></li>
                <li>
                    {config['assets'] ?
                        <Link
                            className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded"
                            to={'/guidance/guidance-assets/view'}>?</Link>
                        : null}
                </li>
            </ul>
            <DROPDOWN>
                {
                   geoDropdown.geoDropdown(geoGraph,setActiveCousubid, activeCousubid,allowedGeos)
                }
            </DROPDOWN>
        </div>
    )
}