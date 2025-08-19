// Import types.
import type { ArrowHeadType } from "../../core/ArrowHeadType";
import type { DiagramFeatures } from "../../core/DiagramFeatures";
import type { PathType } from "../../core/PathType";
import type { CreateDataType } from "./CreateDataType";

/**
 * Diagram features for Path shapes.
 */
export const PathFeatures = {
	transformative: true,
	itemable: true,
	strokable: true,
	selectable: true,
} as const satisfies DiagramFeatures;

/**
 * Data type for polyline/path elements.
 */
export type PathData = CreateDataType<typeof PathFeatures> & {
	pathType: PathType;
	startArrowHead?: ArrowHeadType;
	endArrowHead?: ArrowHeadType;
};
