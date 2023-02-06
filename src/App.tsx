import React from 'react'
import 'reactflow/dist/style.css'
import Page from './page/Page'
import './App.css'
// overwrite default node stylings, see "Theming" on docs page
import '@/helpers/style.css'

function App() {
	return (
		<div className="App">
			<Page />
		</div>
	)
}

export default App
