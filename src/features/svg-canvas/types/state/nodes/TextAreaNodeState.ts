import type { TextAreaNodeData } from "../../data/nodes/TextAreaNodeData";
import type { CreateStateType } from "../shapes/CreateStateType";

/**
 * State type for text area nodes.
 * Since TextAreaNodeData has no non-persistent keys, this directly extends the data type.
 */
export type TextAreaNodeState = CreateStateType<
	TextAreaNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		textable: true;
		executable: true;
	}
>;
