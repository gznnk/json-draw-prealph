// Import types
import type { Point } from "../../types/CoordinateTypes";
import type { SvgCanvasResizeEvent } from "../../types/EventTypes";
import type { SvgCanvasRef } from "../SvgCanvasTypes";
import {
	CANVAS_EXPANSION_SIZE,
	CANVAS_EXPANSION_THRESHOLD,
} from "../SvgCanvasConstants";

/**
 * Parameters required for canvas resize operations.
 */
export interface CanvasResizeParams {
	/** Minimum X coordinate of the canvas */
	minX: number;
	/** Minimum Y coordinate of the canvas */
	minY: number;
	/** Width of the canvas */
	width: number;
	/** Height of the canvas */
	height: number;
	/** References to DOM elements */
	canvasRef: SvgCanvasRef;
	/** Handler for canvas resize events */
	onCanvasResize?: (e: SvgCanvasResizeEvent) => void;
}

/**
 * Resize the canvas when the pointer is moved to the edges of the canvas.
 * Uses SVG coordinates to determine when to expand the canvas based on cursor position.
 *
 * @param p - The point to check (shape position)
 * @param params - Parameters for canvas resizing including dimensions and callbacks
 * @param cursorX - Optional explicit cursor X position in SVG coordinates
 * @param cursorY - Optional explicit cursor Y position in SVG coordinates
 */
export function canvasResize(
	p: Point,
	params: CanvasResizeParams,
	cursorX?: number,
	cursorY?: number,
): void {
	const { minX, minY, width, height, canvasRef, onCanvasResize } = params;
	const { containerRef, svgRef } = canvasRef;

	// Use cursor coordinates if provided, otherwise use shape position
	const checkX = cursorX ?? p.x;
	const checkY = cursorY ?? p.y;

	// Calculate distance from each edge in SVG coordinates
	const distFromLeft = checkX - minX;
	const distFromTop = checkY - minY;
	const distFromRight = minX + width - checkX;
	const distFromBottom = minY + height - checkY;

	// Check if cursor is near the left edge
	if (distFromLeft < CANVAS_EXPANSION_THRESHOLD) {
		if (containerRef.current && svgRef.current) {
			// Expand canvas to the left
			const newMinX = minX - CANVAS_EXPANSION_SIZE;
			const newWidth = width + (minX - newMinX);

			// Notify the new minX and width to the canvasHooks
			onCanvasResize?.({
				minX: newMinX,
				minY,
				width: newWidth,
				height,
			});

			// Update SVG viewBox directly to prevent rendering issues
			svgRef.current.setAttribute("width", `${newWidth}`);
			svgRef.current.setAttribute(
				"viewBox",
				`${newMinX} ${minY} ${newWidth} ${height}`,
			);

			// Adjust scroll position to keep cursor at the same visual position
			containerRef.current.scrollLeft = CANVAS_EXPANSION_SIZE;
		}
	}
	// Check if cursor is near the top edge
	else if (distFromTop < CANVAS_EXPANSION_THRESHOLD) {
		if (containerRef.current && svgRef.current) {
			// Expand canvas upward
			const newMinY = minY - CANVAS_EXPANSION_SIZE;
			const newHeight = height + (minY - newMinY);

			// Notify the new minY and height to the hooks
			onCanvasResize?.({
				minX,
				minY: newMinY,
				width,
				height: newHeight,
			});

			// Update SVG viewBox directly to prevent rendering issues
			svgRef.current.setAttribute("height", `${newHeight}`);
			svgRef.current.setAttribute(
				"viewBox",
				`${minX} ${newMinY} ${width} ${newHeight}`,
			);

			// Adjust scroll position to keep cursor at the same visual position
			containerRef.current.scrollTop = CANVAS_EXPANSION_SIZE;
		}
	}
	// Check if cursor is near the right edge
	else if (distFromRight < CANVAS_EXPANSION_THRESHOLD) {
		// Expand canvas to the right
		onCanvasResize?.({
			minX,
			minY,
			width: width + CANVAS_EXPANSION_SIZE,
			height,
		});
	}
	// Check if cursor is near the bottom edge
	else if (distFromBottom < CANVAS_EXPANSION_THRESHOLD) {
		// Expand canvas downward
		onCanvasResize?.({
			minX,
			minY,
			width,
			height: height + CANVAS_EXPANSION_SIZE,
		});
	}
}
