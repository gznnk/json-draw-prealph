import { DefaultDiagramBaseState } from "../core/DefaultDiagramBaseState";
import type { PathPointState } from "../../../types/diagrams/shapes/PathTypes";

export const DefaultPathPointState = {
	...DefaultDiagramBaseState,
	type: "PathPoint",
} as const satisfies PathPointState;
