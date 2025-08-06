import type { AgentNodeData } from "../../data/nodes/AgentNodeData";
import type { CreateStateType } from "../shapes/CreateStateType";

/**
 * State type for agent nodes.
 * Since AgentNodeData has no non-persistent keys, this directly extends the data type.
 */
export type AgentNodeState = CreateStateType<
	AgentNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;
