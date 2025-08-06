import type { HubNodeData } from "../../data/nodes/HubNodeData";
import type { CreateStateType } from "../shapes/CreateStateType";

/**
 * State type for hub nodes.
 * Since HubNodeData has no non-persistent keys, this directly extends the data type.
 */
export type HubNodeState = CreateStateType<
	HubNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;
