import { useCallback, useRef } from "react";

import { EVENT_NAME_SVG_CANVAS_SCROLL } from "../../../constants/core/EventNames";
import type { SvgCanvasScrollEvent } from "../../../types/events/SvgCanvasScrollEvent";
import type { SvgCanvasSubHooksProps } from "../../types/SvgCanvasSubHooksProps";

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
export const useGrabScroll = (
	props: SvgCanvasSubHooksProps,
): UseGrabScrollReturn => {
	const {
		canvasState: { minX, minY, grabScrollState, zoom },
		setCanvasState,
		eventBus,
		onPanZoomChange,
	} = props;

	// Reference to store the initial drag start state
	const dragStartState = useRef<{
		clientX: number;
		clientY: number;
		minX: number;
		minY: number;
	} | null>(null);

	// Velocity tracking for inertia scrolling
	const velocityTracker = useRef<{
		lastClientX: number;
		lastClientY: number;
		lastTime: number;
		velocityX: number;
		velocityY: number;
	} | null>(null);

	// Animation frame reference for inertia
	const inertiaAnimationFrame = useRef<number | null>(null);

	/**
	 * Start inertia scrolling animation with given initial velocity
	 *
	 * @param initialVelocityX - Initial velocity in X direction (pixels per millisecond)
	 * @param initialVelocityY - Initial velocity in Y direction (pixels per millisecond)
	 */
	const startInertiaAnimation = useCallback(
		(initialVelocityX: number, initialVelocityY: number): void => {
			let velocityX = initialVelocityX;
			let velocityY = initialVelocityY;
			let lastTime = performance.now();

			// Deceleration factor (lower = faster stop, higher = longer coast)
			const deceleration = 0.93;
			const minVelocity = 0.01; // Stop when velocity is below this threshold

			const animate = (): void => {
				const currentTime = performance.now();
				const deltaTime = currentTime - lastTime;
				lastTime = currentTime;

				// Apply deceleration
				velocityX *= deceleration;
				velocityY *= deceleration;

				// Check if we should continue animating
				if (
					Math.abs(velocityX) < minVelocity &&
					Math.abs(velocityY) < minVelocity
				) {
					inertiaAnimationFrame.current = null;
					return;
				}

				// Calculate scroll delta
				const deltaX = velocityX * deltaTime;
				const deltaY = velocityY * deltaTime;

				// Update canvas position
				const { setCanvasState, eventBus, zoom, onPanZoomChange, minX, minY } =
					refBus.current;

				const newMinX = minX - deltaX;
				const newMinY = minY - deltaY;

				setCanvasState((prevState) => {
					const newState = {
						...prevState,
						minX: newMinX,
						minY: newMinY,
					};

					onPanZoomChange?.({
						minX: newMinX,
						minY: newMinY,
						zoom,
					});

					return newState;
				});

				// Emit scroll event
				const scrollEvent: SvgCanvasScrollEvent = {
					newMinX,
					newMinY,
					clientX: 0, // Not applicable for inertia
					clientY: 0, // Not applicable for inertia
					deltaX: -deltaX,
					deltaY: -deltaY,
				};
				eventBus.dispatchEvent(
					new CustomEvent(EVENT_NAME_SVG_CANVAS_SCROLL, {
						detail: scrollEvent,
					}),
				);

				// Continue animation
				inertiaAnimationFrame.current = requestAnimationFrame(animate);
			};

			// Start the animation
			inertiaAnimationFrame.current = requestAnimationFrame(animate);
		},
		[],
	);

	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		minX,
		minY,
		zoom,
		isGrabScrolling: grabScrollState?.isGrabScrolling,
		setCanvasState,
		eventBus,
		onPanZoomChange,
		startInertiaAnimation,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	/**
	 * Handle the start of grab scrolling when Ctrl+pointer down
	 *
	 * @param e - Pointer event
	 * @returns true if grab scrolling was started, false otherwise
	 */
	const onGrabStart = useCallback(
		(e: React.PointerEvent<SVGSVGElement>): boolean => {
			// Bypass references to avoid function creation in every render.
			const { setCanvasState, minX, minY } = refBus.current;

			// Reset the drag start state if already set
			setCanvasState((prevState) => ({
				...prevState,
				grabScrollState: {
					isGrabScrolling: false,
					grabScrollOccurred: false,
				},
			}));

			// Cancel any ongoing inertia animation
			if (inertiaAnimationFrame.current !== null) {
				cancelAnimationFrame(inertiaAnimationFrame.current);
				inertiaAnimationFrame.current = null;
			}

			// Check for right click and if the target is the SVG element
			if (e.button === 2 && e.target === e.currentTarget) {
				// Store the initial drag start state
				dragStartState.current = {
					clientX: e.clientX,
					clientY: e.clientY,
					minX,
					minY,
				};

				// Initialize velocity tracker
				velocityTracker.current = {
					lastClientX: e.clientX,
					lastClientY: e.clientY,
					lastTime: performance.now(),
					velocityX: 0,
					velocityY: 0,
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
			// If drag start state is not set, do nothing
			if (!dragStartState.current) return;

			// Bypass references to avoid function creation in every render.
			const { setCanvasState, eventBus, zoom, onPanZoomChange } =
				refBus.current;

			// Update velocity tracker
			if (velocityTracker.current) {
				const currentTime = performance.now();
				const deltaTime = currentTime - velocityTracker.current.lastTime;

				if (deltaTime > 0) {
					const deltaX = e.clientX - velocityTracker.current.lastClientX;
					const deltaY = e.clientY - velocityTracker.current.lastClientY;

					// Calculate velocity in pixels per millisecond
					velocityTracker.current.velocityX = deltaX / deltaTime;
					velocityTracker.current.velocityY = deltaY / deltaTime;
					velocityTracker.current.lastClientX = e.clientX;
					velocityTracker.current.lastClientY = e.clientY;
					velocityTracker.current.lastTime = currentTime;
				}
			}

			// Calculate total movement from the start position
			const totalDeltaX = e.clientX - dragStartState.current.clientX;
			const totalDeltaY = e.clientY - dragStartState.current.clientY;

			// Calculate new scroll position from the initial canvas position
			const newMinX = dragStartState.current.minX - totalDeltaX;
			const newMinY = dragStartState.current.minY - totalDeltaY;

			// Mark that grab scrolling occurred
			setCanvasState((prevState) => {
				const newState = {
					...prevState,
					minX: newMinX,
					minY: newMinY,
					grabScrollState: {
						isGrabScrolling: true,
						grabScrollOccurred: true,
					},
				};

				onPanZoomChange?.({
					minX: newMinX,
					minY: newMinY,
					zoom,
				});

				return newState;
			});

			// Emit scroll event for other components to handle
			const scrollEvent: SvgCanvasScrollEvent = {
				newMinX,
				newMinY,
				clientX: e.clientX,
				clientY: e.clientY,
				deltaX: -totalDeltaX,
				deltaY: -totalDeltaY,
			};
			eventBus.dispatchEvent(
				new CustomEvent(EVENT_NAME_SVG_CANVAS_SCROLL, {
					detail: scrollEvent,
				}),
			);
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
			// If grab scrolling is active, reset the state
			if (refBus.current.isGrabScrolling) {
				// Bypass references to avoid function creation in every render.
				const { setCanvasState, startInertiaAnimation } = refBus.current;

				setCanvasState((prevState) => ({
					...prevState,
					grabScrollState: {
						isGrabScrolling: false,
						grabScrollOccurred: true,
					},
				}));

				// Start inertia animation if there's sufficient velocity
				if (velocityTracker.current) {
					const { velocityX, velocityY } = velocityTracker.current;
					const velocityThreshold = 0.1; // pixels per millisecond
					const hasVelocity =
						Math.abs(velocityX) > velocityThreshold ||
						Math.abs(velocityY) > velocityThreshold;

					if (hasVelocity) {
						startInertiaAnimation(velocityX, velocityY);
					}
				}
			}

			// Reset drag start state
			dragStartState.current = null;
			velocityTracker.current = null;
			e.currentTarget.releasePointerCapture(e.pointerId);
		},
		[],
	);

	return {
		onGrabStart,
		onGrabMove,
		onGrabEnd,
	};
};
