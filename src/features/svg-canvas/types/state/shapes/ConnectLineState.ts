// Import types.
import type { ConnectLineData } from "../../data/shapes/ConnectLineData";
import type { CreateStateType } from "./CreateStateType";

/**
 * State type for connection lines between diagram elements.
 * Contains properties for defining connection endpoints and visual styling.
 */
export type ConnectLineState = CreateStateType<
	ConnectLineData,
	{
		selectable: true;
		transformative: true;
		itemable: true;
		strokable: true;
	}
>;
