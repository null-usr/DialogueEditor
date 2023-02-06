import Modal from '@/components/modal/Modal'
import React, { useState } from 'react'
import { useReactFlow } from 'reactflow'
import { types } from '@/store/reducer'
import DataEdge from '@/components/edges/DataEdge'
import { BooleanField } from '@/components/FieldComponents/BooleanField'
import { NumberField } from '@/components/FieldComponents/NumberField'
import { StringField } from '@/components/FieldComponents/StringField'
import { ButtonRow } from '@/helpers/styles'
import { Field } from '@/helpers/types'
import useStore from '@/store/store'
import { Container } from './styles'

const Detail: React.FC<{
	close: () => void
	isOpen: boolean
	edgeID: string
	// dialogue: string
	// setDialogue: Function
}> = ({ close, /* dialogue */ edgeID, isOpen /* , setDialogue */ }) => {
	const reactFlowInstance = useReactFlow()
	const { nodes, dispatch, updateDialogueData } = useStore()

	const editEdge = reactFlowInstance.getEdge(edgeID) as DataEdge
	const [name, setName] = useState(editEdge.data.name)
	const [id, setID] = useState(edgeID || '')

	const [fields, setFields] = useState<Field[]>(editEdge.data.fields || [])
	const [count, setCount] = useState(fields.length)

	const addField = (type: string) => {
		setFields([
			...fields,
			{ key: `key ${count}`, value: `value ${count}`, type },
		])
		setCount(count + 1)
	}

	const updateField = (index: number, k: string, v: any) => {
		const f = [...fields]
		const item = { ...f[index] }
		item.key = k
		item.value = v
		f[index] = item
		setFields(f)
	}

	// https://stackoverflow.com/questions/43230622/reactjs-how-to-delete-item-from-list/43230714
	const deleteField = (fieldID: string) => {
		setFields(fields.filter((el) => el.key !== fieldID))
	}

	if (!editEdge) return null

	return (
		<Modal
			open={isOpen}
			close={() => {
				const edgeData = {
					name,
					id,
					fields,
				}
				// in this case ID doesn't matter because when we export
				// the ID will be whatever is in data (hopefully)

				dispatch({
					type: types.editEdge,
					data: { edgeID, edgeData },
				})
				// updateDialogueData(nodeID, dialogue)
				close()
			}}
		>
			<Container>
				{/* <input value={id} onChange={(e) => setID(e.target.value)} /> */}
				<input value={name} onChange={(e) => setName(e.target.value)} />
				<ButtonRow>
					<button onClick={() => addField('string')}>Text</button>
					<button onClick={() => addField('bool')}>Boolean</button>
					<button onClick={() => addField('number')}>Number</button>
				</ButtonRow>
				{/* {fields.map((field, index) => {
					switch (field.type) {
						case 'string':
							return (
								<StringField
									updateField={updateField}
									del={deleteField}
									index={index}
									key={field.key}
									k={field.key}
									v={field.value}
								/>
							)
						case 'bool':
							return (
								<BooleanField
									updateField={updateField}
									del={deleteField}
									index={index}
									key={field.key}
									k={field.key}
									v={field.value}
								/>
							)
						case 'number':
							return (
								<NumberField
									updateField={updateField}
									del={deleteField}
									index={index}
									key={field.key}
									k={field.key}
									v={field.value}
								/>
							)
						default:
							return <></>
					}
				})} */}
			</Container>
		</Modal>
	)
}

export default Detail
