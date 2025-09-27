import { useEffect, useRef } from "react";

import { APPEND_DIAGRAMS_EVENT_NAME } from "../../../constants/core/EventNames";
import type { AppendDiagramsEvent } from "../../../types/events/AppendDiagramsEvent";
import { getDiagramById } from "../../../utils/core/getDiagramById";
import { calcDiagramBoundingBox } from "../../../utils/math/geometry/calcDiagramBoundingBox";
import { calcDiagramsBoundingBox } from "../../../utils/math/geometry/calcDiagramsBoundingBox";
import { isFrame } from "../../../utils/validation/isFrame";
import { isItemableState } from "../../../utils/validation/isItemableState";
import type { SvgCanvasSubHooksProps } from "../../types/SvgCanvasSubHooksProps";
import { appendDiagrams } from "../../utils/appendDiagrams";
import { cleanupGroups } from "../../utils/cleanupGroups";
import { removeDiagramsById } from "../../utils/removeDiagramsById";
import { updateOutlineOfAllItemables } from "../../utils/updateOutlineOfAllItemables";
import { useAddHistory } from "../history/useAddHistory";


/**
 * Custom hook to handle AppendDiagramsEvent on the canvas.
 * Listens for the event and updates the canvas state accordingly.
 */
export const useOnAppendDiagrams = (props: SvgCanvasSubHooksProps) => {
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

		// Listener for AppendDiagramsEvent
		const appendDiagramsListener = (e: Event) => {
			// Bypass references to avoid function creation in every render
			const {
				props: { setCanvasState },
				addHistory,
			} = refBus.current;

			const event = (e as CustomEvent<AppendDiagramsEvent>).detail;

			// Update the canvas state
			setCanvasState((prevState) => {
				// 1. Get target diagram
				const targetDiagram = getDiagramById(prevState.items, event.targetId);
				if (!targetDiagram) {
					console.warn(`Target diagram with id ${event.targetId} not found`);
					return prevState;
				}

				// Extract IDs of diagrams to move
				const diagramIds = event.diagrams.map(diagram => diagram.id);

				// 2. Remove source diagrams from their current locations
				const diagramsRemovedItems = removeDiagramsById(prevState.items, diagramIds);

				// 3. Append diagrams to target diagram
				let diagramsAppendedItems = appendDiagrams(diagramsRemovedItems, event.targetId, event.diagrams);

				// 4. Adjust target diagram size if appended diagrams extend beyond bounds
				if (isFrame(targetDiagram)) {
					const updatedTargetDiagram = getDiagramById(diagramsAppendedItems, event.targetId);
					if (updatedTargetDiagram && isFrame(updatedTargetDiagram) &&
						isItemableState(updatedTargetDiagram) && updatedTargetDiagram.items) {

						// Calculate current target diagram bounds
						const targetBounds = calcDiagramBoundingBox(targetDiagram);

						// Calculate bounds of all items inside target diagram
						const childrenBounds = calcDiagramsBoundingBox(updatedTargetDiagram.items);

						if (childrenBounds) {
							// Check if children extend beyond target bounds
							const needsResize =
								childrenBounds.left < targetBounds.left ||
								childrenBounds.right > targetBounds.right ||
								childrenBounds.top < targetBounds.top ||
								childrenBounds.bottom > targetBounds.bottom;

							if (needsResize) {
								// Calculate new bounds that contain all children with some padding
								const padding = 20;
								const newLeft = Math.min(targetBounds.left, childrenBounds.left - padding);
								const newTop = Math.min(targetBounds.top, childrenBounds.top - padding);
								const newRight = Math.max(targetBounds.right, childrenBounds.right + padding);
								const newBottom = Math.max(targetBounds.bottom, childrenBounds.bottom + padding);

								// Calculate new center, width, and height
								const newCenterX = (newLeft + newRight) / 2;
								const newCenterY = (newTop + newBottom) / 2;
								const newWidth = newRight - newLeft;
								const newHeight = newBottom - newTop;

								// Update target diagram with new dimensions
								diagramsAppendedItems = diagramsAppendedItems.map(item => {
									if (item.id === event.targetId) {
										return {
											...item,
											x: newCenterX,
											y: newCenterY,
											width: newWidth,
											height: newHeight,
										};
									}
									return item;
								});
							}
						}
					}
				}

				// 5. Clean up empty groups
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
		eventBus.addEventListener(APPEND_DIAGRAMS_EVENT_NAME, appendDiagramsListener);

		// Cleanup the event listener on component unmount
		return () => {
			eventBus.removeEventListener(
				APPEND_DIAGRAMS_EVENT_NAME,
				appendDiagramsListener,
			);
		};
	}, []);
};