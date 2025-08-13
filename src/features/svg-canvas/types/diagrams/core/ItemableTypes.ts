// Import types.
import type { DiagramChangeEvent } from "../../events/DiagramChangeEvent";

/**
 * Interface for diagram elements that can contain child elements.
 * Used for composite elements like groups that can hold other diagrams.
 *
 * Note: Using type parameter T to avoid circular references.
 */
export type ItemableData<T = unknown> = {
	items: T[];
};

/**
 * State type for elements that can contain child elements.
 * Since ItemableData has no non-persistent keys, this directly extends the data type.
 */
export type ItemableState<T = unknown> = ItemableData<T>;

/**
 * Props for having child diagrams component.
 *
 * @property {function} onDiagramChange - Event handler for diagram change.
 *                                        Trigger this handler when notifying changes in the properties of a diagram.
 */
export type ItemableProps = {
	onDiagramChange?: (e: DiagramChangeEvent) => void;
};
