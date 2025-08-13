import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultLLMNodeState } from "../../../constants/state/nodes/DefaultLLMNodeState";
import type {
	LLMNodeData,
	LLMNodeState,
} from "../../../types/diagrams/nodes/LLMNodeTypes";

export const mapLLMNodeDataToState =
	createDataToStateMapper<LLMNodeState>(DefaultLLMNodeState);

export const llmNodeDataToState = (data: LLMNodeData): LLMNodeState =>
	mapLLMNodeDataToState(data);
