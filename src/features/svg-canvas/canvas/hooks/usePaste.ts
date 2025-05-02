// Import React.
import { useCallback, useRef } from "react";

// Import types related to SvgCanvas.
import type { Diagram } from "../../types/DiagramCatalog";
import type { CanvasHooksProps } from "../SvgCanvasTypes";

// Import functions related to SvgCanvas.
import { deepCopy } from "../../utils/Util";
import { newId } from "../../utils/Diagram";

/**
 * Custom hook to handle paste events on the canvas.
 */
export const usePaste = (props: CanvasHooksProps) => {
	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	return useCallback(() => {
		// Bypass references to avoid function creation in every render.
		const { setCanvasState } = refBus.current.props;

		// Read data from clipboard
		navigator.clipboard
			.readText()
			.then((clipboardText) => {
				try {
					// Parse the clipboard data
					const clipboardData = JSON.parse(clipboardText) as Diagram[];

					if (!Array.isArray(clipboardData) || clipboardData.length === 0) {
						console.error("Invalid clipboard data format");
						return;
					}

					// Deep copy the clipboard items to avoid reference issues
					const newItems = deepCopy(clipboardData);

					// Assign new IDs to the pasted items and slightly offset their position
					const pastedItems = newItems.map((item) => {
						const newItem = {
							...item,
							id: newId(),
							isSelected: true,
						};

						// Add a slight offset to position (20px) to make the pasted items visible
						if ("x" in newItem && "y" in newItem) {
							newItem.x = (newItem.x as number) + 20;
							newItem.y = (newItem.y as number) + 20;
						}

						return newItem;
					});

					// Update the canvas state with the pasted items
					setCanvasState((prevState) => {
						// Deselect all existing items
						const updatedItems = prevState.items.map((item) => ({
							...item,
							isSelected: false,
						}));

						// Add the pasted items to the canvas
						return {
							...prevState,
							items: [...updatedItems, ...pastedItems],
							isDiagramChanging: false,
						};
					});
				} catch (error) {
					console.error("Error while pasting items from clipboard:", error);
				}
			})
			.catch((err) => {
				console.error("Failed to read clipboard contents:", err);
			});
	}, []);
};
