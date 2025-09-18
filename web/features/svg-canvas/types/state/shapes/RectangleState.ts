// Import types.
import type {
	RectangleData,
	RectangleFeatures,
} from "../../data/shapes/RectangleData";
import type { CreateStateType } from "./CreateStateType";

/**
 * State type for rectangle shapes.
 * Contains properties specific to rectangular diagram elements.
 */
export type RectangleState = CreateStateType<
	RectangleData,
	typeof RectangleFeatures
>;
