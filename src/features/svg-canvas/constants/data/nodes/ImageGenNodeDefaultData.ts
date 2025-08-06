import type { ImageGenNodeData } from "../../../types/data/nodes/ImageGenNodeData";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";
import { ConnectableDefaultData } from "../shapes/ConnectableDefaultData";

/**
 * Default image generation node data template.
 * Used for State to Data conversion mapping.
 */
export const ImageGenNodeDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	...ConnectableDefaultData,
	type: "ImageGenNode",
} as const satisfies ImageGenNodeData;