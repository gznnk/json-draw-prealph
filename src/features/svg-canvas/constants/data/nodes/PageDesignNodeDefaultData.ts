import type { PageDesignNodeData } from "../../../types/diagrams/nodes/PageDesignNodeData";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";
import { ConnectableDefaultData } from "../shapes/ConnectableDefaultData";

/**
 * Default page design node data template.
 * Used for State to Data conversion mapping.
 */
export const PageDesignNodeDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	...ConnectableDefaultData,
	type: "PageDesignNode",
} as const satisfies PageDesignNodeData;
