// Import React.
import { useCallback, useEffect, useRef } from "react";

// Import types.
import type { Diagram } from "../../../types/data/catalog/Diagram";
import type { GroupData } from "../../../types/data/shapes/GroupData";
import type { AreaSelectionEvent } from "../../../types/events/AreaSelectionEvent";
import type { SvgCanvasScrollEvent } from "../../../types/events/SvgCanvasScrollEvent";
import { InteractionState } from "../../types/InteractionState";
import type { SvgCanvasSubHooksProps } from "../../types/SvgCanvasSubHooksProps";

// Import constants.
import { EVENT_NAME_SVG_CANVAS_SCROLL } from "../../../constants/EventNames";

// Import utils.
import { calcItemBoundingBox } from "../../../utils/math/geometry/calcItemBoundingBox";
import { getSelectedItems } from "../../../utils/common/getSelectedItems";
import { isItemableData } from "../../../utils/validation/isItemableData";
import { isSelectableData } from "../../../utils/validation/isSelectableData";
import { applyFunctionRecursively } from "../../utils/applyFunctionRecursively";
import { createMultiSelectGroup } from "../../utils/createMultiSelectGroup";
import { removeNonTransformativeShowTransformControls } from "../../utils/removeNonTransformativeShowTransformControls";
import { updateOutlineBySelection } from "../../utils/updateOutlineBySelection";

// Import hooks.
import { useAutoEdgeScroll } from "../navigation/useAutoEdgeScroll";
import { useClearAllSelection } from "./useClearAllSelection";

/**
 * Update items array with outline display based on selection bounds
 */
const updateItemsWithOutline = (
	items: Diagram[],
	selectionBounds: {
		startX: number;
		startY: number;
		endX: number;
		endY: number;
	},
) => {
	// Calculate selection bounds in canvas coordinates
	const minX = Math.min(selectionBounds.startX, selectionBounds.endX);
	const maxX = Math.max(selectionBounds.startX, selectionBounds.endX);
	const minY = Math.min(selectionBounds.startY, selectionBounds.endY);
	const maxY = Math.max(selectionBounds.startY, selectionBounds.endY);

	return applyFunctionRecursively(items, (item) => {
		if (!isSelectableData(item)) return item;
		if (item.type === "ConnectLine") return item;

		// Calculate item bounding box using calcItemBoundingBox function
		const itemBounds = calcItemBoundingBox(item);

		// Check if item's bounding box is completely contained within selection rectangle
		const isInSelection =
			itemBounds.left >= minX &&
			itemBounds.right <= maxX &&
			itemBounds.top >= minY &&
			itemBounds.bottom <= maxY;

		return {
			...item,
			showOutline: isInSelection,
		};
	});
};

/**
 * Convert client coordinates to SVG canvas coordinates using matrixTransform
 */
const clientToCanvasCoords = (
	clientX: number,
	clientY: number,
	svgElement: SVGSVGElement | null,
) => {
	if (!svgElement) {
		return { x: 0, y: 0 };
	}

	const svgPoint = svgElement.createSVGPoint();
	svgPoint.x = clientX;
	svgPoint.y = clientY;

	const screenCTM = svgElement.getScreenCTM();
	if (screenCTM) {
		// Inverse transform to convert from client coordinates to SVG coordinates
		const svgCoords = svgPoint.matrixTransform(screenCTM.inverse());
		return { x: svgCoords.x, y: svgCoords.y };
	}

	return { x: 0, y: 0 };
};

/**
 * Custom hook to handle area selection on the canvas.
 */
