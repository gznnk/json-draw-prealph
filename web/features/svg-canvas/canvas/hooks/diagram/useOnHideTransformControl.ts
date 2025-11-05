import { useRef, useEffect } from "react";

import { EVENT_NAME_HIDE_TRANSFORM_CONTROL } from "../../../constants/core/EventNames";
import type { HideTransformControlEvent } from "../../../types/events/HideTransformControlEvent";
import type { SvgCanvasSubHooksProps } from "../../types/SvgCanvasSubHooksProps";
import { applyFunctionRecursively } from "../../utils/applyFunctionRecursively";

/**
 * Custom hook to handle transform control visibility events on the canvas.
 * Listens to EVENT_NAME_HIDE_TRANSFORM_CONTROL from the event bus and updates
 * the hideTransformControl property of diagrams.
 * This is a UI-only state change that should NOT be saved to history.
 */
export const useOnHideTransformControl = (props: SvgCanvasSubHooksProps) => {
	const { eventBus, setCanvasState } = props;

	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		eventBus,
		setCanvasState,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	// Listen to hide transform control events from the event bus
	useEffect(() => {
		const { eventBus } = refBus.current;

		const handleEvent = (event: Event) => {
			const customEvent = event as CustomEvent<HideTransformControlEvent>;
			const e = customEvent.detail;

			// Bypass references to avoid function creation in every render.
			const { setCanvasState } = refBus.current;

			setCanvasState((prevState) => {
				// Update items with hideTransformControl property.
				const items = applyFunctionRecursively(prevState.items, (item) => {
					// If the id does not match, return the original item.
					if (item.id !== e.id) return item;

					// If the id matches, update the hideTransformControl property.
					return { ...item, hideTransformControl: e.hide };
				});

				// Create new state with updated items.
				// Note: We do NOT add to history as this is UI-only state
				const newState = {
					...prevState,
					items,
				};

				return newState;
			});
		};

		eventBus.addEventListener(EVENT_NAME_HIDE_TRANSFORM_CONTROL, handleEvent);

		return () => {
			eventBus.removeEventListener(
				EVENT_NAME_HIDE_TRANSFORM_CONTROL,
				handleEvent,
			);
		};
	}, []);
};
