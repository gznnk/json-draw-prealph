import type { PathData } from "../../../types/data/shapes/PathData";
import { PathFeatures } from "../../../types/data/shapes/PathData";
import { createValidatorFromTypeAndFeatures } from "../../validation/createValidatorFromTypeAndFeatures";

const VALID_PATH_TYPES = ["Straight", "Polyline", "Curve", "Rounded"];
const VALID_ARROW_HEADS = [
	"FilledTriangle",
	"ConcaveTriangle",
	"OpenArrow",
	"HollowTriangle",
	"FilledDiamond",
	"HollowDiamond",
	"Circle",
	"None",
];

const baseValidator = createValidatorFromTypeAndFeatures("Path", PathFeatures);

/**
 * Type guard to check if data is PathData.
 *
 * @param data - The data to check
 * @returns True if the data is PathData
 */
export const isPathData = (data: unknown): data is PathData => {
	if (!baseValidator(data)) return false;

	const pathData = data as PathData;

	if (!VALID_PATH_TYPES.includes(pathData.pathType)) return false;

	if (
		pathData.startArrowHead &&
		!VALID_ARROW_HEADS.includes(pathData.startArrowHead)
	) {
		return false;
	}

	if (
		pathData.endArrowHead &&
		!VALID_ARROW_HEADS.includes(pathData.endArrowHead)
	) {
		return false;
	}

	return true;
};
