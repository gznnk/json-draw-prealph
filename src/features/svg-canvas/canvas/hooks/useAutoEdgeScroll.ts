// Import React.
import { useCallback, useEffect, useRef } from "react";

// Import types related to SvgCanvas.
import {
	AUTO_SCROLL_INTERVAL_MS,
	AUTO_SCROLL_STEP_SIZE,
	AUTO_SCROLL_THRESHOLD,
} from "../SvgCanvasConstants";
import type { CanvasHooksProps } from "../SvgCanvasTypes";

/**
 * Type definition for scroll directions.
 */
type ScrollDirection = "left" | "top" | "right" | "bottom";

/**
 * Custom hook to handle auto edge scrolling when cursor approaches canvas boundaries.
 *
 * @param props - Canvas hook props including canvas state and setter
 * @returns Function to adjust scroll position when cursor is near edges
 */
export const useAutoEdgeScroll = (props: CanvasHooksProps) => {
	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;
	// Reference to store the current scroll interval ID
	const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
	// Reference to store the last scroll direction for continuous scrolling
	const lastScrollDirectionRef = useRef<{
		direction: ScrollDirection | null;
	}>({ direction: null });

	// Function to clear the scroll interval
	const clearScrollInterval = useCallback(() => {
		if (scrollIntervalRef.current) {
			clearInterval(scrollIntervalRef.current);
			scrollIntervalRef.current = null;
			lastScrollDirectionRef.current.direction = null;
		}
	}, []);

	// Function to perform a single scroll action
	const performScroll = useCallback(
		(direction: ScrollDirection) => {
			const { canvasState, setCanvasState } = refBus.current.props;
			const { minX, minY } = canvasState;

			switch (direction) {
				case "left":
					setCanvasState((prevState) => ({
						...prevState,
						minX: minX - AUTO_SCROLL_STEP_SIZE,
					}));
					break;
				case "top":
					setCanvasState((prevState) => ({
						...prevState,
						minY: minY - AUTO_SCROLL_STEP_SIZE,
					}));
					break;
				case "right":
					setCanvasState((prevState) => ({
						...prevState,
						minX: minX + AUTO_SCROLL_STEP_SIZE,
					}));
					break;
				case "bottom":
					setCanvasState((prevState) => ({
						...prevState,
						minY: minY + AUTO_SCROLL_STEP_SIZE,
					}));
					break;
			}
		},
		[],
	);

	// Function to start continuous scrolling
	const startScrollInterval = useCallback(
		(direction: ScrollDirection) => {
			// Clear existing interval if any
			clearScrollInterval();

			// Set the new direction
			lastScrollDirectionRef.current.direction = direction;

			// Perform initial scroll immediately
			performScroll(direction);

			// Start interval for continuous scrolling
			scrollIntervalRef.current = setInterval(() => {
				// Check if diagram is still changing before continuing
				const { canvasState } = refBus.current.props;
				if (!canvasState.isDiagramChanging) {
					clearScrollInterval();
					return;
				}

				performScroll(direction);
			}, AUTO_SCROLL_INTERVAL_MS);
		},
		[clearScrollInterval, performScroll],
	);

	// Cleanup interval on unmount
	useEffect(() => {
		return () => {
			clearScrollInterval();
		};
	}, [clearScrollInterval]);

	return useCallback(
		({
			cursorX,
			cursorY,
		}: {
			cursorX: number;
			cursorY: number;
		}) => {
			const {
				canvasState: { minX, minY, isDiagramChanging },
				canvasRef,
			} = refBus.current.props;

			if (!canvasRef) return;

			const { containerRef } = canvasRef;
			if (!containerRef.current) return;

			// Stop scrolling if diagram is not changing
			if (!isDiagramChanging) {
				clearScrollInterval();
				return;
			}

			// Get current container dimensions
			const containerRect = containerRef.current.getBoundingClientRect();
			const containerWidth = containerRect.width;
			const containerHeight = containerRect.height;			// Calculate distances from each edge in SVG coordinates
			const distFromLeft = cursorX - minX;
			const distFromTop = cursorY - minY;
			const distFromRight = minX + containerWidth - cursorX;
			const distFromBottom = minY + containerHeight - cursorY;

			// Determine which edge the cursor is closest to
			let newDirection: ScrollDirection | null = null;

			// Left edge scroll adjustment
			if (distFromLeft < AUTO_SCROLL_THRESHOLD) {
				newDirection = "left";
			}
			// Top edge scroll adjustment
			else if (distFromTop < AUTO_SCROLL_THRESHOLD) {
				newDirection = "top";
			}
			// Right edge scroll adjustment
			else if (distFromRight < AUTO_SCROLL_THRESHOLD) {
				newDirection = "right";
			}
			// Bottom edge scroll adjustment
			else if (distFromBottom < AUTO_SCROLL_THRESHOLD) {
				newDirection = "bottom";
			}

			// Handle direction changes
			if (newDirection !== lastScrollDirectionRef.current.direction) {
				if (newDirection === null) {
					// Cursor moved away from edge, stop scrolling
					clearScrollInterval();
				} else {
					// Cursor moved to a different edge or started near an edge
					startScrollInterval(newDirection);
				}
			}
		},
		[clearScrollInterval, startScrollInterval],
	);
};
