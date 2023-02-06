import styled from 'styled-components'

export const ModalContainer = styled.div<{
	zIndex?: number
}>`
	z-index: ${({ zIndex }) => zIndex || 1001};

	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: white;
	border-radius: 5px;
`

export const Content = styled.div<{}>`
	// display: grid;
	// justify-content: center;
	// align-content: center;

	padding: 16px;
`
