import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultSvgState } from "../../../constants/state/shapes/DefaultSvgState";
import type {
	SvgData,
	SvgState,
} from "../../../types/diagrams/shapes/SvgTypes";

export const mapSvgDataToState =
	createDataToStateMapper<SvgState>(DefaultSvgState);

export const svgDataToState = (data: SvgData): SvgState =>
	mapSvgDataToState(data);
