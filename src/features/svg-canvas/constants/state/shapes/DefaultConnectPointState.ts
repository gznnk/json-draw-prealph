import { DefaultDiagramBaseState } from "../core/DefaultDiagramBaseState";
import { DefaultSelectableState } from "../core/DefaultSelectableState";
import type { ConnectPointState } from "../../../types/diagrams/shapes/ConnectTypes";

export const DefaultConnectPointState = {
	...DefaultDiagramBaseState,
	...DefaultSelectableState,
	type: "ConnectPoint",
	name: "",
} as const satisfies ConnectPointState;
