/*
    Object would just be a react-flow handle to another node
*/

import React, { useState } from 'react'
import { FieldContainer } from './styles'

export const TextField: React.FC<{
	k: string
	v: string
	index: number
	updateField(index: number, k: string, v: string): void
	del?(k: string): void
}> = ({ k, v, index, updateField, del }) => {
	return (
		<FieldContainer>
			<input
				type="text"
				value={k}
				onChange={(e) => updateField(index, e.target.value, v)}
			/>
			:
			<textarea
				value={v}
				onChange={(e) => updateField(index, k, e.target.value)}
			/>
			<button onClick={del ? () => del(k) : undefined}>Delete</button>
		</FieldContainer>
	)
}