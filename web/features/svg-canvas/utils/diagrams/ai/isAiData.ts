/**
 * Validation function for Ai diagram data.
 */

import {
	isCssColor,
	isObject,
	isString,
} from "../../../../../shared/validation";
import { AiFeatures } from "../../../types/data/diagrams/AiData";
import { createValidatorFromFeatures } from "../../validation/createValidatorFromFeatures";

/**
 * Check if data is valid Ai diagram data.
 * Uses the base validator from features and adds Ai-specific validations.
 */
export const isAiData = (data: unknown): boolean => {
	// Base validation from features
	const baseValidator = createValidatorFromFeatures(AiFeatures);
	if (!baseValidator(data)) return false;

	if (!isObject(data)) return false;

	// Ai-specific validations
	// avatarUrl is optional (if present, must be string)
	if ("avatarUrl" in data && data.avatarUrl !== undefined) {
		if (!isString(data.avatarUrl)) return false;
	}

	// avatarBgColor is required and must be valid color
	if (!("avatarBgColor" in data) || !isCssColor(data.avatarBgColor))
		return false;

	// bubbleBgColor is required and must be valid color
	if (!("bubbleBgColor" in data) || !isCssColor(data.bubbleBgColor))
		return false;

	// aiMessage is required and must be string
	if (!("aiMessage" in data) || !isString(data.aiMessage)) return false;

	return true;
};
