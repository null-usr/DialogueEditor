import React, { memo } from 'react'
import { Handle } from 'reactflow'

import './FloatingHandleNode.css'

// @ts-ignore
export default memo(({ data }) => {
	return (
		<>
			{data.label}
			{/* @ts-ignore */}
			<Handle type="source" position="top" id="a" />
			{/* @ts-ignore */}
			<Handle type="source" position="right" id="b" />
			{/* @ts-ignore */}
			<Handle type="source" position="bottom" id="c" />
			{/* @ts-ignore */}
			<Handle type="source" position="left" id="d" />
		</>
	)
})
