import type { LLMNodeData } from "../../../types/data/nodes/LLMNodeData";
import { RectangleDefaultData } from "../shapes/RectangleDefaultData";

/**
 * Default LLM node data template.
 * Used for State to Data conversion mapping.
 */
export const LLMNodeDefaultData = {
	...RectangleDefaultData,
	type: "LLMNode",
} as const satisfies LLMNodeData;