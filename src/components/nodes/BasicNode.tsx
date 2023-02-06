import React, { useState, useEffect, createRef, useMemo } from 'react'
import {
	Handle,
	Position,
	NodeProps,
	Connection,
	Edge,
	XYPosition,
	useUpdateNodeInternals,
} from 'reactflow'

import { v4 as uuidv4 } from 'uuid'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import { Node } from '@/helpers/theme'
import { Field } from '@/helpers/types'
import { SerializeNode } from '@/helpers/serialization/serialization'
import { getOutgoingEdges } from '@/helpers/edgeHelpers'
import { StringField } from '../FieldComponents/StringField'
import { BooleanField } from '../FieldComponents/BooleanField'
import { NumberField } from '../FieldComponents/NumberField'
import { ObjectField } from '../FieldComponents/ObjectField'
import { NodeHeader, ButtonRow, Container } from './styles'
import { CustomField } from '../FieldComponents/CustomField'

// class to help create basic nodes
export class BasicNode {
	id: string
	color: string
	name: string
	fields: Field[]
	data: { name: string; color: string; fields?: Field[]; type: string } = {
		name: '',
		color: '',
		type: 'basic',
	}

	nodeData: any
	type: string

	sourcePosition: Position
	targetPosition: Position
	position: XYPosition

	constructor(
		name: string,
		x: number,
		y: number,
		id?: string,
		data?: Field[],
		color?: string,
		TB?: boolean
	) {
		this.id = id || uuidv4()
		this.position = { x, y }
		this.fields = data || []
		this.type = 'base'
		this.name = name
		this.color = color || '#FFFFFF'
		this.nodeData = createRef()
		this._set_data()

		if (TB) {
			this.sourcePosition = Position.Bottom
			this.targetPosition = Position.Top
		} else {
			this.sourcePosition = Position.Right
			this.targetPosition = Position.Left
		}
	}

	private _set_data() {
		this.data = {
			color: this.color,
			name: this.name,
			fields: this.fields,
			type: 'base',
		}
	}

	// here we look into our component and grab all the data we need
	public serialize = (): {
		[id: string]: {
			[key: string]: [value: string]
		}
	} => {
		if (this.nodeData.current) {
			const data = this.nodeData.current.getNodeData()
			const output: any = {}
			output[this.id] = {}
			data.forEach((element: Field) => {
				output[this.id][element.key] = element.value
			})
			return output
		}
		return {}
	}
}

// example function
export function CreateDialogueNode(x: number, y: number) {
	return new BasicNode('Dialogue Node', x, y, undefined, [
		{
			key: 'characterName',
			type: 'string',
			value: '',
		},
		{
			key: 'dialogue',
			type: 'text',
			value: '',
		},
	])
}

