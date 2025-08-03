import type { TextAreaNodeData } from "../../../types/data/nodes/TextAreaNodeData";
import { RectangleDefaultData } from "../shapes/RectangleDefaultData";

/**
 * Default text area node data template.
 * Used for State to Data conversion mapping.
 */
export const TextAreaNodeDefaultData = {
	...RectangleDefaultData,
	type: "TextAreaNode",
} as const satisfies TextAreaNodeData;