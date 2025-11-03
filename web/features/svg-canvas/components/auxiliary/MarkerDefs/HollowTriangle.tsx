import type React from "react";
import { memo } from "react";

const TRIANGLE_SIZE = 13;

/**
 * HollowTriangle marker definition.
 * Creates a hollow (white-filled) triangle for UML generalization/inheritance relationships.
 * Uses context-stroke for the outline and white fill.
 */
const HollowTriangleMarkerComponent: React.FC = () => {
	return (
		<marker
			id="marker-hollow-triangle"
			markerWidth={TRIANGLE_SIZE}
			markerHeight={TRIANGLE_SIZE}
			refX={TRIANGLE_SIZE}
			refY={TRIANGLE_SIZE / 2}
			orient="auto-start-reverse"
			markerUnits="userSpaceOnUse"
		>
			<polygon
				points={`0,0 ${TRIANGLE_SIZE},${TRIANGLE_SIZE / 2} 0,${TRIANGLE_SIZE}`}
				fill="white"
				stroke="context-stroke"
				strokeWidth="1.5"
				strokeLinejoin="miter"
				strokeLinecap="square"
			/>
		</marker>
	);
};

export const HollowTriangleMarker = memo(HollowTriangleMarkerComponent);
