/**
 * Types of diagram transformation operations.
 * Defines the specific kind of transformation being performed on a diagram element.
 */
export type TransformationType =
	| "Resize" // Resizing the element (scaling width/height)
	| "Rotation"; // Rotating the element around its center
