import type { ImageGenNodeData } from "../../data/nodes/ImageGenNodeData";
import type { CreateStateType } from "../shapes/CreateStateType";

/**
 * State type for image generation nodes.
 * Since ImageGenNodeData has no non-persistent keys, this directly extends the data type.
 */
export type ImageGenNodeState = CreateStateType<
	ImageGenNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;
