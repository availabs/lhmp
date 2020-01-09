import React, {Component} from 'react';
import AvlFormsListTableHMP from "components/AvlForms/displayComponents/listTableHMP";
import config from "components/displayComponents/jurisdictionRepresentatives/rolesTable_config.js"

class rolesTableViewer extends Component {
    render() {
        let list_attributes = []
        for (var i = 0; i < config[0].list_attributes.length; i++){
            list_attributes.push(config[0].list_attributes[i])
        }
        return(
            <AvlFormsListTableHMP
                json = {config}
                list_attributes = {list_attributes}
            />
        )
    }
}

export default rolesTableViewer

