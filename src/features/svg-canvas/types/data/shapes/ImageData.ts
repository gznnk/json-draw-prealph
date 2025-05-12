import type { CreateDataType } from "./CreateDataType";

/**
 * Data type for Image component.
 * Contains properties specific to image elements including base64 encoded image data.
 */
export type ImageData = CreateDataType<{
	selectable: true;
	transformative: true;
}> & {
	base64Data: string;
};
