import { DefaultRectangleState } from "../shapes/DefaultRectangleState";
import type { ImageGenNodeState } from "../../../types/diagrams/nodes/ImageGenNodeTypes";

export const DefaultImageGenNodeState = {
	...DefaultRectangleState,
	type: "ImageGenNode",
} as const satisfies ImageGenNodeState;
