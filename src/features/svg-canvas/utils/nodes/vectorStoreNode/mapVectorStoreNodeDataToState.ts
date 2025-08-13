import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultVectorStoreNodeState } from "../../../constants/state/nodes/DefaultVectorStoreNodeState";
import type { VectorStoreNodeData } from "../../../types/diagrams/nodes/VectorStoreNodeTypes";
import type { VectorStoreNodeState } from "../../../types/diagrams/nodes/VectorStoreNodeTypes";

export const mapVectorStoreNodeDataToState =
	createDataToStateMapper<VectorStoreNodeState>(DefaultVectorStoreNodeState);

export const vectorStoreNodeDataToState = (
	data: VectorStoreNodeData,
): VectorStoreNodeState => mapVectorStoreNodeDataToState(data);
