import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultImageState } from "../../../constants/state/shapes/DefaultImageState";
import type {
	ImageData,
	ImageState,
} from "../../../types/diagrams/shapes/ImageTypes";

export const mapImageDataToState =
	createDataToStateMapper<ImageState>(DefaultImageState);

export const imageDataToState = (data: ImageData): ImageState =>
	mapImageDataToState(data);
