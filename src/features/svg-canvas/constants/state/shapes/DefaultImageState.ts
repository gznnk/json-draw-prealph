import { DefaultDiagramBaseState } from "../core/DefaultDiagramBaseState";
import { DefaultSelectableState } from "../core/DefaultSelectableState";
import { DefaultTransformativeState } from "../core/DefaultTransformativeState";
import type { ImageState } from "../../../types/diagrams/shapes/ImageTypes";

export const DefaultImageState = {
	...DefaultDiagramBaseState,
	...DefaultSelectableState,
	...DefaultTransformativeState,
	type: "Image",
	base64Data: "",
} as const satisfies ImageState;
