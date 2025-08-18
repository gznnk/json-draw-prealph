// Import types.
import type { TextAreaNodeData } from "../../../types/data/nodes/TextAreaNodeData";
import { TextAreaNodeFeatures } from "../../../types/data/nodes/TextAreaNodeData";

// Import helpers.
import { CreateDefaultData } from "../shapes/CreateDefaultData";

/**
 * Default text area node data template.
 * Generated using Features definition and CreateDefaultData helper.
 */
export const TextAreaNodeDefaultData = CreateDefaultData<TextAreaNodeData>({
	type: "TextAreaNode",
	options: TextAreaNodeFeatures,
	properties: {},
});