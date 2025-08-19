// Import types.
import type { DiagramFeatures } from "../../core/DiagramFeatures";
import type { CreateDataType } from "../shapes/CreateDataType";

/**
 * Diagram features for Hub nodes.
 */
export const HubNodeFeatures = {
	transformative: true,
	connectable: true,
	strokable: true,
	fillable: true,
	textable: true,
	selectable: true,
	executable: true,
} as const satisfies DiagramFeatures;

/**
 * Type of the hub node data.
 */
export type HubNodeData = CreateDataType<typeof HubNodeFeatures> & {
	type: "HubNode";
};