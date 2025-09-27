import { useCallback } from "react";

import { APPEND_SELECTED_DIAGRAMS_EVENT_NAME } from "../constants/core/EventNames";
import { useEventBus } from "../context/EventBusContext";
import type { AppendSelectedDiagramsEvent } from "../types/events/AppendSelectedDiagramsEvent";
import { newEventId } from "../utils/core/newEventId";

/**
 * Hook for appending currently selected diagrams to a target via drag and drop.
 * Dispatches AppendSelectedDiagramsEvent to the event bus.
 * Selected diagrams are automatically retrieved from canvas state.
 */
export const useAppendSelectedDiagrams = () => {
	// Get EventBus instance from context
	const eventBus = useEventBus();

	// Function to dispatch a new AppendSelectedDiagramsEvent
	return useCallback(
		(targetId: string) => {
			const event: AppendSelectedDiagramsEvent = {
				eventId: newEventId(),
				targetId,
			};

			// Dispatch the AppendSelectedDiagramsEvent to the EventBus
			eventBus.dispatchEvent(
				new CustomEvent(APPEND_SELECTED_DIAGRAMS_EVENT_NAME, { detail: event }),
			);
		},
		[eventBus],
	);
};