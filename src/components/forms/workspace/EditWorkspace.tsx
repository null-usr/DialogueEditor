/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Formik, Form, Field } from 'formik'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import WorkspaceVariable from './WorkspaceVariable'

// Create a custom editor or workspace node
const EditWorkspace: React.FC<{
	name?: string | null
	submit: (name: string) => void
	cancel: () => void
}> = ({ name, submit, cancel }) => {
	const { workspace, dispatch } = useStore()
	const workspaceVars = Object.keys(workspace.w_vars)
	return (
		<>
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

			<Formik
				validateOnChange={false}
				validateOnBlur={false}
				validate={(values) => {
					const errors: any = {}

					if (values.name.length < 1) {
						errors.name = 'Required'
					}

					if (workspaceVars.includes(values.name)) {
						errors.name = 'A variable with that name already exists'
					}

					return errors
				}}
				initialValues={{
					name: '',
					type: 'string',
				}}
				onSubmit={(values, { resetForm }) => {
					dispatch({
						type: types.createWorkspaceVariable,
						data: {
							name: values.name,
							type: values.type,
						},
					})

					resetForm()
				}}
			>
				{({ values, errors, touched, handleSubmit, setFieldValue }) => (
					<Form onSubmit={handleSubmit}>
						<label htmlFor="name">Variable Name</label>
						<Field name="name" />
						{errors.name ? <div>{errors.name}</div> : null}
						<p>Type</p>
						<label>
							String
							<Field name="type" type="radio" value="string" />
						</label>
						<label>
							Number
							<Field name="type" type="radio" value="number" />
						</label>
						<button type="submit">Create Workspace Variable</button>
					</Form>
				)}
			</Formik>
			{workspaceVars.map((v) => {
				return <WorkspaceVariable key={v} name={v} />
			})}
		</>
	)
}

export default EditWorkspace
