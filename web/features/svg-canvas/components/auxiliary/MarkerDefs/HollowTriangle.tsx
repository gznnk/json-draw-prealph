import type React from "react";
import { memo } from "react";

const TRIANGLE_SIZE = 13;
const STROKE_WIDTH = 1.5;
// Add padding for stroke to prevent clipping
const PADDING = STROKE_WIDTH;
const MARKER_SIZE = TRIANGLE_SIZE + PADDING * 2;

/**
 * HollowTriangle marker definition.
 * Creates a hollow (white-filled) triangle for UML generalization/inheritance relationships.
 * Uses context-stroke for the outline and white fill.
 */
const HollowTriangleMarkerComponent: React.FC = () => {
	return (
		<marker
			id="marker-hollow-triangle"
			markerWidth={MARKER_SIZE}
			markerHeight={MARKER_SIZE}
			refX={TRIANGLE_SIZE + PADDING}
			refY={TRIANGLE_SIZE / 2 + PADDING}
			orient="auto-start-reverse"
			markerUnits="userSpaceOnUse"
		>
			<polygon
				points={`${PADDING},${PADDING} ${TRIANGLE_SIZE + PADDING},${TRIANGLE_SIZE / 2 + PADDING} ${PADDING},${TRIANGLE_SIZE + PADDING}`}
				fill="white"
				stroke="context-stroke"
				strokeWidth={STROKE_WIDTH}
				strokeLinejoin="miter"
				strokeLinecap="square"
			/>
		</marker>
	);
};

export const HollowTriangleMarker = memo(HollowTriangleMarkerComponent);
