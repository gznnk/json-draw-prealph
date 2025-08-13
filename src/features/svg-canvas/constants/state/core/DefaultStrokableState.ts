import { StrokableDefaultData } from "../../data/core/StrokableDefaultData";
import type { StrokableState } from "../../../types/diagrams/core/StrokableTypes";

export const DefaultStrokableState = {
	...StrokableDefaultData,
} as const satisfies StrokableState;
