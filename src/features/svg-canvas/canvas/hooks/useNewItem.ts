// Import React.
import { useCallback, useEffect, useRef } from "react";

// Import types related to SvgCanvas.
import type { NewItemEvent } from "../../types/EventTypes";
import type { CanvasHooksProps, SvgCanvasState } from "../SvgCanvasTypes";

// Import functions related to SvgCanvas.
import { isSelectableData } from "../../utils/TypeUtils";
import { addHistory } from "../SvgCanvasFunctions";

// Event name for adding a new item to the canvas.
const ADD_NEW_ITEM_EVENT_NAME = "addNewItem";

/**
 * Function to trigger a new item event on the canvas.
 * @param e - The new item event to be triggered.
 */
export const triggerNewItemEvent = (e: NewItemEvent) => {
	// Create a new event with the specified name and detail.
	const event = new CustomEvent(ADD_NEW_ITEM_EVENT_NAME, {
		detail: e,
	});
	// Dispatch the event on the window object.
	window.dispatchEvent(event);
};

/**
 * Custom hook to handle new item events on the canvas.
 */
export const useNewItem = (props: CanvasHooksProps) => {
	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	const addNewItem = useCallback((e: NewItemEvent) => {
		// Bypass references to avoid function creation in every render.
		const { setCanvasState } = refBus.current.props;

		setCanvasState((prevState) => {
			let newState = {
				...prevState,
				items: [
					...prevState.items.map((i) => {
						if (isSelectableData(i) && isSelectableData(e.item)) {
							return {
								...i,
								// If the new item is selected, unselect other items.
								isSelected: e.item.isSelected ? false : i.isSelected,
							};
						}
						return i;
					}),
					{
						...e.item,
					},
				],
			} as SvgCanvasState;

			// Add a new history entry.
			newState.lastHistoryEventId = e.eventId;
			newState = addHistory(prevState, newState);

			return newState;
		});
	}, []);

	// Use the useEffect hook to add an event listener for the new item event.
	useEffect(() => {
		// Add an event listener for the new item event.
		const addNewItemListener = (e: Event) => {
			addNewItem((e as CustomEvent<NewItemEvent>).detail);
		};
		window.addEventListener(ADD_NEW_ITEM_EVENT_NAME, addNewItemListener);

		// Cleanup the event listener on component unmount.
		return () => {
			window.removeEventListener(ADD_NEW_ITEM_EVENT_NAME, addNewItemListener);
		};
	}, [addNewItem]);

	return addNewItem;
};
