/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Formik, Form, Field } from 'formik'

// Create a custom editor or workspace node
const CreateWorkspace: React.FC<{
	name?: string | null
	submit: (name: string) => void
	cancel: () => void
}> = ({ name, submit, cancel }) => {
	return (
		<Formik
			validateOnChange={false}
			validateOnBlur={false}
			validate={(values) => {
				const errors: any = {}

				if (values.name.length < 1) {
					errors.name = 'Required'
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

export default CreateWorkspace
