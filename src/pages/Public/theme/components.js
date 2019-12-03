import styled from "styled-components"


export const StatementText = styled.div`
	font-size: 3em;
	font-weight: 500;
`

export const HeaderImage = styled.div`
	width: 100%;
	height: 600px;
	background-image: ${props => props.image || '/img/plans.jpg' };
`
