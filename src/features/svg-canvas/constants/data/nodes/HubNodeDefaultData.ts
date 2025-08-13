import type { HubNodeData } from "../../../types/diagrams/nodes/HubNodeTypes";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";
import { ConnectableDefaultData } from "../shapes/ConnectableDefaultData";

/**
 * Default hub node data template.
 * Used for State to Data conversion mapping.
 */
export const HubNodeDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	...ConnectableDefaultData,
	type: "HubNode",
} as const satisfies HubNodeData;
