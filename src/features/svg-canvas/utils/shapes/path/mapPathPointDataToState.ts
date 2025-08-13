import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultPathPointState } from "../../../constants/state/shapes/DefaultPathPointState";
import type {
	PathPointData,
	PathPointState,
} from "../../../types/diagrams/shapes/PathTypes";

export const mapPathPointDataToState = createDataToStateMapper<PathPointState>(
	DefaultPathPointState,
);

export const pathPointDataToState = (data: PathPointData): PathPointState =>
	mapPathPointDataToState(data);
