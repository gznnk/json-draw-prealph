// Import React.
import { useCallback, useRef, useState } from "react";

// Import types related to SvgCanvas.
import type { CanvasHooksProps } from "../../SvgCanvasTypes";

// Import functions related to SvgCanvas.
import { isSelectableData } from "../../../utils/validation/isSelectableData";

/**
 * Area selection state type
 */
export type AreaSelectionState = {
	isSelecting: boolean;
	startX: number;
	startY: number;
	endX: number;
	endY: number;
};

/**
 * Custom hook to handle area selection on the canvas.
 */
export const useAreaSelection = (props: CanvasHooksProps) => {
	const [selectionState, setSelectionState] = useState<AreaSelectionState>({
		isSelecting: false,
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0,
	});

	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
		selectionState,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	/**
	 * Convert client coordinates to SVG canvas coordinates using matrixTransform
	 */
	const clientToCanvasCoords = useCallback(
		(clientX: number, clientY: number) => {
			const { canvasRef } = refBus.current.props;

			if (!canvasRef?.svgRef.current) {
				return { x: 0, y: 0 };
			}

			const svgElement = canvasRef.svgRef.current;
			const svgPoint = svgElement.createSVGPoint();
			svgPoint.x = clientX;
			svgPoint.y = clientY;

			const screenCTM = svgElement.getScreenCTM();
			if (screenCTM) {
				// Inverse transform to convert from client coordinates to SVG coordinates
				const svgCoords = svgPoint.matrixTransform(screenCTM.inverse());
				return { x: svgCoords.x, y: svgCoords.y };
			}

			return { x: 0, y: 0 };
		},
		[],
	);

	const onStartAreaSelection = useCallback(
		(clientX: number, clientY: number) => {
			const { x, y } = clientToCanvasCoords(clientX, clientY);
			setSelectionState({
				isSelecting: true,
				startX: x,
				startY: y,
				endX: x,
				endY: y,
			});
		},
		[clientToCanvasCoords],
	);

	const onUpdateAreaSelection = useCallback(
		(clientX: number, clientY: number) => {
			const { x, y } = clientToCanvasCoords(clientX, clientY);
			setSelectionState((prev) => ({
				...prev,
				endX: x,
				endY: y,
			}));
		},
		[clientToCanvasCoords],
	);

	const onEndAreaSelection = useCallback(() => {
		const {
			props: { setCanvasState },
			selectionState: currentSelectionState,
		} = refBus.current;

		if (!currentSelectionState.isSelecting) return;

		// Select items within the selection area
		setCanvasState((prevState) => {
			// Calculate selection bounds in canvas coordinates
			const minX = Math.min(
				currentSelectionState.startX,
				currentSelectionState.endX,
			);
			const maxX = Math.max(
				currentSelectionState.startX,
				currentSelectionState.endX,
			);
			const minY = Math.min(
				currentSelectionState.startY,
				currentSelectionState.endY,
			);
			const maxY = Math.max(
				currentSelectionState.startY,
				currentSelectionState.endY,
			);

			// Update selection state of items
			const updatedItems = prevState.items.map((item) => {
				if (!isSelectableData(item)) return item;

				// Calculate item bounds - items are already in canvas coordinate system
				const itemLeft = item.x;
				const itemRight = item.x + (item.width || 0);
				const itemTop = item.y;
				const itemBottom = item.y + (item.height || 0);

				// Check if item overlaps with selection rectangle
				const isSelected =
					itemLeft < maxX &&
					itemRight > minX &&
					itemTop < maxY &&
					itemBottom > minY;

				return {
					...item,
					isSelected,
				};
			});

			return {
				...prevState,
				items: updatedItems,
			};
		});

		// Reset selection state
		setSelectionState({
			isSelecting: false,
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0,
		});
	}, []);

	const onCancelAreaSelection = useCallback(() => {
		setSelectionState({
			isSelecting: false,
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0,
		});
	}, []);

	return {
		selectionState,
		onStartAreaSelection,
		onUpdateAreaSelection,
		onEndAreaSelection,
		onCancelAreaSelection,
	};
};
