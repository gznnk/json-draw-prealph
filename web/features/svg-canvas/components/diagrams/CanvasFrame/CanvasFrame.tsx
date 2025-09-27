import React, { memo, useMemo, useRef } from "react";

import { CanvasFrameElement } from "./CanvasFrameStyled";
import {
	BACKGROUND_COLOR,
	BORDER_COLOR,
	BORDER_WIDTH,
	CORNER_RADIUS,
} from "../../../constants/styling/diagrams/CanvasFrameStyling";
import { useClick } from "../../../hooks/useClick";
import { useDrag } from "../../../hooks/useDrag";
import { useHover } from "../../../hooks/useHover";
import { useSelect } from "../../../hooks/useSelect";
import { DiagramRegistry } from "../../../registry";
import type { DiagramData } from "../../../types/data/core/DiagramData";
import type { CanvasFrameProps } from "../../../types/props/diagrams/CanvasFrameProps";
import { mergeProps } from "../../../utils/core/mergeProps";
import { degreesToRadians } from "../../../utils/math/common/degreesToRadians";
import { createSvgTransform } from "../../../utils/shapes/common/createSvgTransform";
import { Outline } from "../../core/Outline";
import { PositionLabel } from "../../core/PositionLabel";
import { Transformative } from "../../core/Transformative";
import { ConnectPoints } from "../../shapes/ConnectPoints";

/**
 * CanvasFrame component.
 */
const CanvasFrameComponent: React.FC<CanvasFrameProps> = ({
	id,
	x,
	y,
	width,
	height,
	minWidth,
	minHeight,
	rotation,
	scaleX,
	scaleY,
	keepProportion,
	isSelected,
	isAncestorSelected,
	items,
	connectPoints,
	showConnectPoints = false,
	connectEnabled = true,
	isDragging = false,
	showOutline = false,
	showTransformControls = false,
	isTransforming = false,
	isTransparent,
	onDrag,
	onClick,
	onSelect,
	onTransform,
	onDragOver,
	onDragLeave,
	onHoverChange,
	onDiagramChange,
	onConnect,
	onPreviewConnectLine,
	onTextChange,
	onExecute,
}) => {
	// Reference to the SVG element for interaction
	const svgRef = useRef<SVGRectElement>({} as SVGRectElement);

	// Use individual interaction hooks
	const dragProps = useDrag({
		id,
		type: "CanvasFrame",
		x,
		y,
		ref: svgRef,
		onDrag,
		onDragOver,
		onDragLeave,
	});

	const clickProps = useClick({
		id,
		x,
		y,
		isSelected,
		isAncestorSelected,
		ref: svgRef,
		onClick,
	});

	const selectProps = useSelect({
		id,
		onSelect,
	});

	const hoverProps = useHover({
		id,
		onHoverChange,
	});

	// Compose props for the background element using mergeProps
	const composedProps = mergeProps(
		dragProps,
		clickProps,
		selectProps,
		hoverProps,
	);

	// Generate rect transform attribute
	const transform = createSvgTransform(
		scaleX,
		scaleY,
		degreesToRadians(rotation),
		x,
		y,
	);

	// Suppress ConnectPoint re-rendering by memoization
	// If separated by key and passed as individual props, each ConnectPoint side
	// performs comparison processing for each key which is inefficient, so detect Shape differences collectively here
	const ownerFrame = useMemo(
		() => ({
			x,
			y,
			width,
			height,
			rotation,
			scaleX,
			scaleY,
		}),
		[x, y, width, height, rotation, scaleX, scaleY],
	);

	// Create shapes within the canvas frame
	const children = items.map((item: DiagramData) => {
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
			onClick,
			onSelect,
			onDrag,
			onTransform,
			onDragOver,
			onDragLeave,
			onHoverChange,
			onDiagramChange,
			onConnect,
			onPreviewConnectLine,
			onTextChange,
			onExecute,
		};

		return React.createElement(component, props);
	});

	return (
		<>
			<CanvasFrameElement
				id={id}
				x={-width / 2}
				y={-height / 2}
				width={width}
				height={height}
				rx={CORNER_RADIUS}
				ry={CORNER_RADIUS}
				fill={BACKGROUND_COLOR}
				stroke={BORDER_COLOR}
				strokeWidth={BORDER_WIDTH}
				isTransparent={isTransparent}
				tabIndex={0}
				cursor="move"
				transform={transform}
				ref={svgRef}
				{...composedProps}
			/>
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
			{!isDragging && (
				<Transformative
					id={id}
					type="CanvasFrame"
					x={x}
					y={y}
					width={width}
					height={height}
					minWidth={minWidth}
					minHeight={minHeight}
					rotation={rotation}
					scaleX={scaleX}
					scaleY={scaleY}
					keepProportion={keepProportion}
					showTransformControls={showTransformControls}
					isTransforming={isTransforming}
					onTransform={onTransform}
				/>
			)}
			{connectPoints && (
				<ConnectPoints
					ownerId={id}
					ownerFrame={ownerFrame}
					connectPoints={connectPoints}
					showConnectPoints={showConnectPoints}
					shouldRender={!isDragging && !isTransforming && !isSelected}
					connectEnabled={connectEnabled}
					onConnect={onConnect}
					onPreviewConnectLine={onPreviewConnectLine}
				/>
			)}
			{isSelected && isDragging && (
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

export const CanvasFrame = memo(CanvasFrameComponent);
