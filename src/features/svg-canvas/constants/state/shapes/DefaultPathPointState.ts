import { PathPointDefaultData } from "../../data/shapes/PathPointDefaultData";
import type { PathPointState } from "../../../types/state/shapes/PathPointState";

export const DefaultPathPointState = {
	...PathPointDefaultData,
} as const satisfies PathPointState;;
