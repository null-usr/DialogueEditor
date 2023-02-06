import styled from 'styled-components'

export const Container = styled.div<{
	zIndex?: number
}>`
	display: flex;
	flex-direction: column;

	background-color: white;

	width: 50vw;
	height: 50vh;
`
