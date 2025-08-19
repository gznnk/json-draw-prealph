// Import types.
import type { DiagramFeatures } from "../../core/DiagramFeatures";
import type { CreateDataType } from "./CreateDataType";

/**
 * Diagram features for Image shapes.
 */
export const ImageFeatures = {
	transformative: true,
	selectable: true,
} as const satisfies DiagramFeatures;

/**
 * Data type for Image component.
 */
export type ImageData = CreateDataType<typeof ImageFeatures> & {
	base64Data: string;
};
