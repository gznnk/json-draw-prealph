import { DefaultSelectableState } from "../core/DefaultSelectableState";
import { DefaultTransformativeState } from "../core/DefaultTransformativeState";
import { ImageDefaultData } from "../../data/shapes/ImageDefaultData";
import type { ImageState } from "../../../types/state/shapes/ImageState";

export const DefaultImageState = {
	...ImageDefaultData,
	...DefaultSelectableState,
	...DefaultTransformativeState,
} as const satisfies ImageState;;