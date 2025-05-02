// Import React.
import { useCallback, useRef } from "react";

// Import types related to SvgCanvas.
import type { CanvasHooksProps } from "../SvgCanvasTypes";

// Import functions related to SvgCanvas.
import { getSelectedItems } from "../SvgCanvasFunctions";

/**
 * Custom hook to handle copy events on the canvas.
 */
export const useCopy = (props: CanvasHooksProps) => {
	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	return useCallback(() => {
		// Bypass references to avoid function creation in every render.
		const {
			canvasState: { items },
		} = refBus.current.props;

		// Get the selected items from the canvas state.
		const selectedItems = getSelectedItems(items);

		// If no items are selected, do nothing.
		if (selectedItems.length === 0) return;

		try {
			// Convert the selected items to JSON string.
			const clipboardData = JSON.stringify(selectedItems);

			// Copy the data to the clipboard.
			navigator.clipboard
				.writeText(clipboardData)
				.then(() => {
					console.log("Selected items copied to clipboard.");
				})
				.catch((err) => {
					console.error("Could not copy items to clipboard: ", err);
				});
		} catch (error) {
			console.error("Error while copying selected items to clipboard: ", error);
		}
	}, []);
};
