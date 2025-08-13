import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { PathPointDefaultData } from "../../../constants/data/shapes/PathPointDefaultData";
import type {
	PathPointData,
	PathPointState,
} from "../../../types/diagrams/shapes/PathTypes";

export const mapPathPointStateToData =
	createStateToDataMapper<PathPointData>(PathPointDefaultData);

export const pathPointStateToData = (state: PathPointState): PathPointData =>
	mapPathPointStateToData(state);
