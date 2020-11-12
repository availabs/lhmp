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

const LOCATION_NAMES = {
    aboutConfig: 'Planning Process',
    guidanceConfig: 'Guidance',
    hazardsConfig: 'Hazards',
    landingConfig: 'Home',
    riskConfig: 'Risk',
    strategiesConfig: 'Strategies'
}

const allConfigs =
    [
        {...aboutConfig, url: URLS["aboutConfig"], pageName: LOCATION_NAMES["aboutConfig"]},
        {...guidanceConfig, url: URLS["guidanceConfig"], pageName: LOCATION_NAMES["guidanceConfig"]},
        {...hazardsConfig, url: URLS["hazardsConfig"], pageName: LOCATION_NAMES["hazardsConfig"]},
        {...landingConfig, url: URLS["landingConfig"], pageName: LOCATION_NAMES["landingConfig"]},
        {...riskConfig, url: URLS["riskConfig"], pageName: LOCATION_NAMES["riskConfig"]},
        {...strategiesConfig, url: URLS["strategiesConfig"], pageName: LOCATION_NAMES["strategiesConfig"]}
    ]

const megaConfig =
    allConfigs
        .reduce((a, c) => {
            a = [...a, ...Object.values(c)
                .filter(f => typeof f !== "string")
                .reduce((a1, c1) => {
                    a1 = [...a1, ...c1.map(element => ({...element, url: c.url, pageName: c.pageName}))];
                    return a1;
                }, [])];
            return a;
        }, [])

export default megaConfig