export const useAreaSelection = (props: SvgCanvasSubHooksProps) => {
	// Get the clear all selection function
	const onClearAllSelection = useClearAllSelection(props);

	// Get the auto edge scroll function, clear function, and scrolling state
	const { autoEdgeScroll, clearAutoEdgeScroll, isAutoScrolling } =
		useAutoEdgeScroll(props);

	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
		autoEdgeScroll,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	// Handle scroll events from auto edge scroll
	useEffect(() => {
		const { eventBus } = refBus.current.props;

		const handleScrollEvent = (event: CustomEvent<SvgCanvasScrollEvent>) => {
			// Bypass references to avoid function creation in every render.
			const { setCanvasState, canvasState } = refBus.current.props;
			const { interactionState } = canvasState;

			// If area selection is not active, do nothing
			if (interactionState !== InteractionState.AreaSelection) {
				return;
			}

			const { newMinX, newMinY, clientX, clientY, deltaX, deltaY } =
				event.detail;
			const { canvasRef } = refBus.current.props;
			const { x, y } = clientToCanvasCoords(
				clientX + deltaX,
				clientY + deltaY,
				canvasRef?.svgRef.current || null,
			);

			const newSelectionBounds = {
				startX: canvasState.areaSelectionState.startX,
				startY: canvasState.areaSelectionState.startY,
				endX: x,
				endY: y,
			};

			// Update both the area selection state and items outline in a single setCanvasState call
			setCanvasState((prevState) => ({
				...prevState,
				minX: newMinX,
				minY: newMinY,
				areaSelectionState: {
					...prevState.areaSelectionState,
					endX: x,
					endY: y,
				},
				items: updateItemsWithOutline(prevState.items, newSelectionBounds),
			}));
		};

		eventBus.addEventListener(EVENT_NAME_SVG_CANVAS_SCROLL, handleScrollEvent);

		return () => {
			eventBus.removeEventListener(
				EVENT_NAME_SVG_CANVAS_SCROLL,
				handleScrollEvent,
			);
		};
	}, []);

	/**
	 * Updates the selection state of items after area selection.
	 * This function applies selection logic, group selection, and transform controls according to the current outline state.
	 *
	 * - Sets isSelected for items with showOutline
	 * - Handles group selection and deselects children when a group is selected
	 * - Creates a multiSelectGroup if multiple items are selected
	 * - Shows transform controls for single selection
	 * - Updates outline display for selected items and their ancestors
	 * - Removes transform controls from non-transformative items
	 */
	const updateItemsSelection = useCallback(() => {
		const {
			props: { setCanvasState },
		} = refBus.current;

		setCanvasState((prevState) => {
			/**
			 * Step 1: Set isSelected for items with showOutline
			 * Only items with showOutline are marked as selected
			 */
			let items = applyFunctionRecursively(prevState.items, (item) => {
				if (!isSelectableData(item)) {
					return item;
				}
				// Mark item as selected if showOutline is true
				if (item.showOutline) {
					return {
						...item,
						isSelected: true,
					};
				}
				return item;
			});

			/**
			 * Step 2: Handle group selection logic
			 * If all children of a group are selected, select the group and deselect its children
			 */
			const processGroupSelectionLogic = (items: Diagram[]): Diagram[] => {
				const processItem = (item: Diagram): Diagram => {
					// Recursively process nested items (bottom-up)
					if (isItemableData(item)) {
						const updatedItems = item.items.map(processItem);
						// Select group if all children are selected
						if (
							updatedItems.length > 0 &&
							updatedItems.every(
								(child) => isSelectableData(child) && child.isSelected,
							)
						) {
							// Deselect children when group is selected
							const deselectedItems = updatedItems.map((child) => {
								if (isSelectableData(child)) {
									return {
										...child,
										isSelected: false,
									};
								}
								return child;
							});
							return {
								...item,
								items: deselectedItems,
								isSelected: true,
								showOutline: true,
							};
						}
						// Return group with updated children
						return {
							...item,
							items: updatedItems,
						};
					}
					return item;
				};
				return items.map(processItem);
			};
			items = processGroupSelectionLogic(items);

			/**
			 * Step 3: Multi-selection logic
			 * If multiple items are selected, create a multiSelectGroup
			 * If only one item is selected, show transform controls for it
			 */
			const selectedItems = getSelectedItems(items);
			let multiSelectGroup: GroupData | undefined = undefined;
			if (selectedItems.length > 1) {
				// Create multiSelectGroup for multiple selection
				multiSelectGroup = createMultiSelectGroup(
					selectedItems,
					prevState.multiSelectGroup?.keepProportion,
				);
			} else {
				// Show transform controls for single selected item
				items = applyFunctionRecursively(items, (item) => {
					if (!isSelectableData(item)) {
						return item;
					}
					if (item.isSelected) {
						return {
							...item,
							showTransformControls: true,
						};
					}
					return item;
				});
			}

			/**
			 * Step 4: Update outline display for selected items and their ancestors (shared utility)
			 */
			items = updateOutlineBySelection(items);

			/**
			 * Step 5: Remove transform controls from non-transformative items (shared utility)
			 */
			items = removeNonTransformativeShowTransformControls(items);

			return {
				...prevState,
				items,
				multiSelectGroup,
			};
		});
	}, []);

	/**
	 * Clear outline display for all items
	 */
	const clearOutlineDisplay = useCallback(() => {
		const {
			props: { setCanvasState },
		} = refBus.current;

		setCanvasState((prevState) => ({
			...prevState,
			items: applyFunctionRecursively(prevState.items, (item) => {
				if (!isSelectableData(item)) return item;
				return {
					...item,
					showOutline: false,
				};
			}),
		}));
	}, []);

	/**
	 * Handle area selection events
	 */
	const onAreaSelection = useCallback(
		(event: AreaSelectionEvent) => {
			const { canvasState, setCanvasState } = refBus.current.props;
			const { eventType, clientX, clientY } = event;


			switch (eventType) {
				case "Start": {
					const { canvasRef } = refBus.current.props;
					const { x, y } = clientToCanvasCoords(
						clientX,
						clientY,
						canvasRef?.svgRef.current || null,
					);

					// Clear existing selections when starting area selection
					onClearAllSelection();

					// Set interaction state to AreaSelection and initialize selection state
					setCanvasState((prevState) => ({
						...prevState,
						interactionState: InteractionState.AreaSelection,
						areaSelectionState: {
							startX: x,
							startY: y,
							endX: x,
							endY: y,
						},
					}));
					break;
				}

				case "InProgress": {
					// If area selection is not active, do nothing
					if (canvasState.interactionState !== InteractionState.AreaSelection) {
						return;
					}

					const { canvasRef } = refBus.current.props;
					const { x, y } = clientToCanvasCoords(
						clientX,
						clientY,
						canvasRef?.svgRef.current || null,
					);
					const { areaSelectionState } = canvasState;

					const newSelectionState = {
						startX: areaSelectionState.startX,
						startY: areaSelectionState.startY,
						endX: x,
						endY: y,
					};

					if (!isAutoScrolling) {
						// Update both the area selection state and items outline in a single setCanvasState call
						setCanvasState((prevState) => ({
							...prevState,
							items: updateItemsWithOutline(prevState.items, newSelectionState),
							areaSelectionState: newSelectionState,
						}));
					}

					// Trigger auto edge scroll based on current cursor position
					refBus.current.autoEdgeScroll({
						cursorX: x,
						cursorY: y,
						clientX,
						clientY,
					});
					break;
				}

				case "End": {
					// If area selection is not active, do nothing
					if (canvasState.interactionState !== InteractionState.AreaSelection) {
						return;
					}

					// Update items selection based on current showOutline state
					updateItemsSelection();

					// Clear auto edge scroll when area selection ends
					clearAutoEdgeScroll();

					// Update interaction state to Idle and reset selection state
					setCanvasState((prevState) => ({
						...prevState,
						interactionState: InteractionState.Idle,
						areaSelectionState: {
							startX: 0,
							startY: 0,
							endX: 0,
							endY: 0,
						},
					}));
					break;
				}
			}
		},
		[
			onClearAllSelection,
			updateItemsSelection,
			clearAutoEdgeScroll,
			isAutoScrolling,
		],
	);

	const onCancelAreaSelection = useCallback(() => {
		// Clear outline display for all items
		clearOutlineDisplay();

		// Clear auto edge scroll when area selection is cancelled
		clearAutoEdgeScroll();

		// Reset interaction state to Idle and selection state
		const { setCanvasState } = refBus.current.props;
		setCanvasState((prevState) => ({
			...prevState,
			interactionState: InteractionState.Idle,
			areaSelectionState: {
				startX: 0,
				startY: 0,
				endX: 0,
				endY: 0,
			},
		}));
	}, [clearOutlineDisplay, clearAutoEdgeScroll]);

	return {
		selectionState: props.canvasState.areaSelectionState,
		onAreaSelection,
		onCancelAreaSelection,
	};
};
