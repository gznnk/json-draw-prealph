import { useCallback } from "react";

import { EXTRACT_SELECTED_DIAGRAMS_TO_TOP_LEVEL_EVENT_NAME } from "../constants/core/EventNames";
import { useEventBus } from "../context/EventBusContext";
import type { ExtractSelectedDiagramsToTopLevelEvent } from "../types/events/ExtractSelectedDiagramsToTopLevelEvent";
import { newEventId } from "../utils/core/newEventId";

/**
 * Hook for extracting currently selected diagrams to the top level.
 * This is used when items are dragged out of a CanvasFrame and dropped outside.
 * Dispatches ExtractSelectedDiagramsToTopLevelEvent to the event bus.
 */
export const useExtractSelectedDiagramsToTopLevel = () => {
	// Get EventBus instance from context
	const eventBus = useEventBus();

	// Function to dispatch a new ExtractSelectedDiagramsToTopLevelEvent
	return useCallback(() => {
		const event: ExtractSelectedDiagramsToTopLevelEvent = {
			eventId: newEventId(),
		};

		// Dispatch the ExtractSelectedDiagramsToTopLevelEvent to the EventBus
		eventBus.dispatchEvent(
			new CustomEvent(EXTRACT_SELECTED_DIAGRAMS_TO_TOP_LEVEL_EVENT_NAME, {
				detail: event,
			}),
		);
	}, [eventBus]);
};
