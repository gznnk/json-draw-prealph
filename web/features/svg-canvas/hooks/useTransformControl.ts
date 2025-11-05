import type React from "react";
import { useCallback, useEffect } from "react";

import { useDiagramUpdate } from "./useDiagramUpdate";
import { EVENT_NAME_TRANSFORM_CONTROL_CLICK } from "../constants/core/EventNames";
import { useEventBus } from "../context/EventBusContext";
import type { TransformControlClickEvent } from "../types/events/TransformControlClickEvent";
import type { TransformativeState } from "../types/state/core/TransformativeState";
import { newEventId } from "../utils/core/newEventId";

/**
 * Props for the useTransformControl hook
 */
export type UseTransformControlProps = {
	id: string;
	ref: React.RefObject<SVGElement>;
	onTransformControlClick?: (e: TransformControlClickEvent) => void;
};

/**
 * Return value from useTransformControl hook
 */
export type UseTransformControlReturn = {
	setShowTransformControl: (show: boolean) => void;
};

/**
 * Custom hook to manage transform control visibility and handle click events via EventBus.
 * This hook allows shape components to:
 * - Control whether their Transformative component should be displayed via hideTransformControl property
 * - Respond to clicks on transform controls without tight coupling
 *
 * Uses useDiagramUpdate to update the diagram's hideTransformControl property,
 * which triggers re-render and proper visibility control.
 *
 * @param props Hook props
 * @param props.id - ID of the diagram
 * @param props.ref - Reference to the SVG element for pointer-over detection
 * @param props.onTransformControlClick - Callback when transform control is clicked
 * @returns Object with setShowTransformControl function
 */
export const useTransformControl = (
	props: UseTransformControlProps,
): UseTransformControlReturn => {
	const { id, onTransformControlClick } = props;
	const eventBus = useEventBus();
	const updateDiagram = useDiagramUpdate();

	// Update diagram's hideTransformControl property using useDiagramUpdate
	const setShowTransformControl = useCallback(
		(show: boolean) => {
			updateDiagram({
				eventId: newEventId(),
				id,
				data: {
					hideTransformControl: !show,
				} as Partial<TransformativeState>,
			});
		},
		[id, updateDiagram],
	);

	useEffect(() => {
		if (!onTransformControlClick) {
			return;
		}

		const handleTransformControlClick = (event: Event) => {
			const customEvent = event as CustomEvent<TransformControlClickEvent>;
			const detail = customEvent.detail;

			// Only respond to events for this diagram
			if (detail.id === id) {
				onTransformControlClick(detail);
			}
		};

		eventBus.addEventListener(
			EVENT_NAME_TRANSFORM_CONTROL_CLICK,
			handleTransformControlClick,
		);

		return () => {
			eventBus.removeEventListener(
				EVENT_NAME_TRANSFORM_CONTROL_CLICK,
				handleTransformControlClick,
			);
		};
	}, [id, onTransformControlClick, eventBus]);

	return {
		setShowTransformControl,
	};
};
