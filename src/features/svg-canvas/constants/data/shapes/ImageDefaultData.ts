import type { ImageData } from "../../../types/diagrams/shapes/ImageTypes";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";

/**
 * Default image data template.
 * Used for State to Data conversion mapping.
 */
export const ImageDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	type: "Image",
	base64Data: "",
} as const satisfies ImageData;
