// Import types.
import type { EllipseFeatures } from "../../data/shapes/EllipseData";
import type { EllipseState } from "../../state/shapes/EllipseState";
import type { CreateDiagramProps } from "./CreateDiagramProps";

/**
 * Props for Ellipse component
 */
export type EllipseProps = CreateDiagramProps<
	EllipseState,
	typeof EllipseFeatures
>;
