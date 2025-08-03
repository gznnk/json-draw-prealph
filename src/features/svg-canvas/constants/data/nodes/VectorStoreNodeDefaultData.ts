import type { VectorStoreNodeData } from "../../../types/data/nodes/VectorStoreNodeData";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";
import { ConnectableDefaultData } from "../shapes/ConnectableDefaultData";

/**
 * Default vector store node data template.
 * Used for State to Data conversion mapping.
 */
export const VectorStoreNodeDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	...ConnectableDefaultData,
	type: "VectorStoreNode",
} as const satisfies VectorStoreNodeData;