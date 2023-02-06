import { types } from '@/store/reducer'
import useStore from '@/store/store'
import { Field, Form, Formik } from 'formik'
import React, { useState } from 'react'

const WorkspaceVariable: React.FC<{ name: string }> = ({ name }) => {
	const [expanded, setExpanded] = useState(false)
	const { workspace, dispatch } = useStore()
	const w_var = workspace.w_vars[name]
	return (
		<div>
			{name} {w_var.type}
			<button onClick={() => setExpanded(!expanded)}>
				{expanded && <>collapse</>}
				{!expanded && <>expand</>}
			</button>
			<button
				onClick={() =>
					dispatch({
						type: types.deleteWorkspaceVariable,
						data: name,
					})
				}
			>
				Delete
			</button>
			{expanded && (
				<>
					<Formik
						validateOnChange={false}
						validateOnBlur={false}
						validate={(values) => {
							const errors: any = {}

							if (
								w_var.type === 'string' &&
								(values as unknown as string).length < 1
							) {
								errors.option = 'Required'
							}

							// @ts-ignore
							if (w_var.options.includes(values.option)) {
								errors.option =
									'A variable with that name already exists'
							}

							return errors
						}}
						initialValues={{
							option: w_var.type === 'string' ? '' : 0,
						}}
						onSubmit={(values, { resetForm }) => {
							dispatch({
								type: types.editWorkspaceVariable,
								data: {
									name,
									options: [...w_var.options, values.option],
								},
							})

							resetForm()
						}}
					>
						{({
							values,
							errors,
							touched,
							handleSubmit,
							setFieldValue,
						}) => (
							<Form onSubmit={handleSubmit}>
								<label htmlFor="option">
									Option Name
									<Field
										id="option"
										name="option"
										type={
											w_var.type === 'string'
												? 'text'
												: 'number'
										}
									/>
								</label>
								{errors.option ? (
									<div style={{ color: 'red' }}>
										{errors.option}
									</div>
								) : null}
								<button type="submit">Add Option</button>
							</Form>
						)}
					</Formik>
					{w_var.options.map((o) => (
						<div key={o}>
							{o}{' '}
							<button
								onClick={() =>
									dispatch({
										type: types.editWorkspaceVariable,
										data: {
											name,
											// @ts-ignore
											options: w_var.options.filter(
												(op: string | number) =>
													op !== o
											),
										},
									})
								}
							>
								delete option
							</button>
						</div>
					))}
				</>
			)}
		</div>
	)
}

export default WorkspaceVariable
