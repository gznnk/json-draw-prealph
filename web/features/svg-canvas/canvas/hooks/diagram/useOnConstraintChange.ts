import { useEffect, useRef } from "react";

import { CONSTRAINT_CHANGE_EVENT_NAME } from "../../../constants/core/EventNames";
import type { DiagramConstraintChangeEvent } from "../../../types/events/DiagramConstraintChangeEvent";
import type { SvgCanvasSubHooksProps } from "../../types/SvgCanvasSubHooksProps";
import { applyFunctionRecursively } from "../../utils/applyFunctionRecursively";
import { useAddHistory } from "../history/useAddHistory";

/**
 * Custom hook to handle diagram constraint change events from the event bus.
 * Listens for constraint change events and updates the canvas state accordingly.
 */
export const useOnConstraintChange = (props: SvgCanvasSubHooksProps) => {
	const { eventBus, setCanvasState } = props;
	const addHistory = useAddHistory(props);

	const refBusVal = {
		eventBus,
		setCanvasState,
		addHistory,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	useEffect(() => {
		const { eventBus } = refBus.current;

		const handleEvent = (event: Event) => {
			const e = (event as CustomEvent<DiagramConstraintChangeEvent>).detail;
			const { setCanvasState, addHistory } = refBus.current;

			setCanvasState((prevState) => {
				// Update items with constraint changes.
				const items = applyFunctionRecursively(prevState.items, (item) => {
					// If the id does not match, return the original item.
					if (item.id !== e.id) return item;

					// Extract constraint properties from the event.
					const { eventId: _eventId, id: _id, ...constraintChanges } = e;

					// If the id matches, update the item with the new constraint properties.
					return { ...item, ...constraintChanges };
				});

				// Create new state with updated items.
				let newState = {
					...prevState,
					items,
				};

				// Add history
				newState = addHistory(e.eventId, newState);

				return newState;
			});
		};

		eventBus.addEventListener(CONSTRAINT_CHANGE_EVENT_NAME, handleEvent);
		return () => {
			eventBus.removeEventListener(CONSTRAINT_CHANGE_EVENT_NAME, handleEvent);
		};
	}, []);
};
