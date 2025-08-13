import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { VectorStoreNodeDefaultData } from "../../../constants/data/nodes/VectorStoreNodeDefaultData";
import type { VectorStoreNodeData } from "../../../types/diagrams/nodes/VectorStoreNodeTypes";
import type { VectorStoreNodeState } from "../../../types/diagrams/nodes/VectorStoreNodeTypes";

export const mapVectorStoreNodeStateToData =
	createStateToDataMapper<VectorStoreNodeData>(VectorStoreNodeDefaultData);

export const vectorStoreNodeStateToData = (
	state: VectorStoreNodeState,
): VectorStoreNodeData => mapVectorStoreNodeStateToData(state);
