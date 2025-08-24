// Import React.
import type React from "react";
import { memo } from "react";

// Import types.
import type { FrameProps } from "../../../types/props/elements/FrameProps";



/**
 * Frame minimap component (simplified version for minimap)
 */
const FrameMinimapComponent: React.FC<FrameProps> = ({
	x,
	y,
	width,
	height,
	fill = "transparent",
	stroke = "black",
	strokeWidth = 1,
}) => {
	return (
		<rect
			x={x - width / 2}
			y={y - height / 2}
			width={width}
			height={height}
			fill={fill}
			stroke={stroke}
			strokeWidth={strokeWidth}
			pointerEvents="none"
		/>
	);
};

export const FrameMinimap = memo(FrameMinimapComponent);