// Import types.
import type { PathData, PathFeatures } from "../../data/shapes/PathData";
import type { CreateStateType } from "./CreateStateType";

/**
 * State type for polyline/path elements.
 */
export type PathState = CreateStateType<PathData, typeof PathFeatures>;
