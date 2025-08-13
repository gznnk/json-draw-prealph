// Import data types.
import type { HubNodeData } from "../nodes/HubNodeTypes";
import type { LLMNodeData } from "../nodes/LLMNodeTypes";
import type { TextAreaNodeData } from "../nodes/TextAreaNodeTypes";
import type { AgentNodeData } from "../nodes/AgentNodeTypes";
import type { ImageGenNodeData } from "../nodes/ImageGenNodeTypes";
import type { ConnectLineData } from "../shapes/ConnectTypes";
import type { ConnectPointData } from "../shapes/ConnectTypes";
import type { EllipseData } from "../shapes/EllipseTypes";
import type { GroupData } from "../shapes/GroupTypes";
import type { ImageData } from "../shapes/ImageTypes";
import type { PathData, PathPointData } from "../shapes/PathTypes";
import type { RectangleData } from "../shapes/RectangleTypes";
import type { SvgData } from "../shapes/SvgTypes";

// Import state types.
import type { HubNodeState } from "../nodes/HubNodeTypes";
import type { LLMNodeState } from "../nodes/LLMNodeTypes";
import type { TextAreaNodeState } from "../nodes/TextAreaNodeTypes";
import type { AgentNodeState } from "../nodes/AgentNodeTypes";
import type { ImageGenNodeState } from "../nodes/ImageGenNodeTypes";
import type { ConnectLineState } from "../shapes/ConnectTypes";
import type { ConnectPointState } from "../shapes/ConnectTypes";
import type { EllipseState } from "../shapes/EllipseTypes";
import type { GroupState } from "../shapes/GroupTypes";
import type { ImageState } from "../shapes/ImageTypes";
import type { PathState, PathPointState } from "../shapes/PathTypes";
import type { RectangleState } from "../shapes/RectangleTypes";
import type { SvgState } from "../shapes/SvgTypes";

/**
 * Union type representing all diagram data types.
 * This type corresponds to the Diagram union for state types and is used for serialization.
 */
export type DiagramData =
	// Shapes
	| ConnectLineData
	| ConnectPointData
	| EllipseData
	| GroupData
	| ImageData
	| PathData
	| PathPointData
	| RectangleData
	| SvgData
	// Nodes
	| HubNodeData
	| LLMNodeData
	| TextAreaNodeData
	| AgentNodeData
	| ImageGenNodeData;

/**
 * Union type representing all diagram state types.
 * This type is used throughout the catalog to ensure type safety.
 */
export type Diagram =
	// Shapes
	| ConnectLineState
	| ConnectPointState
	| EllipseState
	| GroupState
	| ImageState
	| PathState
	| PathPointState
	| RectangleState
	| SvgState
	// Nodes
	| HubNodeState
	| LLMNodeState
	| TextAreaNodeState
	| AgentNodeState
	| ImageGenNodeState;
