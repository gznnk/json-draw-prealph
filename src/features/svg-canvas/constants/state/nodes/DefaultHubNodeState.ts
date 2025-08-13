import { DefaultEllipseState } from "../shapes/DefaultEllipseState";
import type { HubNodeState } from "../../../types/diagrams/nodes/HubNodeTypes";

export const DefaultHubNodeState = {
	...DefaultEllipseState,
	type: "HubNode",
} as const satisfies HubNodeState;
