// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37023

import React, { createContext, useMemo, useState } from 'react'
import { ReactFlowInstance } from 'reactflow'
import initialElements from '../helpers/initial-elements'

// Interface available to the palette & canvas in order to share data
export interface IReactFlow {
	reactFlowInstance: ReactFlowInstance | undefined
	setReactFlowInstance: React.Dispatch<
		React.SetStateAction<ReactFlowInstance | undefined>
	>
}

export const FlowContext = createContext<IReactFlow>(null!)

export const FlowProvider: React.FC<{}> = ({ children }) => {
	const [rfInstance, setRFInstance] = useState<ReactFlowInstance>()

	// https://blog.agney.dev/useMemo-inside-context/
	const inst = useMemo(
		() => ({
			reactFlowInstance: rfInstance,
			setReactFlowInstance: setRFInstance,
		}),
		[rfInstance]
	)

	return <FlowContext.Provider value={inst}>{children}</FlowContext.Provider>
}
