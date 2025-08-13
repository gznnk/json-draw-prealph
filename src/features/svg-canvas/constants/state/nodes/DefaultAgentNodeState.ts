import { DefaultRectangleState } from "../shapes/DefaultRectangleState";
import type { AgentNodeState } from "../../../types/diagrams/nodes/AgentNodeTypes";

export const DefaultAgentNodeState = {
	...DefaultRectangleState,
	type: "AgentNode",
} as const satisfies AgentNodeState;
