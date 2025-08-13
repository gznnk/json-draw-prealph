import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultRectangleState } from "../../../constants/state/shapes/DefaultRectangleState";
import type {
	RectangleData,
	RectangleState,
} from "../../../types/diagrams/shapes/RectangleTypes";

export const mapRectangleDataToState = createDataToStateMapper<RectangleState>(
	DefaultRectangleState,
);

export const rectangleDataToState = (data: RectangleData): RectangleState =>
	mapRectangleDataToState(data);
