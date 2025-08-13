import type {
	CreateDataType,
	CreateDiagramProps,
	CreateStateType,
} from "./CreateDiagramTypes";

/**
 * Data type for Image component.
 * Contains properties specific to image elements including base64 encoded image data.
 */
export type ImageData = CreateDataType<{
	transformative: true;
}> & {
	base64Data: string;
};

/**
 * State type for Image component.
 * Contains properties specific to image elements including base64 encoded image data.
 */
export type ImageState = CreateStateType<
	ImageData,
	{
		selectable: true;
		transformative: true;
	}
>;

/**
 * Props for the Image component.
 */
export type ImageProps = CreateDiagramProps<
	ImageState,
	{
		selectable: true;
		transformative: true;
	}
>;
