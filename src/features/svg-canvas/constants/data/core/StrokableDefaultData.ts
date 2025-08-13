import type { StrokableData } from "../../../types/diagrams/core/StrokableTypes";

/**
 * Default strokable data template.
 * Used for State to Data conversion mapping.
 */
export const StrokableDefaultData = {
	stroke: "transparent",
	strokeWidth: "0",
} as const satisfies StrokableData;
