import { isBoolean, isObject } from "../../../../shared/validation";
import type { SelectableState } from "../../types/state/core/SelectableState";

/**
 * Check if an object is SelectableState.
 *
 * @param obj - The object to check
 * @returns True if the object is SelectableState, false otherwise
 */
export const isSelectableState = (obj: unknown): obj is SelectableState => {
	if (!isObject(obj)) {
		return false;
	}
	if (!("isSelected" in obj) || !isBoolean(obj.isSelected)) {
		return false;
	}
	if (!("showOutline" in obj) || !isBoolean(obj.showOutline)) {
		return false;
	}

	if (
		"isRootSelected" in obj &&
		obj.isRootSelected !== undefined &&
		!isBoolean(obj.isRootSelected)
	) {
		return false;
	}

	if (
		"isAncestorSelected" in obj &&
		obj.isAncestorSelected !== undefined &&
		!isBoolean(obj.isAncestorSelected)
	) {
		return false;
	}

	if (
		"outlineDisabled" in obj &&
		obj.outlineDisabled !== undefined &&
		!isBoolean(obj.outlineDisabled)
	) {
		return false;
	}

	return true;
};
