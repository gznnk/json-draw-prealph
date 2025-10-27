import { useRef, useEffect } from "react";

import { STYLE_CHANGE_EVENT_NAME } from "../../../constants/core/EventNames";
import type { DiagramStyleChangeEvent } from "../../../types/events/DiagramStyleChangeEvent";
import type { SvgCanvasSubHooksProps } from "../../types/SvgCanvasSubHooksProps";
import { applyFunctionRecursively } from "../../utils/applyFunctionRecursively";
import { useAddHistory } from "../history/useAddHistory";

/**
 * Custom hook to handle diagram style change events on the canvas.
 * Listens to STYLE_CHANGE_EVENT_NAME from the event bus and applies style changes.
 */
export const useOnStyleChange = (props: SvgCanvasSubHooksProps) => {
	const { eventBus, setCanvasState } = props;

	// Get the data change handler.
	const addHistory = useAddHistory(props);

	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		eventBus,
		setCanvasState,
		addHistory,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	// Listen to style change events from the event bus
	useEffect(() => {
		const { eventBus } = refBus.current;

		const handleEvent = (event: Event) => {
			const customEvent = event as CustomEvent<DiagramStyleChangeEvent>;
			const e = customEvent.detail;

			// Bypass references to avoid function creation in every render.
			const { setCanvasState, addHistory } = refBus.current;

			setCanvasState((prevState) => {
				// Update items with style changes.
				const items = applyFunctionRecursively(prevState.items, (item) => {
					// If the id does not match, return the original item.
					if (item.id !== e.id) return item;

					// If the id matches, update the item with the new style properties from event data.
					return { ...item, ...e.data };
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

		eventBus.addEventListener(STYLE_CHANGE_EVENT_NAME, handleEvent);

		return () => {
			eventBus.removeEventListener(STYLE_CHANGE_EVENT_NAME, handleEvent);
		};
	}, []);
};
