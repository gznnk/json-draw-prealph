import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { WebSearchNodeDefaultData } from "../../../constants/data/nodes/WebSearchNodeDefaultData";
import type { WebSearchNodeData } from "../../../types/diagrams/nodes/WebSearchNodeTypes";
import type { WebSearchNodeState } from "../../../types/diagrams/nodes/WebSearchNodeTypes";

export const mapWebSearchNodeStateToData =
	createStateToDataMapper<WebSearchNodeData>(WebSearchNodeDefaultData);

export const webSearchNodeStateToData = (
	state: WebSearchNodeState,
): WebSearchNodeData => mapWebSearchNodeStateToData(state);
