module.exports = [
    {
        type:'municipalities', // type is same as the route path for now
        list_attributes:['community_name','initial_fhbm_date','initial_firm_date', 'is_csc', 'csc_level', 'crs_member', 'crs_entry_date','status'],
        csv_download: ['county', 'community_name', 'cid','initial_fhbm_date','initial_firm_date','current_map_date','regular_emergency_program_date','is_tribal','fips','duns','is_csc','csc_level','crs_member','crs_community_number','crs_entry_date','current_effective_date','current_class','discount_sfha','discount_non_sfha','status','nfip_standing','community_assistance_visit','community_assistance_call','current_nfip_ordinance','nfip_ordinance_adoption','nfip_administrator_name'],
        default_title: 'Municipality', // in the case when page_title is invalid
        page_title: 'community_name', // page title in edit and view
        sub_title: '', // sub title in edit and view
        sub_type:'',
        // if wizard
        sections: [],
        attributes: {
            county:{
                label:'County', // Which you would like to see on the form
                prompt:'Choose the county the capability is located from the list of all counties.',
                sub_type:'',
                edit_type:'dropdown',  
                display_type:'text',
                area:'true',
                meta: 'true',
                //hidden:'false',
                section: '',
                //field_required:"required",
            },
            community_name:{
                label:'Jurisdiction',
                prompt:'Choose the jurisdiction where the capability is located. Jurisdictions that occur are based on the County selected in question 1',
                sub_type:'',
                edit_type:'dropdown',
                defaultValue: ['Countywide'],
                display_type:'text',
                meta: 'true',
                area:'true',
                depend_on:'county',
                hidden:'false',
                section: ''
            },
            cid: {
                label:'CID',
                prompt:'Provide the community identification number for the incorporated city.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
            },
            initial_fhbm_date:{
                label:'Flood Hazard Boundary Map',
                prompt:'Provide the date the Flood Hazard Boundary Map was created.',
                sub_type:'',
                edit_type:'date',
                display_type:'text',
            },
            initial_firm_date:{
                label:'Flood Insurance Rate Map',
                prompt:'Provide the date of the communitys first Flood Insurance Rate Map',
                sub_type:'',
                edit_type:'date',
                display_type:'text',
            },
            current_map_date:{
                label:'Current Effective FIRM',
                prompt:'Provide the date of the flood insurance rate map currently in effect.',
                sub_type:'',
                edit_type:'date',
                display_type:'text',
            },
            regular_emergency_program_date:{
                label:'Regular Emergency Program Date.',
                prompt:'Provide the date (mm/dd/yyyy) the community first joind the NFIP. An "E" next to the date indicates that the community is in the Emergency Program and subject to limited coverage. If there is no "E" next to the date, then the community participates in the regular program.',
                sub_type:'',
                edit_type:'date',
                display_type:'text',
            },
            is_tribal:{
                label:'Tribal',
                prompt:'Identify with a yes or no if the participating community is a tribal nation.',
                sub_type:'',
                edit_type:'radio',
                edit_type_values:['yes','no'], // the values you would like to see as options for radio buttons
                disable_condition:'',
                display_condition:'',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
            fips:{
                label:'Federal Information Processing Standards',
                prompt:'Provide the five digit code used to identify the county.',
                sub_type:'',
                edit_type:'number',
                display_type:'text',
            },
            duns:{
                label:'Data Universial Numbering System.',
                prompt:'Provide the DUNS for the specific building or county',
                sub_type:'',
                edit_type:'number',
                display_type:'text',
            },
            is_csc:{
                label:'Is the municipality a Climate Smart Community?',
                prompt:'Identify the steps taken by the municipality to become a climate smart community',
                sub_type:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
            csc_level:{
                label:'What is the climate smart community certification level?',
                prompt:'Identify whether the community is bronze, silver or gold certified.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
            },
            crs_member:{
                label:'Community Rating System Member',
                prompt:'Community Rating System is a voulntary, incentive-based community program that recgonizes, encourages, and rewards local floodplain management activities that exceed the minimum standards of the National Flood Insurance Program.',
                sub_type:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
            crs_community_number:{
                label:'Community Rating System Community Number',
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                hidden:'false',
                section:''
            },
            crs_entry_date:{
                label:'CRS Entry Date',
                prompt:'Provide the date (mm/dd/yyy) the municipality entered the community rating system',
                sub_type:'',
                edit_type:'date',
                display_type:'text',
            },
            current_effective_date:{
                label:'CRS map currently in effect',
                prompt:'Provide the date (mm/dd/yyy) of the CRS map currently in effect.',
                sub_type:'',
                edit_type:'date',
                display_type:'text',
            },
            current_class:{
                label:'Community Rating System Class',
                prompt:'Identify the CRS rate class of your community' +
                       'There are ten CRS classes. Class one requires the most credit points and gives the greates premium discounts, and Class ten identifies a community that does not apply for the CRS, or does not obtain a minimum number of credit points and receives no discount.',  
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                meta:'false',
                hidden:'false',
                data:'true',
                section:''
            },
            discount_sfha:{
                label:'Special Flood Hazard Area Discount',
                prompt:'Based on your communities rate class, identify the percent discount propoerty owners in the SFHA receive.',
                sub_type:'',
                edit_type:'number',
                display_type:'text',
                meta:'false',
                hidden:'',
                data:'',
                section:'',
            },
            discount_non_sfha:{
                label:'Non-Special Flood Hazard Area Discount',
                prompt:'Non-SFHA are subject to discounts between five and ten percent. Provide the percent discount for property owners located in non-SFHA. ',
                sub_type:'',
                edit_type:'number',
                display_type:'text',
                meta:'false',
                hidden:'',
                data:'',
                section:'',
            },
            status:{
                label:'Status of CSC',
                prompt:'Identify the current status of the community. Either current or rescinded. If rescinded please explain why.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
            },
            nfip_standing:{
                label:'NFIP Community Standing',
                prompt:'Is the community in good NFIP standing?',
                sub_type:'',
                edit_type:'radio',
                edit_type_values:['yes','no'],
                display_type:'text',
                meta:'false',
            },
            community_assistance_visit:{
                label:'Community Assistance Visit',
                prompt:'Provide the date (mm/dd/yyyy) of the most recent Community Assistance Visit.' + 
                        'A Community Assistance Visit (CAV) is a major component of the NFIP Community Assistance Program (CAP).' +
                        'The CAV is a visit to the community by a FEMA staff member or staff member of a State agency that serves as a dual purpose of proiding technical assistance to the community and assuring the community is adequately enforcing the floodplain management regulations.', 
                sub_type:'',
                edit_type:'date',
                display_type:'text',
            },
            community_assistance_call:{
                label:'Community Assistance Call',
                prompt:'',
                sub_type:'',
                edit_type:'date',
                display_type:'text',
            },
            current_nfip_ordinance:{
                label:'NFIP Ordinance Name',
                prompt:'Identify the name of current NFIP Ordinance for the jurisdiction.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
            },
            nfip_ordinance_adoption:{
                label:'NFIP Ordinance Adoption Date',
                prompt:'Provide the date (mm/dd/yyyy) the current NFIP Ordinance was adopted.',
                sub_type:'',
                edit_type:'date',
                display_type:'text',
            },
            nfip_administrator_name:{
                label:'NFIP Administrator',
                prompt:'Identify the persons incharge of the National Flood Insurance Program.',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
            }    
        }
    }
];
