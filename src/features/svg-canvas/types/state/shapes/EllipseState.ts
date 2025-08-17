// Import types.
import type {
	EllipseData,
	EllipseFeatures,
} from "../../data/shapes/EllipseData";
import type { CreateStateType } from "./CreateStateType";

/**
 * State type for ellipse shapes.
 */
export type EllipseState = CreateStateType<EllipseData, typeof EllipseFeatures>;
