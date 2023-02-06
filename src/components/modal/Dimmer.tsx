import { MouseEventHandler } from 'react'
import styled from 'styled-components'

const Dimmer = styled.div<{
	zIndex?: number
}>`
	display: 'block';
	position: fixed;
	z-index: ${({ zIndex }) => zIndex || 1000};
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.4);
`

export default Dimmer
