// Import types related to SvgCanvas.
import type { RectangleData } from "../shapes/RectangleData";
import type { DiagramFeatures } from "../../core/DiagramFeatures";

/**
 * Diagram features for LLM nodes.
 */
export const LLMNodeFeatures = {
	transformative: true,
	connectable: true,
	strokable: true,
	fillable: true,
	textable: true,
	selectable: true,
	executable: true,
} as const satisfies DiagramFeatures;

/**
 * Type of the LLM node data.
 */
export type LLMNodeData = Omit<RectangleData, "type"> & {
	type: "LLMNode";
};
