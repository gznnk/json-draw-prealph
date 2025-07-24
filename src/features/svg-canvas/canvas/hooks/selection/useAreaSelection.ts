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
import { isTransformativeData } from "../../../utils/validation/isTransformativeData";
import { applyFunctionRecursively } from "../../utils/applyFunctionRecursively";
import { createMultiSelectGroup } from "../../utils/createMultiSelectGroup";

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
	 * Update items selection based on the current selection state
	 */
	const updateItemsSelection = useCallback(() => {
		const {
			props: { setCanvasState },
		} = refBus.current;

		setCanvasState((prevState) => {
			// Step 1: Update isSelected based on showOutline state
			let items = applyFunctionRecursively(prevState.items, (item) => {
				if (!isSelectableData(item)) {
					return item;
				}

				// Select items that have showOutline set to true
				if (item.showOutline) {
					return {
						...item,
						isSelected: true,
					};
				}

				return item;
			});

			// Step 2: Process group selection - update isSelected and showTransformControls for groups
			const processGroupSelectionLogic = (items: Diagram[]): Diagram[] => {
				const processItem = (item: Diagram): Diagram => {
					// First, recursively process all nested items (bottom-up approach)
					if (isItemableData(item)) {
						const updatedItems = item.items.map(processItem);

						// After processing children, check if this group should be selected
						if (
							updatedItems.length > 0 && // Ensure the group has children
							updatedItems.every(
								(child) => isSelectableData(child) && child.isSelected,
							)
						) {
							// Deselect all children when the group is selected
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
								showOutline: true, // Show outline for the group
							};
						}

						// Return with updated items
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

			// Step 3: Multi-selection logic - create multiSelectGroup if multiple items are selected
			const selectedItems = getSelectedItems(items);
			let multiSelectGroup: GroupData | undefined = undefined;
			if (selectedItems.length > 1) {
				// Create initial values for the multi-select group
				multiSelectGroup = createMultiSelectGroup(
					selectedItems,
					prevState.multiSelectGroup?.keepProportion,
				);
			} else {
				// If only one item is selected, show transform controls for it
				items = applyFunctionRecursively(items, (item) => {
					if (!isSelectableData(item)) {
						return item;
					}

					// Show transform controls only for the selected item
					if (item.isSelected) {
						return {
							...item,
							showTransformControls: true,
						};
					}

					return item;
				});
			}

			// Update the items to show outlines based on selection state
			items = applyFunctionRecursively(items, (item, ancestors) => {
				if (!isSelectableData(item)) {
					return item;
				}

				const isAncestorSelected = ancestors.some(
					(ancestor) => isSelectableData(ancestor) && ancestor.isSelected,
				);

				// Show outline when the item is selected or when any ancestor is selected
				const shouldShowOutline = item.isSelected || isAncestorSelected;

				return {
					...item,
					isAncestorSelected,
					showOutline: shouldShowOutline,
				};
			});

			// If the item is not transformative, remove the showTransformControls property
			items = applyFunctionRecursively(items, (item) => {
				if (!isTransformativeData(item) && "showTransformControls" in item) {
					const { showTransformControls, ...rest } = item as Diagram & {
						showTransformControls: boolean;
					};
					return {
						...rest,
					};
				}
				return item;
			});

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

			// If isAutoScrolling, skip movement logic and only call autoEdgeScroll
			if (isAutoScrolling) {
				const { canvasRef } = refBus.current.props;
				const { x, y } = clientToCanvasCoords(
					clientX,
					clientY,
					canvasRef?.svgRef.current || null,
				);
				refBus.current.autoEdgeScroll({
					cursorX: x,
					cursorY: y,
					clientX,
					clientY,
				});
				return;
			}

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

					// Update both the area selection state and items outline in a single setCanvasState call
					setCanvasState((prevState) => ({
						...prevState,
						items: updateItemsWithOutline(prevState.items, newSelectionState),
						areaSelectionState: newSelectionState,
					}));

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
