// Import React.
import type React from "react";
import { memo, useRef } from "react";

// Import types.
import type { FrameProps } from "../../../types/props/elements/FrameProps";

// Import hooks.
import { useClick } from "../../../hooks/useClick";
import { useDrag } from "../../../hooks/useDrag";
import { useHover } from "../../../hooks/useHover";

// Import utils.
import { mergeProps } from "../../../utils/core/mergeProps";

/**
 * Frame component - a simple rectangular frame element
 */
const FrameComponent: React.FC<FrameProps> = ({
	id,
	x,
	y,
	width,
	height,
	fill = "transparent",
	stroke = "black",
	strokeWidth = 1,
	onDrag,
	onDragOver,
	onDragLeave,
	onClick,
	onHoverChange,
}) => {
	// Reference to the SVG element to be transformed
	const svgRef = useRef<SVGRectElement>({} as SVGRectElement);

	// To avoid frequent handler generation, hold referenced values in useRef
	const refBusVal = {
		// Properties
		id,
		onDrag,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	// Generate properties for dragging
	const dragProps = useDrag({
		id,
		type: "Frame",
		x,
		y,
		ref: svgRef,
		onDrag,
		onDragOver,
		onDragLeave,
	});

	// Generate properties for clicking
	const clickProps = useClick({
		id,
		x,
		y,
		isSelected: false, // Frame is not selectable
		isAncestorSelected: false,
		ref: svgRef,
		onClick,
	});

	// Generate properties for hovering
	const hoverProps = useHover({
		id,
		onHoverChange,
	});

	// Compose props for the SVG element
	const composedProps = mergeProps(dragProps, clickProps, hoverProps);

	return (
		<>
			{/* Main frame rectangle */}
			<rect
				id={id}
				x={x - width / 2}
				y={y - height / 2}
				width={width}
				height={height}
				fill={fill}
				stroke={stroke}
				strokeWidth={strokeWidth}
				tabIndex={0}
				cursor="move"
				ref={svgRef}
				{...composedProps}
			/>
		</>
	);
};

export const Frame = memo(FrameComponent);
