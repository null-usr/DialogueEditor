/*
    Object is a key with a react-flow handle attachable to another node
	Edge ID doesn't matter so long as the handle IDs match so it corresponds to 
	the correct handle
*/

import React, { useEffect, useRef, useState } from 'react'
import { Edge, Handle, Position, useUpdateNodeInternals } from 'reactflow'
import { types } from '@/store/reducer'
import useStore from '@/store/store'
import { FieldContainer } from './styles'

export const ObjectField: React.FC<{
	k: string
	v: string
	index: number
	id: string
	update: (index: number, v: string) => void
	// add is a function
	add: (name: string) => void
	del?: (k: string) => void
	error?: boolean
}> = ({ k, v, index, id, error, add, update, del }) => {
	const updateNodeInternals = useUpdateNodeInternals()
	const dispatch = useStore((state) => state.dispatch)

	const { edges } = useStore()
	const [yOffset, setYOffset] = useState(0)
	const [handleID, setHandleID] = useState('')
	const [value, setValue] = useState(k)

	const ref = useRef(null)

	useEffect(() => {
		if (ref.current) {
			// @ts-ignore
			setYOffset(ref.current.offsetTop + 12)
			// to force a rerender so the last handle drag and drop is
			// positioned correctly
			// add(k)
			updateNodeInternals(id)
		}
	}, [ref])

	return (
		<FieldContainer error={error} ref={ref}>
			<button onClick={del ? () => del(k) : undefined}>Delete</button>
			<input
				type="text"
				value={value}
				onChange={(e) => {
					setValue(e.target.value)
				}}
				onSubmit={() => update(index, value)}
			/>
			{value !== k && (
				<button onClick={() => update(index, value)}>Save</button>
			)}
			<Handle
				key={k}
				type="source"
				position={Position.Right}
				id={k}
				style={{
					// @ts-ignore
					top: yOffset, // function to position the handle, should be at same height as this object + centering offset
					right: 16,
					zIndex: 100,
				}}
				onContextMenu={(event) => {
					event.preventDefault()
					// remove('S', i)
					const edge: Edge<any> = edges.filter((e) => {
						return e.source === k
					})[0]

					dispatch({ type: types.deleteEdge, data: edge.id })
				}}
			/>
		</FieldContainer>
	)
}
