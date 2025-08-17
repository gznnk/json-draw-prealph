import { DefaultSelectableState } from "../core/DefaultSelectableState";
import { DefaultTransformativeState } from "../core/DefaultTransformativeState";
import { PathDefaultData } from "../../data/shapes/PathDefaultData";
import type { PathState } from "../../../types/state/shapes/PathState";

export const DefaultPathState = {
	...PathDefaultData,
	...DefaultSelectableState,
	...DefaultTransformativeState,
} as const satisfies PathState;;