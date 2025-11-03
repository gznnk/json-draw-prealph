import type React from "react";
import { memo } from "react";

const TRIANGLE_SIZE = 13;

/**
 * OpenArrow marker definition.
 * Creates an open arrow marker for UML dependency relationships.
 * Uses context-stroke for the outline only (not filled).
 */
const OpenArrowMarkerComponent: React.FC = () => {
	return (
		<marker
			id="marker-open-arrow"
			markerWidth={TRIANGLE_SIZE}
			markerHeight={TRIANGLE_SIZE}
			refX={TRIANGLE_SIZE}
			refY={TRIANGLE_SIZE / 2}
			orient="auto-start-reverse"
			markerUnits="userSpaceOnUse"
		>
			<polyline
				points={`0,0 ${TRIANGLE_SIZE},${TRIANGLE_SIZE / 2} 0,${TRIANGLE_SIZE}`}
				fill="none"
				stroke="context-stroke"
				strokeWidth="1.5"
			/>
		</marker>
	);
};

export const OpenArrowMarker = memo(OpenArrowMarkerComponent);
