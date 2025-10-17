import { useEffect, useRef } from "react";

import { EXTRACT_SELECTED_DIAGRAMS_TO_TOP_LEVEL_EVENT_NAME } from "../../../constants/core/EventNames";
import type { ExtractSelectedDiagramsToTopLevelEvent } from "../../../types/events/ExtractSelectedDiagramsToTopLevelEvent";
import { getSelectedDiagrams } from "../../../utils/core/getSelectedDiagrams";
import type { SvgCanvasSubHooksProps } from "../../types/SvgCanvasSubHooksProps";
import { cleanupGroups } from "../../utils/cleanupGroups";
import { removeDiagramsById } from "../../utils/removeDiagramsById";
import { updateOutlineOfAllItemables } from "../../utils/updateOutlineOfAllItemables";
import { useAddHistory } from "../history/useAddHistory";

/**
 * Custom hook to handle ExtractSelectedDiagramsToTopLevelEvent on the canvas.
 * Listens for the event and extracts currently selected diagrams to the top level.
 */
export const useOnExtractSelectedDiagramsToTopLevel = (
	props: SvgCanvasSubHooksProps,
) => {
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

		// Listener for ExtractSelectedDiagramsToTopLevelEvent
		const extractSelectedDiagramsToTopLevelListener = (e: Event) => {
			// Bypass references to avoid function creation in every render
			const {
				props: { setCanvasState },
				addHistory,
			} = refBus.current;

			const event = (e as CustomEvent<ExtractSelectedDiagramsToTopLevelEvent>)
				.detail;

			// Update the canvas state
			setCanvasState((prevState) => {
				// 1. Get currently selected diagrams
				const selectedDiagrams = getSelectedDiagrams(prevState.items);
				if (selectedDiagrams.length === 0) {
					console.warn("No diagrams are currently selected");
					return prevState;
				}

				// Extract IDs of diagrams to move
				const diagramIds = selectedDiagrams.map((diagram) => diagram.id);

				// 2. Remove selected diagrams from their current locations
				const diagramsRemovedItems = removeDiagramsById(
					prevState.items,
					diagramIds,
				);

				// 3. Add diagrams to top level (no coordinate transformation needed)
				const updatedItems = [...diagramsRemovedItems, ...selectedDiagrams];

				// 4. Clean up empty groups
				const groupsCleanedUpItems = cleanupGroups(updatedItems);

				// Update outlines
				const itemsWithUpdatedOutlines =
					updateOutlineOfAllItemables(groupsCleanedUpItems);

				// Create new state with updated items
				let newState = {
					...prevState,
					items: itemsWithUpdatedOutlines,
				};

				// Add history
				newState = addHistory(event.eventId, newState);

				return newState;
			});
		};

		// Add the event listener
		eventBus.addEventListener(
			EXTRACT_SELECTED_DIAGRAMS_TO_TOP_LEVEL_EVENT_NAME,
			extractSelectedDiagramsToTopLevelListener,
		);

		// Cleanup the event listener on component unmount
		return () => {
			eventBus.removeEventListener(
				EXTRACT_SELECTED_DIAGRAMS_TO_TOP_LEVEL_EVENT_NAME,
				extractSelectedDiagramsToTopLevelListener,
			);
		};
	}, []);
};
