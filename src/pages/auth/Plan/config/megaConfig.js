import aboutConfig from "./about-config"
import guidanceConfig from "./guidance-config"
import hazardsConfig from "./hazards-config"
import landingConfig from "./landing-config"
import riskConfig from "./risk-config"
import strategiesConfig from "./strategies-config"

const megaConfig = [aboutConfig, guidanceConfig, hazardsConfig, landingConfig, riskConfig, strategiesConfig]
    .reduce((a, c) => {
        a = [...a, ...Object.values(c).reduce((a1, c1) => {
            a1 = [...a1, ...c1];
            return a1;
        }, [])];
        return a;
    }, [])

export default megaConfig