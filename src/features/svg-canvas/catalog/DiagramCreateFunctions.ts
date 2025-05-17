// Import types.
import type { DiagramType } from "../types";
import type { Diagram } from "./DiagramTypes";

// Import node creation functions.
import { createAgentNodeData } from "../components/nodes/AgentNode";
import { createHubNodeData } from "../components/nodes/HubNode";
import {
	createImageGenNodeData,
	createLLMNodeData,
	createSvgToDiagramNodeData,
	createTextAreaNodeData,
	createVectorStoreNodeData,
	createWebSearchNodeData,
} from "../utils/nodes";

// Import shape creation functions.
import { createEllipseData } from "../utils/shapes/ellipse";
import { createImageData } from "../utils/shapes/image";
import { createPathData } from "../utils/shapes/path";
import { createRectangleData } from "../utils/shapes/rectangle";

/**
 * Maps diagram types to their corresponding data creation functions.
 * These functions are used to initialize new diagram elements.
 */
export const DiagramCreateFunctions: {
	[key in DiagramType]: (props: {
		x: number;
		y: number;
	}) => Diagram | undefined;
} = {
	// Shapes
	ConnectLine: () => undefined,
	ConnectPoint: () => undefined,
	Ellipse: (props) => createEllipseData(props),
	Group: () => undefined,
	Image: (props) => createImageData(props),
	Path: (props) => createPathData(props),
	PathPoint: () => undefined,
	Rectangle: (props) => createRectangleData(props),
	Svg: () => undefined,
	// Nodes
	AgentNode: (props) => createAgentNodeData(props),
	HubNode: (props) => createHubNodeData(props),
	ImageGenNode: (props) => createImageGenNodeData(props),
	SvgToDiagramNode: (props) => createSvgToDiagramNodeData(props),
	LLMNode: (props) => createLLMNodeData(props),
	TextAreaNode: (props) => createTextAreaNodeData(props),
	VectorStoreNode: (props) => createVectorStoreNodeData(props),
	WebSearchNode: (props) => createWebSearchNodeData(props),
};
