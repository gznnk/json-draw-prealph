import { ItemableDefaultData } from "../../data/core/ItemableDefaultData";
import type { Diagram } from "../../../types/diagrams/catalog/DiagramTypes";
import type { ItemableState } from "../../../types/diagrams/core/ItemableTypes";

export const DefaultItemableState = {
	...ItemableDefaultData,
} as const satisfies ItemableState<Diagram>;
