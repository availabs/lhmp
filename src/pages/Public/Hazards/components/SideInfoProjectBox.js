import React from 'react'

import ProjectBox from 'components/light-admin/containers/ProjectBox'

const BoxRow = ({ value, label }, i) =>
    
        <div className="col-sm"  key={ i } style={{textAlign:'center'}}>
            <div className="el-tablo highlight">
                <div className="value" style={{'font-size': 'x-large'}}>{ value.main }</div>
                <div style={{'font-size': 'small'}}>
                    {Object.keys(value.sub).map(s => <label className="label">{s} : {value.sub[s] }</label>)}
                </div>
                <div className="label" style={{'font-size': 'small'}}>{ label }</div>
            </div>
        </div>

export default ({ title, rows, content=null }) =>
    <ProjectBox title={ title } style={ {  width:'100%' } }>
        <div className="row align-items-center">
           
                { rows.length ?
                    rows.map(BoxRow)
                    : content
                }

            
        </div>
    </ProjectBox>