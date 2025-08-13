import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { EllipseDefaultData } from "../../../constants/data/shapes/EllipseDefaultData";
import type {
	EllipseData,
	EllipseState,
} from "../../../types/diagrams/shapes/EllipseTypes";

export const mapEllipseStateToData =
	createStateToDataMapper<EllipseData>(EllipseDefaultData);

export const ellipseStateToData = (state: EllipseState): EllipseData =>
	mapEllipseStateToData(state);
