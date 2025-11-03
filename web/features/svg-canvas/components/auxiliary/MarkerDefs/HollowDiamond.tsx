import type React from "react";
import { memo } from "react";

const DIAMOND_SIZE = 13;

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
			markerWidth={DIAMOND_SIZE}
			markerHeight={DIAMOND_SIZE}
			refX={DIAMOND_SIZE}
			refY={halfSize}
			orient="auto-start-reverse"
			markerUnits="userSpaceOnUse"
		>
			<polygon
				points={`0,${halfSize} ${halfSize},0 ${DIAMOND_SIZE},${halfSize} ${halfSize},${DIAMOND_SIZE}`}
				fill="white"
				stroke="context-stroke"
				strokeWidth="1.5"
				strokeLinejoin="miter"
				strokeLinecap="square"
			/>
		</marker>
	);
};

export const HollowDiamondMarker = memo(HollowDiamondMarkerComponent);
