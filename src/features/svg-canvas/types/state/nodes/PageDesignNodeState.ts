import type { PageDesignNodeData } from "../../data/nodes/PageDesignNodeData";
import type { CreateStateType } from "../shapes/CreateStateType";

/**
 * State type for page design nodes.
 * Since PageDesignNodeData has no non-persistent keys, this directly extends the data type.
 */
export type PageDesignNodeState = CreateStateType<
	PageDesignNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;
