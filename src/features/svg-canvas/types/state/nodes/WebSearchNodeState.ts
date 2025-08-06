import type { WebSearchNodeData } from "../../data/nodes/WebSearchNodeData";
import type { CreateStateType } from "../shapes/CreateStateType";

/**
 * State type for web search nodes.
 * Since WebSearchNodeData has no non-persistent keys, this directly extends the data type.
 */
export type WebSearchNodeState = CreateStateType<
	WebSearchNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;
