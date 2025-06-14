// Import base types.
import type { Point } from "./Point";

/**
 * Defines a rectangular box geometry with edge coordinates and corner points.
 * Used for determining boundaries and calculating intersection points with other elements.
 */
export type BoxGeometry = {
	top: number;
	left: number;
	right: number;
	bottom: number;
	center: Point;
	leftTop: Point;
	leftBottom: Point;
	rightTop: Point;
	rightBottom: Point;
};
