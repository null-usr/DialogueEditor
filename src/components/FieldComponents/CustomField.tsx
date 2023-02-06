// Field using dropdown of workspace vars

import useStore from '@/store/store'
import React, { useEffect, useState } from 'react'
import { FieldContainer } from './styles'

export const CustomField: React.FC<{
	k: string
	v: string
	index: number
	updateKey(index: number, k: string): void
	updateValue(index: number, v: any): void
	del?(k: string): void
	error?: boolean
}> = ({ k, v, index, error, updateKey, updateValue, del }) => {
	const { workspace } = useStore()
	const { w_vars } = workspace
	const [key, setKey] = useState(k)
	const [value, setValue] = useState(v)

	const [customVar, setCustomVar] = useState<string | null>(null)

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
			<select
				name="workspaceVar"
				onChange={(e) => setCustomVar(e.target.value)}
			>
				<option value="" selected disabled hidden>
					Choose workspace variable
				</option>
				{Object.keys(w_vars).map((w_var) => {
					return (
						<option key={w_var} value={w_var}>
							{w_var}
						</option>
					)
				})}
			</select>
			{customVar !== null && (
				<select
					name="option"
					onChange={(e) => {
						setValue(e.target.value)
						updateValue(index, e.target.value)
					}}
				>
					<option value="" selected disabled hidden>
						Choose option
					</option>
					{w_vars[customVar].options.map((o) => {
						return (
							<option key={o} value={o}>
								{o}
							</option>
						)
					})}
				</select>
			)}
			{k !== key && (
				<button onClick={() => updateKey(index, key)}>Save</button>
			)}
			<button onClick={del ? () => del(k) : undefined}>Delete</button>
		</FieldContainer>
	)
}
