import type { VectorStoreNodeData } from "../../data/nodes/VectorStoreNodeData";
import type { CreateStateType } from "../shapes/CreateStateType";

/**
 * State type for vector store nodes.
 * Since VectorStoreNodeData has no non-persistent keys, this directly extends the data type.
 */
export type VectorStoreNodeState = CreateStateType<
	VectorStoreNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;
