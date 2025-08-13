import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultPathState } from "../../../constants/state/shapes/DefaultPathState";
import type {
	PathData,
	PathState,
} from "../../../types/diagrams/shapes/PathTypes";

export const mapPathDataToState =
	createDataToStateMapper<PathState>(DefaultPathState);

export const pathDataToState = (data: PathData): PathState =>
	mapPathDataToState(data);
