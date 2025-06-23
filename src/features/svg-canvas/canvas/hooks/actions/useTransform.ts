// Import React.
import { useCallback, useRef } from "react";

// Import types related to SvgCanvas.
import type { Diagram } from "../../../types/data/catalog/Diagram";
import type { DiagramTransformEvent } from "../../../types/events/DiagramTransformEvent";
import type { CanvasHooksProps, SvgCanvasState } from "../../SvgCanvasTypes";

// Import hooks related to SvgCanvas.
import { useAutoEdgeScroll } from "../navigation/useAutoEdgeScroll";

// Import functions related to SvgCanvas.
import { DiagramRegistry } from "../../../registry";
import type { ConnectPointData } from "../../../types/data/shapes/ConnectPointData";
import { isConnectableData } from "../../../utils/validation/isConnectableData";
import { addHistory } from "../../utils/addHistory";
import { applyRecursive } from "../../utils/applyRecursive";
import { isDiagramChangingEvent } from "../../utils/isDiagramChangingEvent";
import { isHistoryEvent } from "../../utils/isHistoryEvent";
import { svgCanvasStateToData } from "../../utils/svgCanvasStateToData";
import { updateOutlineOfAllGroups } from "../../utils/updateOutlineOfAllGroups";
import { getDiagramById } from "../../../utils/common/getDiagramById";
import { refreshConnectLines } from "../../../utils/shapes/connectLine/refreshConnectLines";

// Import utility functions for transformation.
import { degreesToRadians } from "../../../utils/math/common/degreesToRadians";
import { isItemableData } from "../../../utils/validation/isItemableData";
import { isTransformativeData } from "../../../utils/validation/isTransformativeData";
import { rotatePoint } from "../../../utils/math/points/rotatePoint";

/**
 * Updates connect points of a diagram item if it's connectable.
 * This function can be generalized for future use.
 */
const updateDiagramConnectPoints = (item: Diagram): void => {
	if (isConnectableData(item)) {
		const calculator = DiagramRegistry.getConnectPointCalculator(item.type);
		if (calculator) {
			// Update the connect points of the item.
			item.connectPoints = calculator(item).map((c) => ({
				...c,
				type: "ConnectPoint",
			})) as ConnectPointData[];
		}
	}
};

/**
 * Custom hook to handle transform events on the canvas.
 */
