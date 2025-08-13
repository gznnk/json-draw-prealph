import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { SvgDefaultData } from "../../../constants/data/shapes/SvgDefaultData";
import type {
	SvgData,
	SvgState,
} from "../../../types/diagrams/shapes/SvgTypes";

export const mapSvgStateToData =
	createStateToDataMapper<SvgData>(SvgDefaultData);

export const svgStateToData = (state: SvgState): SvgData =>
	mapSvgStateToData(state);
