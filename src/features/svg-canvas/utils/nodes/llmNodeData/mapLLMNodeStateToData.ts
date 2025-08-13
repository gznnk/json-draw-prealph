import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { LLMNodeDefaultData } from "../../../constants/data/nodes/LLMNodeDefaultData";
import type {
	LLMNodeData,
	LLMNodeState,
} from "../../../types/diagrams/nodes/LLMNodeTypes";

export const mapLLMNodeStateToData =
	createStateToDataMapper<LLMNodeData>(LLMNodeDefaultData);

export const llmNodeStateToData = (state: LLMNodeState): LLMNodeData =>
	mapLLMNodeStateToData(state);
