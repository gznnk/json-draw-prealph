// Import types.
import type { ItemableState } from "../../types/diagrams/core/ItemableTypes";

/**
 * Check if an object is ItemableState.
 *
 * @param obj - The object to check
 * @returns True if the object is ItemableState, false otherwise
 */
export const isItemableState = <T = unknown>(
	obj: unknown,
): obj is ItemableState<T> => {
	return (
		obj !== null &&
		typeof obj === "object" &&
		"items" in obj &&
		Array.isArray((obj as ItemableState<T>).items)
	);
};
