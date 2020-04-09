
module.exports = [
    {
        type:'action_status_update', // type is same as the route path for now
        list_attributes:['action_name','action_type'], // to list the attributes on the main page
        // if wizard
        sections: [
            {title:'Step 1',sub_title:'Point of Contact',id:'1'},
            
        ],
        attributes: {
           
            action_name:{
                label:'Action Name',
                prompt:'Provide a name for the action. Be as concise and specific as possible.',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'1',
                list_attribute: 'true'
            },
            // new_or_update:{
            //     label:'New or Update',
            //     sub_type:'project',
            //     prompt:'Choose one. Select update if you are entering an action from a previous plan.' +
            //         ' Select new only if you are entering a new action during the hazard mitigation planning process.',
            //     edit_type:'radio',
            //     edit_type_values:['new','update'],
            //     display_condition:'',
            //     display_type:'text',
            //     meta:'false',
            //     section:'1'
            // },
            status:{
                label:'Update Status',
                sub_type:'project',
                prompt:'Select the current status of the project: discontinued, completed, in-progress, unchanged, proposed.',
                edit_type:'dropdown_no_meta',
                edit_type_values : ['discontinued','Completed','In-progress','unchanged','Proposed'],
                // disable_condition:{attribute:'new_or_update',check:'update'},// check is when you want to show this
                display_condition : '',
                display_type:'text',
                meta:'false',
                section:'1'
            },
            status_justification:{
                label:'Status Justification',
                sub_type:'project',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['Lack of Funding','Funding Change','Env. / Hist. Preservation','Staffing','Public Support','Legal','Fixed or Otherwise Mitigated','Priority Change'],
                disable_condition : '',
                display_condition:{attribute:'status',check:['discontinued','unchanged']},
                display_type:'text',
                meta:'false',
                section:'1'
            },
            plan_maintenance_update_evaluation_of_problem_solution:{
                label:'Update Evaluation of the Problem and/or Solution',
                sub_type:'project',
                prompt:'Provide an updated description of the problem and solution, and what has' +
                    ' happened since initial consideration/development.',
                edit_type:'dropdown',
                // disable_condition:{attribute:'new_or_update',check:'update'},
                display_type:'text',
                meta_filter:{filter_key:'capabilities',value:'category'},
                meta:'true',
                section:'1'
            },
            phased_action:{ // TODO why is the state same as above and Status update radio is disabled
                //disabled={this.state.new_or_update !== 'update'}
                label:'Phased Action',
                sub_type:'project',
                prompt:'Will the action be implemented in phases? Types of phases include: planning, designing, and constructing..',
                edit_type:'dropdown_no_meta',
                edit_type_values:['Not a Phased Project','Phased_planning','Phased-Design','Phased-Construction'],
                // disable_condition:{attribute:'new_or_update',check:'update'},
                display_type:'text',
                meta:'true',
                section:'1'
            },
            name_of_associated_hazard_mitigation_plan:{
                label:'Name of Associated Hazard Mitigation Plan',
                sub_type:'project',
                prompt:'Provide the official name of the adopted hazard mitigation plan.',
                edit_type:'dropdown',
                disable_condition:'',
                meta_filter:{filter_key:'capabilities',value:'category'},
                display_type:'text',
                meta:'true',
                section:'1'
            },
        }

    }
];
