import type { PathData } from "../../../types/diagrams/shapes/PathTypes";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";
import { ItemableDefaultData } from "../core/ItemableDefaultData";
import { StrokableDefaultData } from "../core/StrokableDefaultData";

/**
 * Default path data template.
 * Used for State to Data conversion mapping.
 */
export const PathDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	...ItemableDefaultData,
	...StrokableDefaultData,
	type: "Path",
} as const satisfies PathData;
