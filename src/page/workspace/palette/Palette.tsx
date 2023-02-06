import React from 'react'
import { PaletteContainer } from './styles'

const Palette: React.FC<{}> = (props) => {
	return <PaletteContainer>{props.children}</PaletteContainer>
}

export default Palette