export const useTransform = (props: CanvasHooksProps) => {
	// Get the auto edge scroll function to handle canvas auto scrolling.
	const autoEdgeScroll = useAutoEdgeScroll(props);

	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
		autoEdgeScroll,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;
	// Reference to store the initial state of child items at the start of transform.
	const startItems = useRef<Diagram[]>([]);
	// Reference to store the canvas state at the start of transform for connect line updates.
	const startCanvasState = useRef<SvgCanvasState | undefined>(undefined);
	/**
	 * Recursively transform child diagrams based on parent transformation.
	 */
	const transformChildrenRecursively = useCallback(
		(
			startDiagrams: Diagram[],
			e: DiagramTransformEvent,
			transformedDiagrams: Diagram[],
		): Diagram[] => {
			// Calculate group scaling
			const groupScaleX = e.endShape.width / e.startShape.width;
			const groupScaleY = e.endShape.height / e.startShape.height;

			const newItems: Diagram[] = [];
			for (const item of startDiagrams) {
				const inversedItemCenter = rotatePoint(
					item.x,
					item.y,
					e.startShape.x,
					e.startShape.y,
					degreesToRadians(-e.startShape.rotation),
				);
				const dx =
					(inversedItemCenter.x - e.startShape.x) *
					e.startShape.scaleX *
					e.endShape.scaleX;
				const dy =
					(inversedItemCenter.y - e.startShape.y) *
					e.startShape.scaleY *
					e.endShape.scaleY;

				const newDx = dx * groupScaleX;
				const newDy = dy * groupScaleY;

				let newCenter = {
					x: e.endShape.x + newDx,
					y: e.endShape.y + newDy,
				};
				newCenter = rotatePoint(
					newCenter.x,
					newCenter.y,
					e.endShape.x,
					e.endShape.y,
					degreesToRadians(e.endShape.rotation),
				);

				if (isTransformativeData(item)) {
					const rotationDiff = e.endShape.rotation - e.startShape.rotation;
					const newRotation = item.rotation + rotationDiff;
					const newItem = {
						...item,
						x: newCenter.x,
						y: newCenter.y,
						width: item.width * groupScaleX,
						height: item.height * groupScaleY,
						rotation: newRotation,
						scaleX: e.endShape.scaleX,
						scaleY: e.endShape.scaleY,
						items: isItemableData(item)
							? transformChildrenRecursively(
									item.items ?? [],
									e,
									transformedDiagrams,
								)
							: undefined,
					} as Diagram;

					// Update the connect points of the transformed item.
					updateDiagramConnectPoints(newItem);
					if (isConnectableData(newItem)) {
						transformedDiagrams.push(newItem);
					}
					newItems.push(newItem);
				} else {
					const newItem = {
						...item,
						x: newCenter.x,
						y: newCenter.y,
					};

					// Update the connect points of the transformed item.
					updateDiagramConnectPoints(newItem);
					if (isConnectableData(newItem)) {
						transformedDiagrams.push(newItem);
					}
					newItems.push(newItem);
				}
			}

			return newItems;
		},
		[],
	);
	// Return a callback function to handle the transform event.
	return useCallback(
		(e: DiagramTransformEvent) => {
			// Bypass references to avoid function creation in every render.
			const {
				props: { setCanvasState, onDataChange },
				autoEdgeScroll,
			} = refBus.current;

			// Update the canvas state based on the transform event.
			setCanvasState((prevState) => {
				// Store the canvas state and initial child items at the start of transform
				if (e.eventType === "Start") {
					// Store the current canvas state for connect line updates
					startCanvasState.current = prevState;

					const targetItem = getDiagramById(prevState.items, e.id);
					if (targetItem && isItemableData(targetItem)) {
						startItems.current = targetItem.items ?? [];
					}
				}

				// Transformed diagrams to be updated.
				const transformedDiagrams: Diagram[] = [];

				let newState = {
					...prevState,
					items: applyRecursive(prevState.items, (item) => {
						if (item.id === e.id) {
							// Apply the new shape to the item.
							let newItem = {
								...item,
								...e.endShape,
							};

							// Update the connect points of the transformed item.
							updateDiagramConnectPoints(newItem);
							if (isConnectableData(newItem)) {
								transformedDiagrams.push(newItem);
							}

							// If the item has children, recursively transform them using the stored initial state.
							if (
								isItemableData(newItem) &&
								startItems.current &&
								startItems.current.length > 0
							) {
								newItem = {
									...newItem,
									items: transformChildrenRecursively(
										startItems.current,
										e,
										transformedDiagrams,
									),
								};
							}

							return newItem;
						}
						return item;
					}),
					isDiagramChanging: isDiagramChangingEvent(e.eventType),
				};

				// Refresh the connect lines for the transformed diagrams.
				newState = refreshConnectLines(
					transformedDiagrams,
					newState,
					startCanvasState.current,
				);

				// Update outline of all groups.
				newState.items = updateOutlineOfAllGroups(newState.items);

				if (isHistoryEvent(e.eventType)) {
					// Add a new history entry.
					newState.lastHistoryEventId = e.eventId;
					newState = addHistory(prevState, newState);

					// Notify the data change.
					onDataChange?.(svgCanvasStateToData(newState));
				}

				// Clean up the stored items at the end of transform
				if (e.eventType === "End") {
					startItems.current = [];
					startCanvasState.current = undefined;
				}

				return newState;
			});
			// Auto scroll if the cursor is near the edges.
			autoEdgeScroll({
				cursorX: e.cursorX ?? e.endShape.x,
				cursorY: e.cursorY ?? e.endShape.y,
			});
		},
		[transformChildrenRecursively],
	);
};
