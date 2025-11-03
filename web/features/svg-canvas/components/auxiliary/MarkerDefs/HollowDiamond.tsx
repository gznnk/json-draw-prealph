import type React from "react";
import { memo } from "react";

const DIAMOND_SIZE = 13;
const STROKE_WIDTH = 1.5;
// Add padding for stroke to prevent clipping
const PADDING = STROKE_WIDTH;
const MARKER_SIZE = DIAMOND_SIZE + PADDING * 2;

/**
 * HollowDiamond marker definition.
 * Creates a hollow (white-filled) diamond for UML aggregation relationships.
 * Uses context-stroke for the outline and white fill.
 */
const HollowDiamondMarkerComponent: React.FC = () => {
	const halfSize = DIAMOND_SIZE / 2;
	return (
		<marker
			id="marker-hollow-diamond"
			markerWidth={MARKER_SIZE}
			markerHeight={MARKER_SIZE}
			refX={DIAMOND_SIZE + PADDING}
			refY={halfSize + PADDING}
			orient="auto-start-reverse"
			markerUnits="userSpaceOnUse"
		>
			<polygon
				points={`${PADDING},${halfSize + PADDING} ${halfSize + PADDING},${PADDING} ${DIAMOND_SIZE + PADDING},${halfSize + PADDING} ${halfSize + PADDING},${DIAMOND_SIZE + PADDING}`}
				fill="white"
				stroke="context-stroke"
				strokeWidth={STROKE_WIDTH}
				strokeLinejoin="miter"
				strokeLinecap="square"
			/>
		</marker>
	);
};

export const HollowDiamondMarker = memo(HollowDiamondMarkerComponent);
