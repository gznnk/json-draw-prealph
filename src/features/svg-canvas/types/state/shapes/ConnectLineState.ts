// Import types.
import type {
	ConnectLineData,
	ConnectLineFeatures,
} from "../../data/shapes/ConnectLineData";
import type { CreateStateType } from "./CreateStateType";

/**
 * State type for connection lines between diagram elements.
 */
export type ConnectLineState = CreateStateType<
	ConnectLineData,
	typeof ConnectLineFeatures
>;
