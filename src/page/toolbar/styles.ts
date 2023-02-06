import styled from 'styled-components'

export const HeaderContainer = styled.div<{
	background?: string
}>`
	// width: 100%;
	background: ${({ background }) => background || 'grey'};
	color: white;
	padding: 10px 20px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`
export const LeftButtonGroup = styled.div<{}>`
	display: flex;
	flex-direction: row;
	gap: 10px;

	* {
		cursor: pointer;
	}
`

export const RightButtonGroup = styled.div<{}>`
	display: flex;
	flex-direction: row-reverse;
	gap: 10px;

	* {
		cursor: pointer;
	}
`
