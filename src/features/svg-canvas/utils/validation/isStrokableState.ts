// Import types.
import type { StrokableState } from "../../types/diagrams/core/StrokableTypes";

/**
 * Check if an object is StrokableState.
 *
 * @param obj - The object to check
 * @returns True if the object is StrokableState, false otherwise
 */
export const isStrokableState = (obj: unknown): obj is StrokableState => {
	return (
		obj !== null &&
		typeof obj === "object" &&
		"stroke" in obj &&
		"strokeWidth" in obj &&
		typeof (obj as StrokableState).stroke === "string" &&
		typeof (obj as StrokableState).strokeWidth === "string"
	);
};
