// Import types.
import type { CreateStateType } from "./CreateStateType";
import type { PathData } from "../../data/shapes/PathData";

/**
 * State type for polyline/path elements.
 * Contains properties for styling path elements and optional arrow heads at endpoints.
 */
export type PathState = CreateStateType<
	PathData,
	{
		selectable: true;
		transformative: true;
		itemable: true;
		strokable: true;
	}
>;
