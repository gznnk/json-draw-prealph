import type React from "react";
import { memo } from "react";

import type { AiProps } from "../../../types/props/diagrams/AiProps";

/**
 * Ai minimap component (simplified version for minimap)
 */
const AiMinimapComponent: React.FC<AiProps> = ({
	x,
	y,
	width,
	height,
	avatarBgColor,
	bubbleBgColor,
}) => {
	// Simplified layout for minimap
	const avatarSize = 20;
	const padding = 3;

	const left = -width / 2;
	const top = -height / 2;

	// Avatar position
	const avatarX = 0;
	const avatarY = top + avatarSize / 2 + padding;

	// Speech bubble position
	const bubbleY = avatarY + avatarSize / 2 + padding;
	const bubbleWidth = width - padding * 2;
	const bubbleHeight = height - avatarSize - padding * 4 - 15;

	// Input position
	const inputY = top + height - 15 - padding;

	return (
		<g>
			{/* Avatar circle */}
			<circle
				cx={x + avatarX}
				cy={y + avatarY}
				r={avatarSize / 2}
				fill={avatarBgColor}
				stroke="#333"
				strokeWidth="0.5"
			/>

			{/* Speech bubble */}
			<rect
				x={x + left + padding}
				y={y + bubbleY}
				width={bubbleWidth}
				height={bubbleHeight}
				rx="3"
				ry="3"
				fill={bubbleBgColor}
				stroke="#ccc"
				strokeWidth="0.5"
			/>

			{/* Input box */}
			<rect
				x={x + left + padding}
				y={y + inputY}
				width={bubbleWidth}
				height={15}
				rx="2"
				ry="2"
				fill="#ffffff"
				stroke="#ccc"
				strokeWidth="0.5"
			/>
		</g>
	);
};

export const AiMinimap = memo(AiMinimapComponent);
