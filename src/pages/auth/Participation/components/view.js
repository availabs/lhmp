import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get"
import Element from 'components/light-admin/containers/Element'
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick";

const ATTRIBUTES = [
       'id',
       'type', 
       'plan_id', 
       'owner_id', 
       'start_date', 
       'end_date', 
       'hours', 
       'users', 
       'roles'
]

class ParticipationIndex extends React.Component {

    constructor(props){
        super(props)
        this.participationViewTable = this.participationViewTable.bind(this)

    }

    fetchFalcorDeps() {
        return this.props.falcor.get(['participation','byId',[this.props.match.params.Id],ATTRIBUTES])
            .then(response => {
                console.log('response',response)
                return response

            })
    }

    participationViewTable(){
        let table_data = [];
        let data = [];
        if(this.props.participationViewData[this.props.match.params.Id] !== undefined){
            let graph = this.props.participationViewData[this.props.match.params.Id];

          console.log('graph of participationViewTable', graph)

            data.push(pick(graph,...ATTRIBUTES));

         console.log('data of participationViewTable', data)
         

            data.forEach(item =>{
                Object.keys(item).forEach(i =>{
               
                        table_data.push({
                            attribute : i,
                            value: item[i].value
                        })
                /*    }*/

                })
            })
        }  

        console.log('table_data', table_data)


        return (
            <div className='container'>
                <Element>
                    <h6 className="element-header">Participation View</h6>
                    <div className="element-box">
                        <div className="table-responsive" >

                       

                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    <th>ATTRIBUTE</th>
                                    <th>VALUE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    table_data.map(data =>{
                                        return(
                                            <tr>
                                                <td>{data.attribute}</td>
                                                <td>{data.value}</td>
                                            </tr>
                                        )
                                    })

                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Element>
            </div>

        )
    }

    render() {
        //this.fetchFalcorDeps()
        return(
            <div>
                {this.participationViewTable()}
            </div>

        )

    }
}

const mapStateToProps = state => ({
    isAuthenticated: !!state.user.authed,
    attempts: state.user.attempts, // so componentWillReceiveProps will get called.
    participationViewData : get(state.graph,['participation','byId'],{})
});


const mapDispatchToProps = {
    sendSystemMessage
};


export default [
    {
        path: '/participation/view/:Id',
        exact: true,
        name: 'Participation',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Participation', path: '/participation/' },
            { param: 'Id', path: '/participation/view/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ParticipationIndex))
    }
]
