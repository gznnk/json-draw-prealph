// Import React.
import type React from "react";
import { useRef } from "react";

// Import types.
import type { DiagramType } from "../types/base/DiagramType";
import type { DiagramPointerEvent } from "../types/events/DiagramPointerEvent";

// Import utils.
import { newEventId } from "../utils/common/newEventId";

/**
 * Type definition for select props
 */
export type SelectProps = {
	id: string;
	type?: DiagramType;
	onSelect?: (e: DiagramPointerEvent) => void;
};

/**
 * Custom hook to handle selection events
 *
 * @param {SelectProps} props Select props
 * @param {string} props.id ID of the element to be selectable
 * @param {DiagramType} [props.type] Type of diagram
 * @param {(e: DiagramPointerEvent) => void} [props.onSelect] Event handler for selection
 */
export const useSelect = (props: SelectProps) => {
	const { id, onSelect } = props;

	// Flag whether pointer is pressed down in this select area
	const isPointerDown = useRef(false);

	/**
	 * Pointer down event handler within the select area
	 */
	const handlePointerDown = (e: React.PointerEvent<SVGElement>): void => {
		if (e.button !== 0) {
			// Do nothing for non-left clicks
			return;
		}

		// Process the event only if the ID of the element where the pointer event occurred matches the ID of this select area
		if ((e.target as HTMLElement).id === id) {
			// Set the flag that the pointer is pressed
			isPointerDown.current = true;

			// Fire select event
			onSelect?.({
				eventId: newEventId(),
				id,
			});
		}
	};
	/**
	 * Pointer up event handler within the select area
	 */
	const handlePointerUp = (): void => {
		// Clear flag
		isPointerDown.current = false;
	};

	return {
		onPointerDown: handlePointerDown,
		onPointerUp: handlePointerUp,
	};
};
