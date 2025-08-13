import { DiagramBaseDefaultData } from "../../data/core/DiagramBaseDefaultData";
import type { DiagramBaseState } from "../../../types/diagrams/core/DiagramBaseTypes";

export const DefaultDiagramBaseState = {
	...DiagramBaseDefaultData,
} as const satisfies DiagramBaseState;
