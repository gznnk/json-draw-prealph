import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { PathDefaultData } from "../../../constants/data/shapes/PathDefaultData";
import type {
	PathData,
	PathState,
} from "../../../types/diagrams/shapes/PathTypes";

export const mapPathStateToData =
	createStateToDataMapper<PathData>(PathDefaultData);

export const pathStateToData = (state: PathState): PathData =>
	mapPathStateToData(state);
