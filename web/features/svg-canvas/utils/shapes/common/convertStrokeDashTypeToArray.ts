import type { StrokeDashType } from "../../../types/core/StrokeDashType";

/**
 * Convert StrokeDashType to SVG strokeDasharray value
 *
 * @param strokeDashType - The stroke dash type
 * @returns SVG strokeDasharray value or undefined for solid lines
 */
export const convertStrokeDashTypeToArray = (
	strokeDashType: StrokeDashType,
): string | undefined => {
	switch (strokeDashType) {
		case "dashed":
			return "8,4";
		case "dotted":
			return "2,2";
		case "solid":
		default:
			return undefined;
	}
};
