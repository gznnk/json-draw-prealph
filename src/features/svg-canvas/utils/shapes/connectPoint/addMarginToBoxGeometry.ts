import type { BoxGeometry } from "../../../types/base/BoxGeometry";
import { CONNECT_LINE_MARGIN } from "../../../components/shapes/ConnectPoint/ConnectPoint/ConnectPointConstants";

/**
 * Adds margin to a box geometry and returns a new box geometry with expanded boundaries.
 *
 * @param boxGeometry - The box geometry to add margin to
 * @returns A new box geometry with added margin
 */
export const addMarginToBoxGeometry = (
	boxGeometry: BoxGeometry,
): BoxGeometry => {
	const left = boxGeometry.left - CONNECT_LINE_MARGIN;
	const top = boxGeometry.top - CONNECT_LINE_MARGIN;
	const right = boxGeometry.right + CONNECT_LINE_MARGIN;
	const bottom = boxGeometry.bottom + CONNECT_LINE_MARGIN;
	return {
		top,
		left,
		right,
		bottom,
		center: boxGeometry.center,
		leftTop: { x: left, y: top },
		leftBottom: { x: left, y: bottom },
		rightTop: { x: right, y: top },
		rightBottom: { x: right, y: bottom },
	};
};
