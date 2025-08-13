import type { AgentNodeData } from "../../../types/diagrams/nodes/AgentNodeData";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";
import { ConnectableDefaultData } from "../shapes/ConnectableDefaultData";

/**
 * Default agent node data template.
 * Used for State to Data conversion mapping.
 */
export const AgentNodeDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	...ConnectableDefaultData,
	type: "AgentNode",
} as const satisfies AgentNodeData;
