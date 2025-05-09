// Import types
import type { ConnectPointMoveData } from "../types/EventTypes";
import type { Diagram, DiagramType } from "./DiagramTypes";

// Import functions
import { createAgentNodeData } from "../components/nodes/AgentNode";
import { createHubNodeData } from "../components/nodes/HubNode";
import { createImageGenNodeData } from "../components/nodes/ImageGenNode";
import { createLLMNodeData } from "../components/nodes/LLMNode";
import { createSvgToDiagramNodeData } from "../components/nodes/SvgToDiagramNode";
import { createTextAreaNodeData } from "../components/nodes/TextAreaNode";
import { createVectorStoreNodeData } from "../components/nodes/VectorStoreNode";
import { createWebSearchNodeData } from "../components/nodes/WebSearchNode";
import {
	calcEllipseConnectPointPosition,
	createEllipseData,
} from "../components/shapes/Ellipse";
import { createImageData, imageToBlob } from "../components/shapes/Image";
import { createPathData } from "../components/shapes/Path";
import {
	calcRectangleConnectPointPosition,
	createRectangleData,
} from "../components/shapes/Rectangle";
import { svgToBlob } from "../components/shapes/Svg";

/**
 * Maps diagram types to their corresponding connect point calculation functions.
 */
export const DiagramConnectPointCalculators: {
	[key in DiagramType]: (diagram: Diagram) => ConnectPointMoveData[];
} = {
	// Shapes
	ConnectLine: () => [],
	ConnectPoint: () => [],
	Ellipse: (diagram) => calcEllipseConnectPointPosition(diagram),
	Group: () => [],
	Image: () => [],
	Path: () => [],
	PathPoint: () => [],
	Rectangle: (diagram) => calcRectangleConnectPointPosition(diagram),
	Svg: () => [],
	// Nodes
	AgentNode: (diagram) => calcRectangleConnectPointPosition(diagram),
	HubNode: (diagram) => calcEllipseConnectPointPosition(diagram),
	ImageGenNode: (diagram) => calcRectangleConnectPointPosition(diagram),
	SvgToDiagramNode: (diagram) => calcRectangleConnectPointPosition(diagram),
	LLMNode: (diagram) => calcRectangleConnectPointPosition(diagram),
	TextAreaNode: (diagram) => calcRectangleConnectPointPosition(diagram),
	VectorStoreNode: (diagram) => calcRectangleConnectPointPosition(diagram),
	WebSearchNode: (diagram) => calcRectangleConnectPointPosition(diagram),
};

/**
 * Maps diagram types to their corresponding data creation functions.
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

/**
 * Maps diagram types to their corresponding export functions.
 */
export const DiagramExportFunctions: {
	[key in DiagramType]: ((diagram: Diagram) => Blob | undefined) | undefined;
} = {
	// Shapes
	ConnectLine: undefined,
	ConnectPoint: undefined,
	Ellipse: undefined,
	Group: undefined,
	Image: imageToBlob,
	Path: undefined,
	PathPoint: undefined,
	Rectangle: undefined,
	Svg: svgToBlob,
	// Nodes
	AgentNode: undefined,
	HubNode: undefined,
	ImageGenNode: undefined,
	SvgToDiagramNode: undefined,
	LLMNode: undefined,
	TextAreaNode: undefined,
	VectorStoreNode: undefined,
	WebSearchNode: undefined,
};
