import React, { useEffect, useState } from 'react'
import { FieldContainer } from './styles'

export const NumberField: React.FC<{
	k: string
	v: string
	index: number
	updateKey(index: number, k: string): void
	updateValue(index: number, v: any): void
	del?(k: string): void
	error?: boolean
}> = ({ k, v, index, error, updateKey, updateValue, del }) => {
	const [key, setKey] = useState(k)
	const [value, setValue] = useState(v)

	// Forward changing values from the node details
	useEffect(() => {
		setValue(v)
	}, [v])
	return (
		<FieldContainer error={error}>
			<input
				type="text"
				value={key}
				onChange={(e) => setKey(e.target.value)}
				onSubmit={() => updateKey(index, key)}
			/>
			:
			<input
				type="number"
				value={value}
				onChange={(e) => {
					setValue(e.target.value)
					updateValue(index, e.target.value)
				}}
			/>
			{k !== key && (
				<button onClick={() => updateKey(index, key)}>Save</button>
			)}
			<button onClick={del ? () => del(k) : undefined}>Delete</button>
		</FieldContainer>
	)
}
