import styled from 'styled-components'

export const DropdownContent = styled.div<{ z?: number }>`
	display: none;
	position: absolute;
	background-color: #f9f9f9;
	min-width: 160px;
	box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
	z-index: ${({ z }) => z || 1};

	*:hover {
		background-color: #f1f1f1;
	}
`

export const DropdownButton = styled.button`
	background-color: #4caf50;
	color: white;
	padding: 5px;
	border: none;
	cursor: pointer;
`

export const DropdownContainer = styled.div`
	position: relative;
	display: inline-block;

	&:hover {
		${DropdownButton} {
			background-color: #3e8e41;
		}

		${DropdownContent} {
			display: flex;
			flex-direction: column;
		}
	}
`