// https://www.carlrippon.com/react-forwardref-typescript/
// https://stackoverflow.com/questions/37949981/call-child-method-from-parent
// need to do a check that all the keys are unique
export default ({
	id,
	data,
	isConnectable,
	selected,
}: NodeProps<{ name: string; color: string; fields: Field[] }>) => {
	const { edges, workspace, updateNodeColor, updateNodeName } = useStore()

	const [fields, setFields] = useState<Field[]>(data.fields || [])
	const [count, setCount] = useState(fields.length)
	const [sourceArray, setSourceArray] = useState<any[]>(
		data.fields.filter((f) => f.type === 'data').map((f) => f.value) || []
	)
	const [expanded, setExpanded] = useState(true)

	// when updating handles programmatically, this is needed
	const updateNodeInternals = useUpdateNodeInternals()
	const dispatch = useStore((store) => store.dispatch)

	const [errors, setErrors] = useState<{ [key: number]: boolean }>({})

	// ideally this would use a reference to get the position (offsetTop)
	const positionHandle = (index: number) => {
		return 104 + 22 * index
	}

	const addHandle = (key: string) => {
		if (sourceArray.length < 10) {
			setSourceArray([...sourceArray, key])
		}
	}

	const addField = (type: string) => {
		let value
		if (type === 'string') {
			value = `value ${count}`
		} else if (type === 'number') {
			value = 0
		} else if (type === 'data') {
			// We create a handle with a key of key:{count}
			value = `value ${count}`
			addHandle(`key:${count}`)
			setFields([...data.fields, { key: `key:${count}`, value, type }])
			data.fields = [...data.fields, { key: `key:${count}`, value, type }]
			setCount(count + 1)
			return
		} else {
			value = false
		}

		setFields([...data.fields, { key: `key: ${count}`, value, type }])
		data.fields = [...data.fields, { key: `key: ${count}`, value, type }]

		setCount(count + 1)
	}

	const updateKey = (index: number, k: string) => {
		const indices: number[] = []
		data.fields.forEach((f, i) => f.key === k && indices.push(i))
		if (indices.length > 0) {
			console.log('duplicate keys, highlight')

			const ers = {}
			// @ts-ignore
			ers[index] = true
			indices.forEach((i) => {
				// @ts-ignore
				ers[i] = true
			})

			setErrors(ers)
			return
		}

		setErrors({})
		const f = [...fields]
		const item = { ...f[index] }
		item.key = k
		f[index] = item
		setFields(f)

		data.fields[index] = { ...data.fields[index], key: k }
	}

	// if we update the key, we need to update the handle ID used by the edge
	// associated with this field
	const updateDataFieldKey = (index: number, k: string) => {
		const indices: number[] = []
		data.fields.forEach((f, i) => f.key === k && indices.push(i))
		if (indices.length > 0) {
			console.log('duplicate keys, highlight')

			const ers = {}
			// @ts-ignore
			ers[index] = true
			indices.forEach((i) => {
				// @ts-ignore
				ers[i] = true
			})

			setErrors(ers)
			return
		}

		// update the corresponding edge
		const outgoing = getOutgoingEdges(id, edges)

		const editEdge = outgoing.filter(
			(e) => e.sourceHandle === fields[index].key
		)[0]

		if (editEdge) {
			editEdge.sourceHandle = k
			editEdge.data = { ...editEdge.data }

			// new is type connection:
			// source, target, sourceHandle targetHandle
			// in our case we only modify the sourceHandle
			dispatch({
				type: types.editEdgeHandle,
				data: {
					old: editEdge,
					new: {
						source: editEdge.source,
						target: editEdge.target,
						sourceHandle: k,
						targetHandle: editEdge.targetHandle,
					},
				},
			})
		}

		// need to force a re-render by updating node itnerals, aka
		// by editing the sourcehandles array

		const newHandles = sourceArray.filter((e) => e !== fields[index].key)
		newHandles.push(k)

		setErrors({})
		const f = [...fields]
		const item = { ...f[index] }
		item.key = k
		f[index] = item
		setFields(f)
		setSourceArray(newHandles)

		data.fields[index] = { ...data.fields[index], key: k }
	}

	const updateValue = (index: number, v: any) => {
		const f = [...fields]
		const item = { ...f[index] }
		item.value = v
		f[index] = item
		setFields(f)

		data.fields[index] = { ...data.fields[index], value: v }
	}

	// https://stackoverflow.com/questions/43230622/reactjs-how-to-delete-item-from-list/43230714
	const deleteField = (fieldID: string) => {
		setFields(fields.filter((el) => el.key !== fieldID))
		data.fields = data.fields.filter((el) => el.key !== fieldID)
	}

	useEffect(() => {
		// console.log(sourceArray)
		updateNodeInternals(id)
	}, [sourceArray])

	// useEffect(() => {
	// 	console.log(errors)
	// }, [errors])

	useEffect(() => {
		setFields([...data.fields])
	}, [data])

	return (
		<Node selected={selected}>
			<Handle
				type="target"
				position={Position.Left}
				// style={{ background: '#555' }}
				onConnect={(params) => console.log('handle onConnect', params)}
				isConnectable={isConnectable}
			/>
			{/* {sourceHandles} */}
			<Container>
				<NodeHeader color={data.color}>
					<input
						value={data.name}
						onChange={(e) => {
							updateNodeName(id, e.target.value)
						}}
					/>
					<div style={{ padding: 20 }}>
						<input
							type="color"
							defaultValue={data.color}
							onChange={(evt) =>
								updateNodeColor(id, evt.target.value)
							}
							className="nodrag"
						/>
					</div>
				</NodeHeader>
				<ButtonRow>
					<button
						onClick={() =>
							dispatch({ type: types.setNode, data: id })
						}
					>
						Edit
					</button>
					{/* If there is no workspace, save to editor is default */}
					<button
						onClick={() =>
							workspace.name === null
								? dispatch({
										type: types.addCustomNode,
										data: SerializeNode(
											data.name,
											data.color,
											'base',
											fields
										),
								  })
								: dispatch({
										type: types.addCustomWorkspaceNode,
										data: SerializeNode(
											`@workspace/${data.name}`,
											data.color,
											'base',
											fields
										),
								  })
						}
					>
						Save
					</button>
				</ButtonRow>
				<ButtonRow>
					<button onClick={() => setExpanded(!expanded)}>
						{!expanded && <>Expand</>}
						{expanded && <>Collapse</>}
					</button>
				</ButtonRow>

				{expanded && (
					<>
						<ButtonRow>
							<button onClick={() => addField('string')}>
								String
							</button>
							<button onClick={() => addField('text')}>
								Text
							</button>
							<button onClick={() => addField('bool')}>
								Boolean
							</button>
							<button onClick={() => addField('number')}>
								Number
							</button>
							<button onClick={() => addField('data')}>
								data
							</button>
							<button
								disabled={
									Object.keys(workspace.w_vars).length === 0
								}
								onClick={() => addField('custom')}
							>
								custom
							</button>
						</ButtonRow>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 4,
							}}
							className="nodrag"
						>
							{fields.map((field, index) => {
								switch (field.type) {
									case 'string':
										return (
											<StringField
												index={index}
												key={field.key}
												k={field.key}
												v={field.value}
												updateValue={updateValue}
												updateKey={updateKey}
												del={deleteField}
												error={errors[index] || false}
											/>
										)
									case 'text':
										return (
											<StringField
												index={index}
												key={field.key}
												k={field.key}
												v={field.value}
												updateValue={updateValue}
												updateKey={updateKey}
												del={deleteField}
												error={errors[index] || false}
											/>
										)
									case 'bool':
										return (
											<BooleanField
												index={index}
												key={field.key}
												k={field.key}
												v={field.value}
												updateValue={updateValue}
												updateKey={updateKey}
												del={deleteField}
												error={errors[index] || false}
											/>
										)
									case 'number':
										return (
											<NumberField
												index={index}
												key={field.key}
												k={field.key}
												v={field.value}
												updateValue={updateValue}
												updateKey={updateKey}
												del={deleteField}
												error={errors[index] || false}
											/>
										)
									case 'data':
										return (
											<ObjectField
												add={addHandle}
												id={id}
												key={field.key}
												k={field.key}
												v={field.value}
												index={index}
												update={updateDataFieldKey}
												del={deleteField}
												error={errors[index] || false}
											/>
										)
									case 'custom':
										return (
											<CustomField
												index={index}
												key={field.key}
												k={field.key}
												v={field.value}
												updateValue={updateValue}
												updateKey={updateKey}
												del={deleteField}
												error={errors[index] || false}
											/>
										)
									default:
										return <></>
								}
							})}
						</div>
					</>
				)}
			</Container>
			<Handle
				type="source"
				position={Position.Right}
				id={id}
				// style={{ background: '#555' }}
				isConnectable={isConnectable}
			/>
			{/* When the node is collapsed, in order to force
				reactflow to continue to render the edges, we stack
				handles and make them unclickable/invisible
			*/}
			{!expanded && (
				<>
					{sourceArray.map((h) => (
						<Handle
							type="source"
							key={h}
							id={h}
							position={Position.Right}
							onClick={undefined}
							style={{ pointerEvents: 'none' }}
							isConnectable={false}
						/>
					))}
				</>
			)}
		</Node>
	)
}
