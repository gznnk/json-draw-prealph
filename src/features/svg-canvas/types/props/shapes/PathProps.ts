// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "./CreateDiagramProps";
import type { PathState } from "../../state/shapes/PathState";

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
	segmentDragEnabled?: boolean;
	rightAngleSegmentDrag?: boolean;
	newVertexEnabled?: boolean;
	fixBothEnds?: boolean;
};
