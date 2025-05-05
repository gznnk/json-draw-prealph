// Import React.
import { useCallback, useRef } from "react";

// Import types related to SvgCanvas.
import type { Point } from "../../types/CoordinateTypes";
import type { SvgCanvasResizeEvent } from "../../types/EventTypes";
import type { CanvasHooksProps } from "../SvgCanvasTypes";
import { canvasResize } from "../utils/canvasResize";

/**
 * Custom hook to handle canvas resize events on the canvas.
 *
 * @param props - Canvas hook props including canvas state and setter
 * @returns Function to process canvas resize events and directly resize canvas
 */
export const useCanvasResize = (props: CanvasHooksProps) => {
	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	/**
	 * Processes canvas resize events and updates canvas dimensions.
	 *
	 * @param e - Canvas resize event containing new dimensions
	 */
	const processCanvasResize = useCallback((e: SvgCanvasResizeEvent) => {
		// Bypass references to avoid function creation in every render.
		const { setCanvasState } = refBus.current.props;

		setCanvasState((prevState) => ({
			...prevState,
			...e, // Apply new minX, minY, width and height.
		}));
	}, []);

	/**
	 * Directly resizes the canvas when elements approach canvas edges.
	 * Uses the provided canvasRef to manipulate DOM elements.
	 *
	 * @param p - Point coordinates to check for canvas expansion
	 * @param cursorX - Optional explicit cursor X position in SVG coordinates
	 * @param cursorY - Optional explicit cursor Y position in SVG coordinates
	 */
	const resizeCanvas = useCallback(
		(p: Point, cursorX?: number, cursorY?: number) => {
			const { canvasState, canvasRef } = refBus.current.props;

			// Early return if no canvas reference is available
			if (!canvasRef) return;

			const { minX, minY, width, height } = canvasState;

			// Call the extracted canvasResize utility function
			canvasResize(
				p,
				{
					minX,
					minY,
					width,
					height,
					canvasRef,
					onCanvasResize: processCanvasResize,
				},
				cursorX,
				cursorY,
			);
		},
		[processCanvasResize],
	);

	return {
		processCanvasResize,
		resizeCanvas,
	};
};
