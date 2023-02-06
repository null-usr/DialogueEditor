import React, { useEffect, useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { ThemeProvider } from 'styled-components'
import { FlowProvider } from '@/contexts/FlowContext'
import useStore from '@/store/store'
import Workspace from './workspace/Workspace'
import Toolbar from './toolbar/Toolbar'
import { PageContainer } from './styles'

function Page() {
	const { theme, setTheme } = useStore()

	useEffect(() => {
		async function loadTheme() {
			fetch('./theme.json')
				.then((response) => response.json())
				.then((d) => {
					setTheme(d)
				})
		}

		loadTheme()
	}, [])

	return (
		<>
			{theme && (
				<PageContainer>
					<ThemeProvider theme={theme}>
						<ReactFlowProvider>
							<Toolbar />
							<Workspace />
						</ReactFlowProvider>
					</ThemeProvider>
				</PageContainer>
			)}
		</>
	)
}

export default Page
