import type { ConnectableData } from "../../../types/diagrams/shapes/ConnectableData";

/**
 * Default connectable data template.
 * Used for State to Data conversion mapping.
 */
export const ConnectableDefaultData = {
	connectPoints: [],
} as const satisfies ConnectableData;
