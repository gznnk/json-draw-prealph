import { FillableDefaultData } from "../../data/core/FillableDefaultData";
import type { FillableState } from "../../../types/diagrams/core/FillableTypes";

export const DefaultFillableState = {
	...FillableDefaultData,
} as const satisfies FillableState;
