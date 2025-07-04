// Import React.
import React, { memo, useCallback, useRef, useState } from "react";

// Import types.
import { DiagramRegistry } from "../../../registry";
import type { DiagramChangeEvent } from "../../../types/events/DiagramChangeEvent";
import type { DiagramConnectEvent } from "../../../types/events/DiagramConnectEvent";
import type { DiagramDragEvent } from "../../../types/events/DiagramDragEvent";
import type { DiagramTextChangeEvent } from "../../../types/events/DiagramTextChangeEvent";
import type { GroupProps } from "../../../types/props/shapes/GroupProps";

// Import components related to SvgCanvas.
import { PositionLabel } from "../../core/PositionLabel";
import { Outline } from "../../core/Outline";
import { Transformative } from "../../core/Transformative";

/**
 * Group component.
 */
const GroupComponent: React.FC<GroupProps> = ({
	id,
	x,
	y,
	width,
	height,
	rotation,
	scaleX,
	scaleY,
	keepProportion,
	isSelected,
	items,
	showConnectPoints = true,
	showOutline = false,
	showTransformControls = false,
	isTransforming = false,
	onDrag,
	onClick,
	onSelect,
	onTransform,
	onDiagramChange,
	onConnect,
	onTextChange,
	onExecute,
}) => {
	// Flag indicating whether the entire group is being dragged.
	// Set to true only when this group is selected and currently being dragged.
	const [isGroupDragging, setIsGroupDragging] = useState(false);
	// To avoid frequent handler generation, hold referenced values in useRef
	const refBusVal = {
		// Properties
		id,
		x,
		y,
		width,
		height,
		isSelected,
		items,
		onDrag,
		onDiagramChange,
		onConnect,
		onTextChange,
		// Internal variables and functions
		isGroupDragging,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	/**
	 * Drag event handler for shapes within the group
	 */
	const handleChildDiagramDrag = useCallback((e: DiagramDragEvent) => {
		const { isSelected, onDrag } = refBus.current;

		// Processing at drag start
		if (e.eventType === "Start" && isSelected) {
			// If in group selection, enable dragging of the entire group
			setIsGroupDragging(true);
		}

		// Processing during drag
		onDrag?.(e);

		// Clear the dragging flag at drag end
		if (e.eventType === "End") {
			setIsGroupDragging(false);
		}
	}, []);

	/**
	 * Change event handler for shapes within the group
	 */
	const handleChildDiagramChange = useCallback(
		(e: DiagramChangeEvent) => {
			const { id, isSelected, onDiagramChange } = refBus.current;

			if (isSelected) {
				// TODO: Check if this logic is necessary
				// When group is selected, operations that come here are equivalent to drag operations, so convert to drag event and propagate
				const dragEvent = {
					eventType: e.eventType,
					id,
					startX: e.startDiagram.x,
					startY: e.startDiagram.y,
					endX: e.endDiagram.x,
					endY: e.endDiagram.y,
				} as DiagramDragEvent;

				handleChildDiagramDrag(dragEvent);
			} else {
				// When group is not selected, there is no impact on the group other than outline, so propagate the change event as is
				onDiagramChange?.(e);
			}
		},
		[handleChildDiagramDrag],
	);
	/**
	 * Connection event handler for shapes within the group
	 */
	const handleChildDiagramConnect = useCallback((e: DiagramConnectEvent) => {
		const { onConnect } = refBus.current;

		// Nothing special to do, just propagate as is
		onConnect?.(e);
	}, []);
	/**
	 * Text change event handler for shapes within the group
	 */
	const handleChildDiagramTextChange = useCallback(
		(e: DiagramTextChangeEvent) => {
			const { onTextChange } = refBus.current;

			// Propagate the text change event for shapes within the group as is
			onTextChange?.(e);
		},
		[],
	);

	const doShowConnectPoints =
		showConnectPoints && !isSelected && !isGroupDragging && !isTransforming;
	// Create shapes within the group
	const children = items.map((item) => {
		// Ensure that item.type is of DiagramType
		if (!item.type) {
			console.error("Item has no type", item);
			return null;
		}
		const component = DiagramRegistry.getComponent(item.type);
		if (!component) {
			console.warn(`Component not found for type: ${item.type}`);
			return null;
		}
		const props = {
			...item,
			key: item.id,
			showConnectPoints: doShowConnectPoints,
			onClick,
			onSelect,
			onDrag: handleChildDiagramDrag,
			onTransform,
			onDiagramChange: handleChildDiagramChange,
			onConnect: handleChildDiagramConnect,
			onTextChange: handleChildDiagramTextChange,
			onExecute,
		};

		return React.createElement(component(), props);
	});
	return (
		<>
			{children}
			<Outline
				x={x}
				y={y}
				width={width}
				height={height}
				rotation={rotation}
				scaleX={scaleX}
				scaleY={scaleY}
				showOutline={showOutline}
			/>
			{!isGroupDragging && (
				<Transformative
					id={id}
					type="Group"
					x={x}
					y={y}
					width={width}
					height={height}
					rotation={rotation}
					scaleX={scaleX}
					scaleY={scaleY}
					keepProportion={keepProportion}
					showTransformControls={showTransformControls}
					isTransforming={isTransforming}
					onTransform={onTransform}
				/>
			)}
			{isSelected && isGroupDragging && (
				<PositionLabel
					x={x}
					y={y}
					width={width}
					height={height}
					rotation={rotation}
					scaleX={scaleX}
					scaleY={scaleY}
				/>
			)}
		</>
	);
};

export const Group = memo(GroupComponent);
