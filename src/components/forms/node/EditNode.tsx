/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Formik, Form, Field } from 'formik'

// Edit a custom editor or workspace node
// Shared w/ Create Node
const CreateNode: React.FC<{
	name?: string | null
	color?: string
	saveToEditor?: boolean
	forbidden?: string[]
	submit: (name: string, color: string, saveToEditor: boolean) => void
	cancel: () => void
}> = ({ name, color, saveToEditor, forbidden, submit, cancel }) => {
	return (
		<Formik
			validateOnChange={false}
			validateOnBlur={false}
			validate={(values) => {
				const errors: any = {}

				if (values.name.length < 1) {
					errors.name = 'Required'
				}

				let n = values.name
				if (!values.saveToEditor) {
					n = `@workspace/${n}`
				}

				if (forbidden?.includes(n)) {
					errors.name = 'A node with this name already exists'
				}

				return errors
			}}
			initialValues={{
				name: name || '',
				color: color || '#FFFFFF',
				saveToEditor: saveToEditor || false,
			}}
			onSubmit={(values) => {
				submit(values.name, values.color, values.saveToEditor)
			}}
		>
			{({ values, errors, touched, handleSubmit, setFieldValue }) => (
				<Form onSubmit={handleSubmit}>
					<label htmlFor="name">Name</label>
					<Field name="name" />
					{errors.name ? <div>{errors.name}</div> : null}
					<label htmlFor="color">Color</label>
					<Field name="color" type="color" className="nodrag" />
					<label htmlFor="saveToEditor">Save to Editor</label>
					<Field name="saveToEditor" type="checkbox" />
					<button type="submit">Save</button>
					<button type="button" onClick={cancel}>
						cancel
					</button>
				</Form>
			)}
		</Formik>
	)
}

export default CreateNode
