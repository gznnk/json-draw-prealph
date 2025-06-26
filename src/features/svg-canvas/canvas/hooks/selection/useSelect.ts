// Import React.
import { useCallback, useRef } from "react";

// Import types related to SvgCanvas.
import type { GroupData } from "../../../types/data/shapes/GroupData";
import type { DiagramSelectEvent } from "../../../types/events/DiagramSelectEvent";

// Import components related to SvgCanvas.
import { createMultiSelectGroup } from "../../utils/createMultiSelectGroup";

// Import functions related to SvgCanvas.
import { applyRecursive } from "../../utils/applyRecursive";
import { getSelectedItems } from "../../../utils/common/getSelectedItems";
import type { CanvasHooksProps } from "../../SvgCanvasTypes";

// Imports related to this component.
import { MULTI_SELECT_GROUP } from "../../SvgCanvasConstants";

// Import utility functions.
import { isSelectableData } from "../../../utils/validation/isSelectableData";

/**
 * Custom hook to handle select events on the canvas.
 */
export const useSelect = (props: CanvasHooksProps, isCtrlPressed?: boolean) => {
	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
		isCtrlPressed,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	return useCallback((e: DiagramSelectEvent) => {
		// Ignore the selection event of the multi-select group itself.
		if (e.id === MULTI_SELECT_GROUP) return;

		// Bypass references to avoid function creation in every render.
		const {
			props: { setCanvasState },
			isCtrlPressed,
		} = refBus.current;

		setCanvasState((prevState) => {
			// Update the selected state of the items.
			const items = applyRecursive(prevState.items, (item) => {
				if (!isSelectableData(item)) {
					// Skip if the item is not selectable.
					return item;
				}

				if (item.id === e.id) {
					if (isCtrlPressed) {
						// When multiple selection, toggle the selection state of the selected diagram.
						return {
							...item,
							isSelected: !item.isSelected,
						};
					}

					// Apply the selected state to the diagram.
					return {
						...item,
						isSelected: true,
					};
				}

				if (isCtrlPressed && item.isSelected) {
					// When multiple selection, do not change the selection state of the selected diagram.
					return item;
				}

				return {
					...item,
					// When single selection, clear the selection state of all diagrams except the selected one.
					isSelected: false,
				};
			});

			// The following code handles multiple selection.

			// Get the selected diagrams from the updated state.
			const selectedItems = getSelectedItems(items);

			// When multiple items are selected, create a dummy group to manage the selected items.
			let multiSelectGroup: GroupData | undefined = undefined;
			if (1 < selectedItems.length) {
				if (selectedItems.some((item) => item.type === "ConnectLine")) {
					// If the selected items include a connection line, keep their selection state unchanged to prevent grouping.
					return prevState;
				}
				// Create initial values for the multi-select group
				multiSelectGroup = createMultiSelectGroup(
					selectedItems,
					prevState.multiSelectGroup?.keepProportion,
				);
			} else {
				// Multi-select source logic is no longer needed
				// Items remain as-is without modification
			}

			return {
				...prevState,
				items,
				multiSelectGroup,
			};
		});
	}, []);
};
