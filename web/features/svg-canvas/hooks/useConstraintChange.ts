import { useCallback } from "react";

import { CONSTRAINT_CHANGE_EVENT_NAME } from "../constants/core/EventNames";
import { useEventBus } from "../context/EventBusContext";
import type { DiagramConstraintChangeEvent } from "../types/events/DiagramConstraintChangeEvent";

/**
 * Hook that returns a function to dispatch constraint change events via the event bus.
 * This allows components to trigger constraint changes (e.g., keepProportion) without direct coupling.
 */
export const useConstraintChange = () => {
	const eventBus = useEventBus();

	return useCallback(
		(event: DiagramConstraintChangeEvent) => {
			eventBus.dispatchEvent(
				new CustomEvent(CONSTRAINT_CHANGE_EVENT_NAME, { detail: event }),
			);
		},
		[eventBus],
	);
};
