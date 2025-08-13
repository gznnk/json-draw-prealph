// Import types.
import type { Shape } from "../../core/Shape";
import type { DiagramTransformEvent } from "../../events/DiagramTransformEvent";

/**
 * Interface for diagram elements that can be resized, rotated, and repositioned.
 * Extends the Shape interface with additional transformation properties.
 */
export type TransformativeData = Shape & {
	keepProportion: boolean;
};

/**
 * Interface for diagram elements that can be resized, rotated, and repositioned.
 * Extends base data with runtime state that should not be persisted.
 */
export type TransformativeState = TransformativeData & {
	showTransformControls: boolean;
	isTransforming: boolean;
};

/**
 * Properties for transformable diagram elements.
 * Provides event handlers for transformation operations like resizing and rotation.
 */
export type TransformativeProps = {
	onTransform?: (e: DiagramTransformEvent) => void;
};
