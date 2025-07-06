// Import React.
import { useCallback, useRef } from "react";

// Import types related to SvgCanvas.
import type { PreviewConnectLineEvent } from "../../../types/events/PreviewConnectLineEvent";
import type { CanvasHooksProps } from "../../SvgCanvasTypes";

/**
 * Custom hook to handle preview connect line events on the canvas.
 * Updates the canvas state to show or hide the preview connection line.
 */
export const usePreviewConnectLine = (props: CanvasHooksProps) => {
	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	return useCallback((e: PreviewConnectLineEvent) => {
		// Bypass references to avoid function creation in every render.
		const { setCanvasState } = refBus.current.props;

		setCanvasState((prevState) => {
			// Update the preview connect line state
			return {
				...prevState,
				previewConnectLineState: e.pathData,
			};
		});
	}, []);
};
