import { DefaultRectangleState } from "../shapes/DefaultRectangleState";
import type { TextAreaNodeState } from "../../../types/diagrams/nodes/TextAreaNodeTypes";

export const DefaultTextAreaNodeState = {
	...DefaultRectangleState,
	type: "TextAreaNode",
} as const satisfies TextAreaNodeState;
