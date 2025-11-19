import {
	isCssColor,
	isNonNegativeNumber,
	isObject,
	isString,
} from "../../../../shared/validation";
import type { TextableData } from "../../types/data/core/TextableData";

/**
 * Check if data has valid text properties (textable feature).
 */
export const isTextableData = (data: unknown): data is TextableData => {
	if (!isObject(data)) return false;

	return (
		"text" in data &&
		isString(data.text) &&
		"textType" in data && // TODO: Further validation of textType can be added here
		"textAlign" in data && // TODO: Further validation of textAlign can be added here
		"verticalAlign" in data && // TODO: Further validation of verticalAlign can be added here
		"fontColor" in data &&
		isCssColor(data.fontColor) &&
		"fontSize" in data &&
		isNonNegativeNumber(data.fontSize) &&
		"fontFamily" in data &&
		isString(data.fontFamily) &&
		"fontWeight" in data &&
		isString(data.fontWeight)
	);
};
