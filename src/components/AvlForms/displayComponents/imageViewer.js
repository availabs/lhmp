import React from 'react'
import AvatarEditor from "../editComponents/imageComponent/AvatarEditor";
import get from "lodash.get";
import {HeaderImageContainer} from "../../../pages/Public/theme/components";
import {connect} from "react-redux";
import {reduxFalcor} from "../../../utils/redux-falcor";

class imageViewer extends React.Component {
    constructor(props) {
        super(props);
        //authGeoid(this.props.user);
        this.state = {
            geoid: this.props.geoid,
            image: ' '
        }

        this.getCurrentImageKey = this.getCurrentImageKey.bind(this)
    }

    getCurrentImageKey = (requirement) =>
        this.props.scope === 'global' ?
            requirement :
            requirement + '-' + this.props.user.activePlan + '-' + this.props.user.activeCousubid

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activeCousubid !== this.props.activeCousubid ||
            prevProps.hazard !== this.props.hazard ||
            prevProps.planId !== this.props.planId ||
            prevProps.geoid !== this.props.geoid
        ){
            this.fetchFalcorDeps()
        }
    }
    fetchFalcorDeps(geoid, geoLevel, dataType) {
        if (!geoid) geoid = this.props.geoid;
        let contentIdImage =  this.getCurrentImageKey(this.props.requirement);
        return this.props.falcor.get(
            ['content', 'byId', [contentIdImage], ['body']]
        ).then(contentRes => {
            this.setState({
                image: get(contentRes, `json.content.byId.${contentIdImage}.body`, null),
            })
        })

    }


    render() {
        return (
            <div>
                {this.state.image ?  <HeaderImageContainer img={this.state.image}/> : null}
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        activePlan: state.user.activePlan,
        activeGeoid: ownProps.geoId ? ownProps.geoId : state.user.activeGeoid,
        activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid,
        graph : state.graph

    }
};

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(imageViewer));