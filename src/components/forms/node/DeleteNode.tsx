/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Formik, Form, Field } from 'formik'

// Create a custom editor or workspace node
const DeleteNode: React.FC<{
	name?: string | null
	submit: () => void
	cancel: () => void
}> = ({ name, submit, cancel }) => {
	return (
		<div>
			<p>Are you sure you want to delete {name}?</p>
			<button onClick={submit}>Delete</button>
			<button onClick={cancel}>cancel</button>
		</div>
	)
}

export default DeleteNode
