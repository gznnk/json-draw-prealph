// Import React.
import { useCallback, useRef } from "react";

// Import types related to SvgCanvas.
import type { SvgCanvasSubHooksProps } from "../../types/SvgCanvasSubHooksProps";
import type { ZoomChangeEvent } from "../../../types/events/ZoomChangeEvent";
import { EVENT_NAME_ZOOM_CHANGE } from "../../../constants/EventNames";
import { newEventId } from "../../../utils/common/newEventId";

// Import constants.
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from "../../SvgCanvasConstants";

/**
 * Custom hook to handle zoom events on the canvas.
 * Zooms around the center of the current view to maintain the center point.
 */
export const useZoom = (props: SvgCanvasSubHooksProps) => {
	const { eventBus } = props;
	
	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
		eventBus,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	return useCallback((newZoom: number) => {
		// Bypass references to avoid function creation in every render.
		const { canvasState, setCanvasState, canvasRef } = refBus.current.props;
		const { eventBus } = refBus.current;

		// Clamp zoom value within min/max limits
		const clampedZoom = Math.max(
			MIN_ZOOM_LEVEL,
			Math.min(MAX_ZOOM_LEVEL, newZoom),
		);

		if (!canvasRef?.containerRef.current) {
			// Fallback: If container ref is not available, use simple zoom
			setCanvasState((prevState) => ({
				...prevState,
				zoom: clampedZoom,
			}));
			
			// Emit zoom change event for fallback case
			const zoomEvent: ZoomChangeEvent = {
				eventId: newEventId(),
				zoom: clampedZoom,
				minX: canvasState.minX,
				minY: canvasState.minY,
			};
			eventBus.dispatchEvent(
				new CustomEvent(EVENT_NAME_ZOOM_CHANGE, {
					detail: zoomEvent,
				}),
			);
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
		// viewBox uses minX / zoom, minY / zoom, containerWidth / zoom, containerHeight / zoom
		const currentViewBoxX = currentMinX / currentZoom;
		const currentViewBoxY = currentMinY / currentZoom;
		const currentViewBoxWidth = containerWidth / currentZoom;
		const currentViewBoxHeight = containerHeight / currentZoom;

		const viewCenterX = currentViewBoxX + currentViewBoxWidth / 2;
		const viewCenterY = currentViewBoxY + currentViewBoxHeight / 2;

		// Calculate new viewBox dimensions for the new zoom level
		const newViewBoxWidth = containerWidth / clampedZoom;
		const newViewBoxHeight = containerHeight / clampedZoom;

		// Calculate new viewBox position to maintain the same center point
		const newViewBoxX = viewCenterX - newViewBoxWidth / 2;
		const newViewBoxY = viewCenterY - newViewBoxHeight / 2;

		// Convert back to minX, minY format (multiply by zoom to match viewBox calculation)
		const newMinX = newViewBoxX * clampedZoom;
		const newMinY = newViewBoxY * clampedZoom;

		setCanvasState((prevState) => ({
			...prevState,
			zoom: clampedZoom,
			minX: newMinX,
			minY: newMinY,
		}));
		
		// Emit zoom change event
		const zoomEvent: ZoomChangeEvent = {
			eventId: newEventId(),
			zoom: clampedZoom,
			minX: newMinX,
			minY: newMinY,
		};
		eventBus.dispatchEvent(
			new CustomEvent(EVENT_NAME_ZOOM_CHANGE, {
				detail: zoomEvent,
			}),
		);
	}, []);
};
