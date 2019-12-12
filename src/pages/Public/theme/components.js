import styled from "styled-components"

export const backgroundColor =   '#d1dbe9';//'#efefef';// '#d1dbe9' // '#b3c3db' //'#6787b7';
export const mainFontColor  = '#3E4B5B'
export const mainFontSize = '1.4em';
export const mainFontWeight = '400';
export const mainFontLineHeight = '2'
export const mainFontFamily = `'Roboto', sans-serif`//'"Avenir Next W01", "Proxima Nova W01", "Rubik", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

export const ImageContainer = styled.div`
    background: #fafafa;
    background-image: url(${props => props.image || '/img/sullivan2.jpg'});
    background-size: 100vw 100vh;
    background-attachment: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    zIndex: 2;
    top: 0px;
    left: 0px;
    height: 100vh;
    width: 100vw
`

export const StatementText = styled.div`
	font-size: 3rem;
	font-weight: 500;
	padding: 120px;
`

export const HeaderImage = styled.div`
	width: 100%;
	height: 600px;
	background: no-repeat url("${props => props.image || '/img/planning.jpg' }");
	background-size: cover;
	display: flex;
	flex-direction: column;
	align-content: center;
	justify-content: center;
`

export const HeroContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    height: 200px;
`
export const HeroBox = styled.div`
     color: rgb(239, 239, 239); 
     background: rgba(62, 75, 91, 1); 
     border-radius: 4px;
     height: 150px;
     width: 20vw;
     overflow: auto;
     margin-left: 10px;
     margin-right: 10px;
     padding: 5px;
     ${props => props.theme.modalScrollBar}
`

export const PageContainer = styled.div`
	width: 100%;
	height: 100%;
	background: ${backgroundColor};
	padding-top: 75px;
	color: ${mainFontColor};
	padding-bottom: 50px;
	
`
export const PageHeader = styled.h4`
	padding-top: 50px;
	text-transform: uppercase;
`

export const SectionHeader = styled.h2`
	padding-top: 50px;

	text-transform: uppercase;
`
export const ContentContainer = styled.div`
	margin: 0 auto;
    max-width: 1100px;
`

export const HeaderContainer = styled.div`
	margin: 0 auto;
    max-width: 1340px;
`

export const ContentHeader = styled.h3`
	padding-top: 50px;
`

export const SectionBox = styled.div`
	font-size: ${mainFontSize};
	line-height: ${mainFontLineHeight};
	font-weight: ${mainFontWeight};
	font-family: ${mainFontFamily};
	display: flex	
`
export const SectionBoxMain = styled.div`
	flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    min-width: 0;
`
export const SectionBoxSidebar = styled.div`
	display:none;
   @media (min-width: 880px)
 	{
 	display: flex;
 	flex-direction: column;
 	align-content: center;
 	justify-content: center;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 300px;
    min-width: 0;
	}
`
export const SidebarCallout = styled.div`
	font-size: 1.5em;
	line-height: 1.3;
	font-weight: 700;
	font-style: italic;
	padding: 30px

`
export const FeatureBox = styled.div`
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    text-align: center;
    padding-bottom: 20px;
    background-color: #f9f9f9;
    transition: all 0.2s ease;
`

export const Feature = styled.div`
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    text-align: center;
    padding-bottom: 20px;
    background-color: #f9f9f9;
    transition: all 0.2s ease;
    margin-top: ${props => props.highlight ? '-20px' :  '0px'}
    margin-bottom:  ${props => props.highlight ? '-20px' :  '0px'}
    position:  ${props => props.highlight ? 'relative' :  ''}
    z-index: 2;
    box-shadow:  ${props => props.highlight ? '0 2px 30px 0 rgba(54, 88, 206, 0.2);' :  'none'}
`

export const FeatureDescription = styled.div`
    text-align: left;
    padding: 30px 15%;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.5);
`
export const FeatureName = styled.div`
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 1.5rem;
    color: ${mainFontColor};
    font-weight: 500;
    padding-bottom: 40px;
    transition: all 0.2s ease;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`
export const FeatureImage = styled.div`
    
    img {
        width: 80px;
        vertical-align: middle;
        border-style: none;
    }
`
export const FeatureHeader = styled.div`    
    background-color: ${backgroundColor};
    padding-top: 40px;
    
    
`
export const TwoPaneContainer = styled.div`
    display: flex;
`

export const VerticalAlign = styled.div`
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    height: 100%;

`