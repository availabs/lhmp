import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";

class PlanHeader extends React.Component {
    constructor(props) {
        super(props)

    }

    fetchFalcorDeps() {
        return this.props.falcor.get(['plans', 'county', 'byId', this.props.planId, "county"])
    }



    render() {
        return (
            <div>
                {Object.values(this.props.planCountyName).map((plan)=>{
                    return (
                    <h4 className="element-header">{plan.county.value} Hazard Mitigation Plan</h4>
                    )
                })
                }
            </div>
        )

    }

    static defaultProps = {
        planId : []
    }

}

const mapStateToProps = (state,ownProps) => {
    return {
        planId : ownProps.planId,
        planCountyName: get(state.graph, 'plans.county.byId',{})
    }
};

const mapDispatchToProps =  {
    //sendSystemMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(PlanHeader))