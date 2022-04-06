import React, { memo, useState } from 'react'
import { Handle, Position, XYPosition } from 'react-flow-renderer'
import Detail from '../components/page/detail/Detail'

const DialogueNodeContent: React.FC<{
	characterName: string
	dialogue: string
	edit(): Function
	link(arg0: Function): void
}> = ({ characterName, dialogue, edit, link }) => {
	// const [selected, setSelected] = useState(false)
	const [name] = useState(characterName)
	const [d, setD] = useState(dialogue)
	link(setD)
	return (
		<>
			<h2>{name}</h2>
			<p>{d}</p>
			{/* transition to dispatch? */}
			{/* <button onClick={() => setSelected(true)}>Edit</button> */}
			<button onClick={edit}>Edit</button>
			{/* works but node styling messing up fullscreen view */}
			{/* {selected && (
				<Detail
					isOpen={selected}
					close={() => setSelected(false)}
					dialogue={d}
					setDialogue={setD}
				/>
			)} */}
		</>
	)
}

// this is a temporary class - eventually we'll need events too I assume
export class DialogueNode {
	private static last_id: number = 1

	id: string

	sourcePosition: Position

	targetPosition: Position

	edit: Function

	update: React.Dispatch<React.SetStateAction<string>> | null

	link(f: React.Dispatch<React.SetStateAction<string>>) {
		this.update = f
	}

	isConnectable = true

	private _character_name: string = ''

	get character_name() {
		return this._character_name
	}

	set character_name(value: string) {
		this._character_name = value
		this._set_data()
	}

	_dialogue: string = ''

	get dialogue() {
		return this._dialogue
	}

	set dialogue(value: string) {
		this._dialogue = value
		this._set_data()
	}

	updateDialogue() {
		if (this.update) {
			this.update(this.dialogue)
		}
	}

	type: string = 'dialogue'

	// data is generated by the character name and dialogue option
	data: object = {}

	// position is based on the x and y variables
	// this could probably be surfaced as an object instead of this read only thing
	// but who's to say
	position: XYPosition

	// ctor
	constructor(
		character_name: string,
		dialogue: string,
		edit: Function,
		x: number,
		y: number,
		TB?: boolean
	) {
		this.character_name = character_name
		this.dialogue = dialogue
		this.id = (DialogueNode.last_id++).toString()
		this.position = { x, y }
		if (TB) {
			this.sourcePosition = Position.Bottom
			this.targetPosition = Position.Top
		} else {
			this.sourcePosition = Position.Right
			this.targetPosition = Position.Left
		}
		this._set_data()
		this.edit = edit
		this.update = null
		this._set_data()
	}

	// edit(event: any) {
	//     console.log(this)
	//     console.log(event)
	// }

	private _set_data() {
		this.data = {
			characterName: this.character_name,
			dialogue: this.dialogue,
			// edit={() => this.edit(this)}
			// link={this.link.bind(this)}
		}
	}
}

export default memo<{
	data: any
	isConnectable: boolean
	sourcePosition: Position
	targetPosition: Position
}>(({ data, isConnectable, sourcePosition, targetPosition }) => {
	// const [selected, setSelected] = useState(false)
	const [name] = useState(data.characterName)
	const [d, setD] = useState(data.dialogue)
	// link(setD)
	return (
		<>
			<Handle
				type="target"
				position={targetPosition}
				style={{ background: '#555' }}
				onConnect={(params) => console.log('handle onConnect', params)}
				isConnectable={isConnectable}
			/>
			<h2>{name}</h2>
			<p>{d}</p>
			{/* transition to dispatch? */}
			{/* <button onClick={() => setSelected(true)}>Edit</button> */}
			{/* <button onClick={edit}>Edit</button> */}
			<button>Edit</button>
			{/* works but node styling messing up fullscreen view */}
			{/* {selected && (
				<Detail
					isOpen={selected}
					close={() => setSelected(false)}
					dialogue={d}
					setDialogue={setD}
				/>
			)} */}
			<Handle
				type="source"
				position={sourcePosition}
				style={{ background: '#555' }}
				isConnectable={isConnectable}
			/>
		</>
	)
})
