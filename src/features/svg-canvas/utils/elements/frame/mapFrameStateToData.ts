import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { FrameDefaultData } from "../../../constants/data/elements/FrameDefaultData";
import type { FrameData } from "../../../types/data/elements/FrameData";
import type { FrameState } from "../../../types/state/elements/FrameState";

export const mapFrameStateToData = createStateToDataMapper<FrameData>(
	FrameDefaultData,
);

export const frameStateToData = (state: FrameState): FrameData =>
	mapFrameStateToData(state);