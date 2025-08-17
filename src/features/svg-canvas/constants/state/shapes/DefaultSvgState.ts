import { DefaultSelectableState } from "../core/DefaultSelectableState";
import { DefaultTransformativeState } from "../core/DefaultTransformativeState";
import { SvgDefaultData } from "../../data/shapes/SvgDefaultData";
import type { SvgState } from "../../../types/state/shapes/SvgState";

export const DefaultSvgState = {
	...SvgDefaultData,
	...DefaultSelectableState,
	...DefaultTransformativeState,
} as const satisfies SvgState;;