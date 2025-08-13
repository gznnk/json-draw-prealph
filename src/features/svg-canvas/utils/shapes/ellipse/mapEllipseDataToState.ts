import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultEllipseState } from "../../../constants/state/shapes/DefaultEllipseState";
import type {
	EllipseData,
	EllipseState,
} from "../../../types/diagrams/shapes/EllipseTypes";

export const mapEllipseDataToState =
	createDataToStateMapper<EllipseState>(DefaultEllipseState);

export const ellipseDataToState = (data: EllipseData): EllipseState =>
	mapEllipseDataToState(data);
