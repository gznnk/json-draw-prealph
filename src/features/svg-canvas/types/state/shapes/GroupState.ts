// Import types.
import type { CreateStateType } from "./CreateStateType";
import type { GroupData } from "../../data/shapes/GroupData";

/**
 * State type for grouped diagram elements.
 * Implements selectable, transformative, and itemable behaviors to manage collections of elements.
 */
export type GroupState = CreateStateType<
	GroupData,
	{
		selectable: true;
		transformative: true;
		itemable: true;
	}
>;
