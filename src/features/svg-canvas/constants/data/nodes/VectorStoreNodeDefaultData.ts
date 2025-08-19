// Import types.
import type { VectorStoreNodeData } from "../../../types/data/nodes/VectorStoreNodeData";
import { VectorStoreNodeFeatures } from "../../../types/data/nodes/VectorStoreNodeData";

// Import helpers.
import { CreateDefaultData } from "../shapes/CreateDefaultData";

/**
 * Default vector store node data template.
 * Generated using Features definition and CreateDefaultData helper.
 */
export const VectorStoreNodeDefaultData = CreateDefaultData<VectorStoreNodeData>({
	type: "VectorStoreNode",
	options: VectorStoreNodeFeatures,
	properties: {},
});