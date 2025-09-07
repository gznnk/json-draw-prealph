// Import React.
import type React from "react";
import { memo } from "react";

// Import types.
import type { InputProps } from "../../../types/props/elements/InputProps";
import { nanToZero } from "../../../utils/math/common/nanToZero";

/**
 * Input minimap component (simplified version for minimap)
 */
const InputMinimapComponent: React.FC<InputProps> = ({
	x,
	y,
	width,
	height,
	fill,
	stroke,
	strokeWidth,
	cornerRadius,
}) => {
	return (
		<rect
			x={x - nanToZero(width / 2)}
			y={y - nanToZero(height / 2)}
			width={width}
			height={height}
			rx={cornerRadius}
			ry={cornerRadius}
			fill={fill}
			stroke={stroke}
			strokeWidth={strokeWidth}
			pointerEvents="none"
		/>
	);
};

export const InputMinimap = memo(InputMinimapComponent);
