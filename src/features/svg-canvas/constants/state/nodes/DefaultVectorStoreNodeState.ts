import { DefaultRectangleState } from "../shapes/DefaultRectangleState";
import type { VectorStoreNodeState } from "../../../types/diagrams/nodes/VectorStoreNodeTypes";

export const DefaultVectorStoreNodeState = {
	...DefaultRectangleState,
	type: "VectorStoreNode",
} as const satisfies VectorStoreNodeState;
