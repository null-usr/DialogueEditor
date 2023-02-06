import React from 'react'
import { MarkerType } from 'reactflow'

class DialogueEdge {
	readonly id: string

	readonly source: string

	readonly target: string

	readonly markerType: MarkerType = MarkerType.ArrowClosed

	constructor(source: string, target: string) {
		this.source = source
		this.target = target
		this.id = `${source}-${target}`
	}
}

export default DialogueEdge
