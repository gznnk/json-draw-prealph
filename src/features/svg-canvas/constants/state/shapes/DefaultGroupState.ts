import { DefaultSelectableState } from "../core/DefaultSelectableState";
import { DefaultTransformativeState } from "../core/DefaultTransformativeState";
import { GroupDefaultData } from "../../data/shapes/GroupDefaultData";
import type { GroupState } from "../../../types/state/shapes/GroupState";

export const DefaultGroupState = {
	...GroupDefaultData,
	...DefaultSelectableState,
	...DefaultTransformativeState,
} as const satisfies GroupState;;