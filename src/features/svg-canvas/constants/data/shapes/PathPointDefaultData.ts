import type { PathPointData } from "../../../types/diagrams/shapes/PathTypes";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";

/**
 * Default path point data template.
 * Used for State to Data conversion mapping.
 */
export const PathPointDefaultData = {
	...DiagramBaseDefaultData,
	type: "PathPoint",
} as const satisfies PathPointData;
