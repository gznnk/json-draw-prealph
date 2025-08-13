import { TextableDefaultData } from "../../data/core/TextableDefaultData";
import type { TextableState } from "../../../types/diagrams/core/TextableTypes";

export const DefaultTextableState = {
	...TextableDefaultData,
	isTextEditing: false,
} as const satisfies TextableState;
