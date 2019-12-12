module.exports = [
    {
        type:'actions', // type is same as the route path for now
        list_attributes:['action_name','action_type','sub_type'], // to list the attributes on the main page
        // if wizard
        sections: [
            {title:'Step 1',sub_title:'Project Name',id:'1'},
            {title:'Step 2',sub_title:'Hazard of Concern',id:'2'},
            {title:'Step 3',sub_title:'Describe Solution',id:'3'},
            {title:'Step 4',sub_title:'Prioritization',id:'4'},
            {title:'Step 5',sub_title:'Alternatives',id:'5'},
            {title:'Step 6',sub_title:'Project Status',id:'6'}
        ],
        attributes: {
            county:{
                label:'County',// which you would like to see on the form
                sub_type:'worksheet',
                prompt:'',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                area : 'true',
                section: '1'
            },
            municipality:{
                label:'Municipality',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'dropdown',
                display_type:'text',
                meta: 'true',
                area:'true',
                depend_on:'county',
                section: '1'
            },
            action_name:{
                label:'Action Name',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta: 'false',
                rename_column : { name: ['action_name'] }, // Here the key for eg action_name is the name in the database and the array of values are the new names given
                section: '1'
            },
            project_number:{
                label:'Project Number',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta: 'false',
                section: '1'
            },
            hazard_of_concern: {
                label:'Hazard for concern',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta: 'false',
                section: '2'
            },
            problem_description:{
                label:'Description of the Problem',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'textarea',
                display_type:'text',
                meta: 'false',
                section: '2'
            },
            solution_description:{
                label:'Description of the Solution',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'textarea',
                display_type:'text',
                meta:'false',
                section:'3'
            },
            critical_facility:{
                label:'Is this project related to a Critical Facility? (If yes, this project must intend to protect the Critical Facility to the 500-year flood event or the actual worst damage scenario, whichever is greater.)',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                section:'3'
            },
            protection_level:{
                label:'Level of Protection',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'3'
            },
            useful_life:{
                label:'Useful for Life',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'3'
            },
            estimated_cost:{
                label:'Estimated Cost',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'3'
            },
            estimated_benefits:{
                label:'Estimated benefits(losses avoided)',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'textarea',
                display_type:'text',
                meta: 'false',
                section: '3'
            },
            priority:{
                label:'Prioritization ',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'4'
            },
            estimated_implementation_time:{
                label:'Estimated Time Required for Project Implementation',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'4'
            },
            organization_responsible:{
                label:'Responsible Organization',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'4'
            },
            desired_implementation_time:{
                label:'Desired Timeframe for Implementation',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'4'
            },
            funding_source:{
                label:'Potential funding sources',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'4'
            },
            planning_mechanism:{
                label:'Local Planning Mechanisms to be Used in Implementation, if any',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'4'
            },
            alternative_action_1:{
                label:'Alternatives',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'5'
            },
            alternative_estimated_cost_1:{
                label:'Estimated Cost',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'5'
            },
            alternative_evaluation_1:{
                label:'Evaluation',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'textarea',
                display_type:'text',
                meta: 'false',
                section: '5'
            },
            alternative_action_2:{
                label:'Alternatives',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'5'
            },
            alternative_estimated_cost_2:{
                label:'Estimated Cost',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'5'
            },
            alternative_evaluation_2:{
                label:'Evaluation',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'textarea',
                display_type:'text',
                meta: 'false',
                section: '5'
            },
            alternative_action_3:{
                label:'Alternatives',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'5'
            },
            alternative_estimated_cost_3:{
                label:'Estimated Cost',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                section:'5'
            },
            alternative_evaluation_3:{
                label:'Evaluation',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'textarea',
                display_type:'text',
                meta: 'false',
                section: '5'
            },
            date_of_report:{
                label:'Date of Status Report',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'date',
                display_type:'text',
                meta:'false',
                section:'6'
            },
            progress_report:{
                label:'Report of Progress',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'textarea',
                display_type:'text',
                meta: 'false',
                section: '6'
            },
            updated_evaluation:{
                label:'Update Evaluation of the Problem and/or Solution',
                sub_type:'worksheet',
                prompt:'',
                edit_type:'textarea',
                display_type:'text',
                meta: 'false',
                section: '6'
            }
        }
    }
];
