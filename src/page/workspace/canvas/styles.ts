import styled from 'styled-components'

export const CanvasContainer = styled.div`
	position: relative;

	width: 100%;
	height: 100%;
`

// z index could be a param
export const AddButton = styled.button<{
	z?: number
}>`
	position: absolute;
	z-index: ${({ z }) => z || '1000'};

	left: 10px;
	top: 10px;
`
