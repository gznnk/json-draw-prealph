import { DefaultSelectableState } from "../core/DefaultSelectableState";
import { ConnectPointDefaultData } from "../../data/shapes/ConnectPointDefaultData";
import type { ConnectPointState } from "../../../types/state/shapes/ConnectPointState";

export const DefaultConnectPointState = {
	...ConnectPointDefaultData,
	...DefaultSelectableState,
} as const satisfies ConnectPointState;;