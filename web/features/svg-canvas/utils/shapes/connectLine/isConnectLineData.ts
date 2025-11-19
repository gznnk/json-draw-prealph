import type { ConnectLineData } from "../../../types/data/shapes/ConnectLineData";
import { ConnectLineFeatures } from "../../../types/data/shapes/ConnectLineData";
import { createValidatorFromTypeAndFeatures } from "../../validation/createValidatorFromTypeAndFeatures";
import { isBoolean, isString } from "../../../../../shared/validation";

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

const baseValidator = createValidatorFromTypeAndFeatures(
	"ConnectLine",
	ConnectLineFeatures,
);

/**
 * Type guard to check if data is ConnectLineData.
 *
 * @param data - The data to check
 * @returns True if the data is ConnectLineData
 */
export const isConnectLineData = (data: unknown): data is ConnectLineData => {
	if (!baseValidator(data)) return false;

	const lineData = data as ConnectLineData;

	if (!VALID_PATH_TYPES.includes(lineData.pathType)) return false;
	if (!isString(lineData.startOwnerId)) return false;
	if (!isString(lineData.endOwnerId)) return false;
	if (!isBoolean(lineData.autoRouting)) return false;

	if (
		lineData.startArrowHead &&
		!VALID_ARROW_HEADS.includes(lineData.startArrowHead)
	) {
		return false;
	}

	if (
		lineData.endArrowHead &&
		!VALID_ARROW_HEADS.includes(lineData.endArrowHead)
	) {
		return false;
	}

	return true;
};
