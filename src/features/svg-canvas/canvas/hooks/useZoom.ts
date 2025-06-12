// Import React.
import { useCallback, useRef } from "react";

// Import types related to SvgCanvas.
import type { CanvasHooksProps } from "../SvgCanvasTypes";

/**
 * Custom hook to handle zoom events on the canvas.
 * Zooms around the center of the current view to maintain the center point.
 */
export const useZoom = (props: CanvasHooksProps) => {
	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	return useCallback((newZoom: number) => {
		// Bypass references to avoid function creation in every render.
		const { canvasState, setCanvasState, canvasRef } = refBus.current.props;

		if (!canvasRef?.containerRef.current) {
			// Fallback: If container ref is not available, use simple zoom
			setCanvasState((prevState) => ({
				...prevState,
				zoom: newZoom,
			}));
			return;
		}

		const container = canvasRef.containerRef.current;
		const containerRect = container.getBoundingClientRect();
		const containerWidth = containerRect.width;
		const containerHeight = containerRect.height;
		const {
			zoom: currentZoom,
			minX: currentMinX,
			minY: currentMinY,
		} = canvasState;

		// Calculate the current view center in SVG coordinates
		// viewBox uses minX * zoom, so we need to divide by zoom to get actual SVG coordinates
		const currentViewBoxX = currentMinX * currentZoom;
		const currentViewBoxY = currentMinY * currentZoom;
		const currentViewBoxWidth = containerWidth * currentZoom;
		const currentViewBoxHeight = containerHeight * currentZoom;

		const viewCenterX = currentViewBoxX + currentViewBoxWidth / 2;
		const viewCenterY = currentViewBoxY + currentViewBoxHeight / 2;

		// Calculate new viewBox dimensions for the new zoom level
		const newViewBoxWidth = containerWidth * newZoom;
		const newViewBoxHeight = containerHeight * newZoom;

		// Calculate new viewBox position to maintain the same center point
		const newViewBoxX = viewCenterX - newViewBoxWidth / 2;
		const newViewBoxY = viewCenterY - newViewBoxHeight / 2;

		// Convert back to minX, minY format (divide by zoom to match viewBox calculation)
		const newMinX = newViewBoxX / newZoom;
		const newMinY = newViewBoxY / newZoom;

		setCanvasState((prevState) => ({
			...prevState,
			zoom: newZoom,
			minX: newMinX,
			minY: newMinY,
		}));
	}, []);
};
