import styled from 'styled-components'

export const FieldContainer = styled.div<{ error?: boolean }>`
	display: flex;
	flex-direction: row;
	${({ error }) => (error ? 'border: 1px solid red;' : '')}
`
