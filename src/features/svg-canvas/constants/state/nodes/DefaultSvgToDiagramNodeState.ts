import { DefaultRectangleState } from "../shapes/DefaultRectangleState";
import type { SvgToDiagramNodeState } from "../../../types/diagrams/nodes/SvgToDiagramNodeTypes";

export const DefaultSvgToDiagramNodeState = {
	...DefaultRectangleState,
	type: "SvgToDiagramNode",
} as const satisfies SvgToDiagramNodeState;
