import React from 'react'
import { DropdownContainer, DropdownButton, DropdownContent } from './styles'

export const Dropdown: React.FC<{ label: string }> = ({ label, ...props }) => {
	return (
		<DropdownContainer>
			<DropdownButton>{label}</DropdownButton>
			<DropdownContent>{props.children}</DropdownContent>
		</DropdownContainer>
	)
}
