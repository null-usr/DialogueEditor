import styled from 'styled-components'

export const NodeHeader = styled.div<{
	color?: string
}>`
	min-height: 32px;
	background-color: ${({ color }) => color || 'white'};
`

export const Container = styled.div`
	display: flex;
	flex-direction: column;
`
export const ButtonRow = styled.div`
	display: flex;
	justify-content: center;
	gap: 8px;
`
