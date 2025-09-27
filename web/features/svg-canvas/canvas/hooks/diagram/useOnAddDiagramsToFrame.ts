import { useEffect, useRef } from "react";

import { ADD_DIAGRAMS_TO_FRAME_EVENT_NAME } from "../../../constants/core/EventNames";
import type { AddDiagramsToFrameEvent } from "../../../types/events/AddDiagramsToFrameEvent";
import { getDiagramById } from "../../../utils/core/getDiagramById";
import type { SvgCanvasSubHooksProps } from "../../types/SvgCanvasSubHooksProps";
import { appendDiagramsToFrame } from "../../utils/appendDiagramsToFrame";
import { cleanupGroups } from "../../utils/cleanupGroups";
import { removeDiagramsById } from "../../utils/removeDiagramsById";
import { updateOutlineOfAllItemables } from "../../utils/updateOutlineOfAllItemables";
import { useAddHistory } from "../history/useAddHistory";


/**
 * Custom hook to handle AddDiagramsToFrameEvent on the canvas.
 * Listens for the event and updates the canvas state accordingly.
 */
export const useOnAddDiagramsToFrame = (props: SvgCanvasSubHooksProps) => {
	// Get the data change handler
	const addHistory = useAddHistory(props);

	// Create references bypass to avoid function creation in every render
	const refBusVal = {
		props,
		addHistory,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	useEffect(() => {
		// Bypass references to avoid function creation in every render
		const { eventBus } = refBus.current.props;

		// Listener for AddDiagramsToFrameEvent
		const addDiagramsToFrameListener = (e: Event) => {
			// Bypass references to avoid function creation in every render
			const {
				props: { setCanvasState },
				addHistory,
			} = refBus.current;

			const event = (e as CustomEvent<AddDiagramsToFrameEvent>).detail;

			// Update the canvas state
			setCanvasState((prevState) => {
				// 1. Get target frame
				const targetFrame = getDiagramById(prevState.items, event.targetFrameId);
				if (!targetFrame) {
					console.warn(`Target frame with id ${event.targetFrameId} not found`);
					return prevState;
				}

				// Extract IDs of diagrams to move
				const diagramIds = event.diagrams.map(diagram => diagram.id);

				// 2. Remove source diagrams from their current locations
				const diagramsRemovedItems = removeDiagramsById(prevState.items, diagramIds);

				// 3. Append diagrams to target frame
				const diagramsAppendedItems = appendDiagramsToFrame(diagramsRemovedItems, event.targetFrameId, event.diagrams);

				// 4. Clean up empty groups
				const groupsCleanedUpItems = cleanupGroups(diagramsAppendedItems);

				// Update outlines
				const updatedItems = updateOutlineOfAllItemables(groupsCleanedUpItems);

				// Create new state with updated items
				let newState = {
					...prevState,
					items: updatedItems,
				};

				// Add history
				newState = addHistory(event.eventId, newState);

				return newState;
			});
		};

		// Add the event listener
		eventBus.addEventListener(ADD_DIAGRAMS_TO_FRAME_EVENT_NAME, addDiagramsToFrameListener);

		// Cleanup the event listener on component unmount
		return () => {
			eventBus.removeEventListener(
				ADD_DIAGRAMS_TO_FRAME_EVENT_NAME,
				addDiagramsToFrameListener,
			);
		};
	}, []);
};