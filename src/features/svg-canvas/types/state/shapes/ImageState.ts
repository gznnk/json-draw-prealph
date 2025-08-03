import type { CreateStateType } from "./CreateStateType";
import type { ImageData } from "../../data/shapes/ImageData";

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
