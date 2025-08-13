import type {
	CreateDataType,
	CreateDiagramProps,
	CreateStateType,
} from "./CreateDiagramTypes";
import type { ArrowHeadType } from "../../core/ArrowHeadType";
import type { DiagramBaseData } from "../core/DiagramBaseTypes";

/**
 * Data type for polyline/path elements.
 * Contains properties for styling path elements and optional arrow heads at endpoints.
 */
export type PathData = CreateDataType<{
	transformative: true;
	itemable: true;
	strokable: true;
}> & {
	startArrowHead?: ArrowHeadType;
	endArrowHead?: ArrowHeadType;
};

/**
 * State type for polyline/path elements.
 * Contains properties for styling path elements and optional arrow heads at endpoints.
 */
export type PathState = CreateStateType<
	PathData,
	{
		selectable: true;
		transformative: true;
		itemable: true;
		strokable: true;
	}
>;

/**
 * Props for Path component
 */
export type PathProps = CreateDiagramProps<
	PathState,
	{
		selectable: true;
		transformative: true;
		itemable: true;
	}
> & {
	dragEnabled?: boolean;
	transformEnabled?: boolean;
	verticesModeEnabled?: boolean;
	rightAngleSegmentDrag?: boolean;
	fixBothEnds?: boolean;
};

/**
 * Data type for path vertices.
 * Represents individual points that make up a path or polyline.
 */
export type PathPointData = DiagramBaseData;

/**
 * State type for path vertices.
 * Represents individual points that make up a path or polyline.
 */
export type PathPointState = PathPointData;

/**
 * Props for PathPoint component
 */
export type PathPointProps = CreateDiagramProps<PathPointState, object> & {
	hidden?: boolean;
};
