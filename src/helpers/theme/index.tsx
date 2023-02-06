import styled from 'styled-components'
import ReactFlow, { MiniMap, Controls } from 'reactflow'

export const ReactFlowStyled = styled(ReactFlow)`
	background-color: ${(props) => props.theme.bg};
`

export const MiniMapStyled = styled(MiniMap)`
	background-color: ${(props) => props.theme.bg};

	.react-flow__minimap-mask {
		fill: ${(props) => props.theme.minimapMaskBg};
	}

	.react-flow__minimap-node {
		fill: ${(props) => props.theme.nodeBg};
		stroke: none;
	}
`

export const ControlsStyled = styled(Controls)`
	button {
		background-color: ${(props) => props.theme.controlsBg};
		color: ${(props) => props.theme.controlsColor};
		border-bottom: 1px solid ${(props) => props.theme.controlsBorder};

		&:hover {
			background-color: ${(props) => props.theme.controlsBgHover};
		}

		path {
			fill: currentColor;
		}
	}
`

export const Node = styled.div<{ selected?: boolean }>`
	padding: 10px 20px;
	border-radius: 5px;
	background: ${(props) => props.theme.nodeBg};
	color: ${(props) => props.theme.nodeColor};
	border: 1px solid
		${(props) =>
			props.selected ? props.theme.primary : props.theme.nodeBorder};

	.react-flow__handle {
		background: ${(props) => props.theme.primary};
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}
`
