import type { EventPhase } from "../../types/events/EventPhase";

/**
 * Check if the event type is a history event.
 *
 * @param eventType - The type of the event to check.
 * @returns {boolean} - True if the event type is a history event, false otherwise.
 */
export const isHistoryEvent = (eventPhase: EventPhase): boolean => {
	return eventPhase === "Ended" || eventPhase === "Instant";
};
