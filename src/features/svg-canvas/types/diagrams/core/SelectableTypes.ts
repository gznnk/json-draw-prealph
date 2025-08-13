// Import types.
import type { DiagramSelectEvent } from "../../events/DiagramSelectEvent";

/**
 * Interface for diagram elements that can be selected by the user.
 * Note: Selectable functionality is entirely runtime state, so no data type is needed.
 */

/**
 * Interface for diagram elements that can be selected by the user.
 * Provides properties to track selection state and multi-selection behavior.
 */
export type SelectableState = {
	isSelected: boolean;
	isAncestorSelected?: boolean;
	showOutline: boolean;
};

/**
 * Properties for selectable diagram components.
 * Defines event handlers for selection state changes.
 */
export type SelectableProps = {
	onSelect?: (e: DiagramSelectEvent) => void;
};
