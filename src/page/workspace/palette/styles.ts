import styled from 'styled-components'

export const PaletteContainer = styled.div`
	// height: 100%;
	width: 300px;

	overflow-y: auto;

	display: flex;
	flex-direction: column;
	justify-content: centered;

	border-right: 1px solid #eee;
	// padding: 15px 10px;
	font-size: 12px;
	color: white;
	background: ${(props) => props.theme.bg};

	@media screen and (min-width: 768px) {
		//width: 20%;
		//max-width: 180px;
	}

	.node {
		margin-bottom: 10px;
		cursor: grab;
	}

	.description {
		margin-bottom: 10px;
	}
`

export const Group = styled.div`
	// pointer-events: none;
`
