import type { CreateDataType } from "./CreateDataType";

/**
 * Type for the data of the Image component.
 */
export type ImageData = CreateDataType<{
	selectable: true;
	transformative: true;
}> & {
	base64Data: string;
};
