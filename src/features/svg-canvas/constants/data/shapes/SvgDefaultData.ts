import type { SvgData } from "../../../types/diagrams/shapes/SvgData";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";

/**
 * Default SVG data template.
 * Used for State to Data conversion mapping.
 */
export const SvgDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	type: "Svg",
	initialWidth: 100,
	initialHeight: 100,
	svgText: "",
} as const satisfies SvgData;
