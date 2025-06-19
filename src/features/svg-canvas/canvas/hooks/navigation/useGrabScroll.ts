// Import React.
import { useCallback, useEffect, useRef } from "react";

// Import types.
import type { CanvasHooksProps } from "../../SvgCanvasTypes";

// Import hooks.
import { useCtrl } from "../keyboard/useCtrl";
import { useScroll } from "./useScroll";

/**
 * Return type for the useGrabScroll hook
 */
type UseGrabScrollReturn = {
	onGrabStart: (e: React.PointerEvent<SVGSVGElement>) => boolean;
	onGrabMove: (e: React.PointerEvent<SVGSVGElement>) => void;
	onGrabEnd: (e: React.PointerEvent<SVGSVGElement>) => void;
};

/**
 * Custom hook for handling Ctrl+drag grab scrolling functionality
 *
 * @param props - Configuration options for grab scrolling
 * @returns Object containing Ctrl state, drag state, and event handlers
 */
export const useGrabScroll = (props: CanvasHooksProps): UseGrabScrollReturn => {
	const {
		canvasState: { minX, minY, isGrabScrolling },
		setCanvasState,
	} = props;

	// Use Ctrl key hook for grab scrolling
	const { isCtrlPressed } = useCtrl();
	const dragStartState = useRef<{
		clientX: number;
		clientY: number;
		minX: number;
		minY: number;
	} | null>(null);

	// Get scroll handler
	const onScroll = useScroll(props);

	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		minX,
		minY,
		isCtrlPressed,
		isGrabScrolling,
		setCanvasState,
		onScroll,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	// Manage grab scrolling state
	useEffect(() => {
		// Bypass references to avoid function creation in every render.
		const { setCanvasState } = refBus.current;

		// Update canvas state based on Ctrl key state
		setCanvasState((prevState) => ({
			...prevState,
			isGrabScrollReady: isCtrlPressed,
			isGrabScrolling: prevState.isGrabScrolling && !isCtrlPressed,
		}));

		// If Ctrl is released, reset the drag start state
		if (!isCtrlPressed) {
			dragStartState.current = null;
		}
	}, [isCtrlPressed]);

	/**
	 * Handle the start of grab scrolling when Ctrl+pointer down
	 *
	 * @param e - Pointer event
	 * @returns true if grab scrolling was started, false otherwise
	 */
	const onGrabStart = useCallback(
		(e: React.PointerEvent<SVGSVGElement>): boolean => {
			// Check for Ctrl+drag to start grab scrolling
			if (e.ctrlKey && e.target === e.currentTarget) {
				// Bypass references to avoid function creation in every render.
				const { setCanvasState, minX, minY } = refBus.current;

				setCanvasState((prevState) => ({
					...prevState,
					isGrabScrolling: true,
				}));

				// Store the initial drag start state
				dragStartState.current = {
					clientX: e.clientX,
					clientY: e.clientY,
					minX,
					minY,
				};

				// Capture the pointer to keep receiving events
				e.currentTarget.setPointerCapture(e.pointerId);
				e.preventDefault();
				return true;
			}
			return false;
		},
		[],
	);

	/**
	 * Handle grab scrolling movement
	 *
	 * @param e - Pointer event
	 */
	const onGrabMove = useCallback(
		(e: React.PointerEvent<SVGSVGElement>): void => {
			// Bypass references to avoid function creation in every render.
			const { isGrabScrolling, onScroll } = refBus.current;
			if (isGrabScrolling && dragStartState.current) {
				// Calculate total movement from the start position
				const totalDeltaX = e.clientX - dragStartState.current.clientX;
				const totalDeltaY = e.clientY - dragStartState.current.clientY;

				// Calculate new scroll position from the initial canvas position
				const newMinX = dragStartState.current.minX - totalDeltaX;
				const newMinY = dragStartState.current.minY - totalDeltaY;

				// Update scroll position
				onScroll?.({
					minX: newMinX,
					minY: newMinY,
					clientX: e.clientX,
					clientY: e.clientY,
				});
			}
		},
		[],
	);

	/**
	 * Handle the end of grab scrolling
	 *
	 * @param e - Pointer event
	 */
	const onGrabEnd = useCallback(
		(e: React.PointerEvent<SVGSVGElement>): void => {
			// Bypass references to avoid function creation in every render.
			const { isGrabScrolling, setCanvasState } = refBus.current;

			if (isGrabScrolling) {
				setCanvasState((prevState) => ({
					...prevState,
					isGrabScrolling: false,
				}));

				// Reset drag start state
				dragStartState.current = null;
				e.currentTarget.releasePointerCapture(e.pointerId);
			}
		},
		[],
	);

	return {
		onGrabStart,
		onGrabMove,
		onGrabEnd,
	};
};
