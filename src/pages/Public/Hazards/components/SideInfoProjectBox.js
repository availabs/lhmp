import React from 'react'

import ProjectBox from 'components/light-admin/containers/ProjectBox'

const BoxRow = ({ value, label }, i) =>
    <div className="row" key={ i }>
        <div className="col-12" style={{textAlign:'center', paddingBottom: 30}}>
            <div className="el-tablo highlight">
                <div className="value" style={{'font-size': 'x-large'}}>{ value.main }</div>
                <div style={{'font-size': 'small'}}>
                    {Object.keys(value.sub).map(s => <label className="label">{s} : {value.sub[s] }</label>)}
                </div>
                <div className="label" style={{'font-size': 'small'}}>{ label }</div>
            </div>
        </div>
    </div>

export default ({ title, rows, content=null }) =>
    <ProjectBox title={ title } style={ {  width:'100%' } }>
        <div className="row align-items-center">
            <div className="col-12">

                { rows.length ?
                    rows.map(BoxRow)
                    : content
                }

            </div>
        </div>
    </ProjectBox>