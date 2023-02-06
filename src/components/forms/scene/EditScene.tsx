/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Formik, Form, Field } from 'formik'

// Create a custom editor or workspace node
const EditScene: React.FC<{
	name?: string | null
	forbidden?: string[]
	submit: (name: string) => void
	cancel: () => void
}> = ({ name, forbidden, submit, cancel }) => {
	return (
		<Formik
			validateOnChange={false}
			validateOnBlur={false}
			validate={(values) => {
				const errors: any = {}

				if (values.name.length < 1) {
					errors.name = 'Required'
				}

				if (forbidden?.includes(values.name)) {
					errors.name = 'A node with this name already exists'
				}

				return errors
			}}
			initialValues={{
				name: name || '',
			}}
			onSubmit={(values) => {
				submit(values.name)
			}}
		>
			{({ values, errors, touched, handleSubmit, setFieldValue }) => (
				<Form onSubmit={handleSubmit}>
					<label htmlFor="name">Name</label>
					<Field name="name" />
					{errors.name ? <div>{errors.name}</div> : null}
					<button type="submit">Save</button>
					<button type="button" onClick={cancel}>
						cancel
					</button>
				</Form>
			)}
		</Formik>
	)
}

export default EditScene
