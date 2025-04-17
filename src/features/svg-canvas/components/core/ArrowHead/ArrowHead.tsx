// Import React.
import type React from "react";
import { memo } from "react";

// Import functions related to SvgCanvas.
import { createSvgTransform } from "../../../utils/Diagram";

// Imports related to this component.
import { ARROW_HEAD_SIZE } from "./ArrowHeadConstants";
import type { ArrowHeadType } from "./ArrowHeadTypes";

/**
 * Props for ArrowHead component.
 */
type ArrowHeadProps = {
	type: ArrowHeadType;
	x: number;
	y: number;
	color: string;
	radians: number;
};

/**
 * ArrowHead component.
 */
const ArrowHeadComponent: React.FC<ArrowHeadProps> = ({
	type,
	x,
	y,
	color,
	radians,
}) => {
	if (type === "None") return null;

	let points = undefined;
	if (type === "Triangle") {
		points = `0,0 ${ARROW_HEAD_SIZE / 2},${-ARROW_HEAD_SIZE} ${-ARROW_HEAD_SIZE / 2},${-ARROW_HEAD_SIZE}`;
	} else if (type === "ConcaveTriangle") {
		points = `0,0 ${ARROW_HEAD_SIZE / 2},${-ARROW_HEAD_SIZE} 0,${-ARROW_HEAD_SIZE * 0.86} ${-ARROW_HEAD_SIZE / 2},${-ARROW_HEAD_SIZE}`;
	}

	const transform = createSvgTransform(1, 1, radians, x, y);

	return <polygon points={points} fill={color} transform={transform} />;
};

export const ArrowHead = memo(ArrowHeadComponent);
