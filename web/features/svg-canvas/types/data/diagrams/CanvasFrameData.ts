import type { DiagramFeatures } from "../../core/DiagramFeatures";
import type { CreateDataType } from "../shapes/CreateDataType";

/**
 * Diagram features for CanvasFrame diagrams.
 */
export const CanvasFrameFeatures = {
	frameable: true,
	transformative: true,
	itemable: true,
	cornerRoundable: false,
	selectable: true,
	connectable: true,
	fillable: false,
	strokable: false,
} as const satisfies DiagramFeatures;

/**
 * Data type for CanvasFrame diagram elements.
 * Implements selectable, transformative, and itemable behaviors to manage collections of elements.
 * Similar to Group but specifically designed for canvas frame functionality.
 */
export type CanvasFrameData = CreateDataType<typeof CanvasFrameFeatures>;
