import React from 'react'
import Dimmer from './Dimmer'
import { Content, ModalContainer } from './styles'

const Modal: React.FC<{
	withDimmer?: boolean
	children?: React.ReactNode
	close: () => void
	open: boolean
}> = ({ withDimmer, open, close, children }) => {
	return (
		<>
			{open && withDimmer && <Dimmer onClick={close} />}

			{open && (
				<ModalContainer>
					<Content>{children}</Content>
				</ModalContainer>
			)}
		</>
	)
}

export default Modal
