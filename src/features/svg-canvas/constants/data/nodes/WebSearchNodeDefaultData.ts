import type { WebSearchNodeData } from "../../../types/data/nodes/WebSearchNodeData";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";
import { ConnectableDefaultData } from "../shapes/ConnectableDefaultData";

/**
 * Default web search node data template.
 * Used for State to Data conversion mapping.
 */
export const WebSearchNodeDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	...ConnectableDefaultData,
	type: "WebSearchNode",
} as const satisfies WebSearchNodeData;