import React from 'react'

export const ArrayField: React.FC<{
	key: string
	value?: []
	error?: boolean
}> = ({ key, value, error }) => {
	return (
		<div>
			{key}:{value}
		</div>
	)
}
