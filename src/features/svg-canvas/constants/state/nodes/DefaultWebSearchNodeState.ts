import { DefaultRectangleState } from "../shapes/DefaultRectangleState";
import type { WebSearchNodeState } from "../../../types/diagrams/nodes/WebSearchNodeTypes";

export const DefaultWebSearchNodeState = {
	...DefaultRectangleState,
	type: "WebSearchNode",
} as const satisfies WebSearchNodeState;
