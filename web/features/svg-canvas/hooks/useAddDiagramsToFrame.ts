import { useCallback } from "react";

import { ADD_DIAGRAMS_TO_FRAME_EVENT_NAME } from "../constants/core/EventNames";
import { useEventBus } from "../context/EventBusContext";
import type { AddDiagramsToFrameEvent } from "../types/events/AddDiagramsToFrameEvent";
import type { Diagram } from "../types/state/core/Diagram";
import { newEventId } from "../utils/core/newEventId";

/**
 * Hook for adding multiple diagrams to a CanvasFrame via drag and drop.
 * Dispatches AddDiagramsToFrameEvent to the event bus.
 */
export const useAddDiagramsToFrame = () => {
	// Get EventBus instance from context
	const eventBus = useEventBus();

	// Function to dispatch a new AddDiagramsToFrameEvent
	return useCallback(
		(targetFrameId: string, diagrams: Diagram[]) => {
			const event: AddDiagramsToFrameEvent = {
				eventId: newEventId(),
				targetFrameId,
				diagrams,
			};

			// Dispatch the AddDiagramsToFrameEvent to the EventBus
			eventBus.dispatchEvent(
				new CustomEvent(ADD_DIAGRAMS_TO_FRAME_EVENT_NAME, { detail: event }),
			);
		},
		[eventBus],
	);
};
