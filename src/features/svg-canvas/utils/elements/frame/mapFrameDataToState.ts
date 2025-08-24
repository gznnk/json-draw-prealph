import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { FrameDefaultState } from "../../../constants/state/elements/FrameDefaultState";
import type { FrameData } from "../../../types/data/elements/FrameData";
import type { FrameState } from "../../../types/state/elements/FrameState";

export const mapFrameDataToState = createDataToStateMapper<FrameState>(
	FrameDefaultState,
);

export const frameDataToState = (data: FrameData): FrameState =>
	mapFrameDataToState(data);