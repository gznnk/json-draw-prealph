import { DefaultRectangleState } from "../shapes/DefaultRectangleState";
import type { LLMNodeState } from "../../../types/diagrams/nodes/LLMNodeTypes";

export const DefaultLLMNodeState = {
	...DefaultRectangleState,
	type: "LLMNode",
} as const satisfies LLMNodeState;
