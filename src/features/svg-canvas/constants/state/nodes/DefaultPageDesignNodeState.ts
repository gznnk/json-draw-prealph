import { DefaultRectangleState } from "../shapes/DefaultRectangleState";
import type { PageDesignNodeState } from "../../../types/diagrams/nodes/PageDesignNodeTypes";

export const DefaultPageDesignNodeState = {
	...DefaultRectangleState,
	type: "PageDesignNode",
} as const satisfies PageDesignNodeState;
