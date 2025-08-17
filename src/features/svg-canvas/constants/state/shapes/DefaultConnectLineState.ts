import { DefaultSelectableState } from "../core/DefaultSelectableState";
import { DefaultTransformativeState } from "../core/DefaultTransformativeState";
import { ConnectLineDefaultData } from "../../data/shapes/ConnectLineDefaultData";
import type { ConnectLineState } from "../../../types/state/shapes/ConnectLineState";

export const DefaultConnectLineState = {
	...ConnectLineDefaultData,
	...DefaultSelectableState,
	...DefaultTransformativeState,
} as const satisfies ConnectLineState;;