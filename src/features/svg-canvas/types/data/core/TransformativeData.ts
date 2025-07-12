// Import base types.
import type { Shape } from "../../core/Shape";

/**
 * Interface for diagram elements that can be resized, rotated, and repositioned.
 * Extends the Shape interface with additional transformation properties.
 */
export type TransformativeData = Shape & {
	showTransformControls: boolean;
	keepProportion: boolean;
	isTransforming: boolean;
};
