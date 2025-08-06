import type { LLMNodeData } from "../../data/nodes/LLMNodeData";
import type { CreateStateType } from "../shapes/CreateStateType";

/**
 * State type for LLM nodes.
 * Since LLMNodeData has no non-persistent keys, this directly extends the data type.
 */
export type LLMNodeState = CreateStateType<
	LLMNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		textable: true;
		executable: true;
	}
>;
