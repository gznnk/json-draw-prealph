// Import types.
import type { Point } from "../../../types/core/Point";

/**
 * Applies an inverse affine transformation to a point.
 * Used to convert transformed coordinates back to original coordinates.
 *
 * @param px - X-coordinate of the transformed point
 * @param py - Y-coordinate of the transformed point
 * @param sx - Scale factor in x-direction from the original transformation
 * @param sy - Scale factor in y-direction from the original transformation
 * @param theta - Rotation angle in radians from the original transformation
 * @param tx - Translation distance in x-direction from the original transformation
 * @param ty - Translation distance in y-direction from the original transformation
 * @returns The original point before transformation
 */
export const inverseAffineTransformation = (
	px: number,
	py: number,
	sx: number,
	sy: number,
	theta: number,
	tx: number,
	ty: number,
): Point => {
	// Calculate inverse matrix for scaling and rotation
	const inverseTransformationMatrix = [
		[Math.cos(theta) / sx, Math.sin(theta) / sx],
		[-Math.sin(theta) / sy, Math.cos(theta) / sy],
	];

	// Inverse vector for translation
	const inverseTranslationVector = [-tx, -ty];

	// Coordinate vector after transformation
	const transformedVector = [px, py];

	// Apply inverse transformation for translation
	const translatedVector = [
		transformedVector[0] + inverseTranslationVector[0],
		transformedVector[1] + inverseTranslationVector[1],
	];

	// Apply inverse affine transformation
	const originalVector = [
		inverseTransformationMatrix[0][0] * translatedVector[0] +
			inverseTransformationMatrix[0][1] * translatedVector[1],
		inverseTransformationMatrix[1][0] * translatedVector[0] +
			inverseTransformationMatrix[1][1] * translatedVector[1],
	];

	return { x: originalVector[0], y: originalVector[1] };
};
