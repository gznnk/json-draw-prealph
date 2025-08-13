import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultWebSearchNodeState } from "../../../constants/state/nodes/DefaultWebSearchNodeState";
import type { WebSearchNodeData } from "../../../types/diagrams/nodes/WebSearchNodeTypes";
import type { WebSearchNodeState } from "../../../types/diagrams/nodes/WebSearchNodeTypes";

export const mapWebSearchNodeDataToState =
	createDataToStateMapper<WebSearchNodeState>(DefaultWebSearchNodeState);

export const webSearchNodeDataToState = (
	data: WebSearchNodeData,
): WebSearchNodeState => mapWebSearchNodeDataToState(data);
