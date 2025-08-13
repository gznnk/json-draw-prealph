import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { RectangleDefaultData } from "../../../constants/data/shapes/RectangleDefaultData";
import type {
	RectangleData,
	RectangleState,
} from "../../../types/diagrams/shapes/RectangleTypes";

export const mapRectangleStateToData =
	createStateToDataMapper<RectangleData>(RectangleDefaultData);

export const rectangleStateToData = (state: RectangleState): RectangleData =>
	mapRectangleStateToData(state);
