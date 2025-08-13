import type { ItemableData } from "../../../types/diagrams/core/ItemableTypes";

/**
 * Default itemable data template.
 * Used for State to Data conversion mapping.
 */
export const ItemableDefaultData = {
	items: [],
} as const satisfies ItemableData;
