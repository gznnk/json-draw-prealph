// Import types.
import type { RectangleFeatures } from "../../data/shapes/RectangleData";
import type { RectangleState } from "../../state/shapes/RectangleState";
import type { CreateDiagramProps } from "./CreateDiagramProps";

/**
 * Props for Rectangle component
 */
export type RectangleProps = CreateDiagramProps<
	RectangleState,
	typeof RectangleFeatures
>;
