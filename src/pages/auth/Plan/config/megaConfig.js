import aboutConfig from "./about-config"
import guidanceConfig from "./guidance-config"
import hazardsConfig from "./hazards-config"
import landingConfig from "./landing-config"
import riskConfig from "./risk-config"
import strategiesConfig from "./strategies-config"
const URLS = {
    aboutConfig: '/plan/process',
    guidanceConfig: '/guidance',
    hazardsConfig: '/plan/hazards',
    landingConfig: '/plan/landing',
    riskConfig: '/plan/risk',
    strategiesConfig: '/plan/strategies'
}

const allConfigs =
    [
        {...aboutConfig, url: URLS["aboutConfig"]},
        {...guidanceConfig, url: URLS["guidanceConfig"]},
        {...hazardsConfig, url: URLS["hazardsConfig"]},
        {...landingConfig, url: URLS["landingConfig"]},
        {...riskConfig, url: URLS["riskConfig"]},
        {...strategiesConfig, url: URLS["strategiesConfig"]}
    ]

const megaConfig = allConfigs
    .reduce((a, c) => {
        a = [...a, ...Object.values(c)
            .filter(f => typeof f !== "string")
            .reduce((a1, c1) => {
            a1 = [...a1, ...c1.map(element => ({...element, url:c.url}))];
            return a1;
        }, [])];
        return a;
    }, [])

export default megaConfig