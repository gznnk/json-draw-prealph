// Import React.
import { memo, useCallback, useMemo, useRef, useState } from "react";
import type React from "react";

// Imports related to this component.
import {
	calculateCombinedCanvasBounds,
	calculateDragNavigationPosition,
	calculateDragOffsetRatio,
	calculateMiniMapScale,
	calculateNavigationPosition,
	calculateViewportBounds,
	calculateViewportRect,
	generateMiniMapItems,
} from "./MiniMapFunctions";
import {
	MiniMapBackground,
	MiniMapContainer,
	MiniMapItem,
	MiniMapSvg,
	ViewportIndicator,
} from "./MiniMapStyled";
import type { MiniMapProps } from "./MiniMapTypes";

/**
 * MiniMap component that shows an overview of the entire canvas
 * with current viewport indicator
 */
const MiniMapComponent: React.FC<MiniMapProps> = ({
	items,
	minX,
	minY,
	containerWidth,
	containerHeight,
	zoom,
	width = 200,
	height = 150,
	onNavigate,
}) => {
	// Calculate canvas bounds based on all items and current viewport
	const canvasBounds = useMemo(() => {
		const viewportBounds = calculateViewportBounds(
			minX,
			minY,
			containerWidth,
			containerHeight,
			zoom,
		);

		return calculateCombinedCanvasBounds(items, viewportBounds);
	}, [items, minX, minY, containerWidth, containerHeight, zoom]);

	// Calculate minimap scale
	const scale = useMemo(() => {
		return calculateMiniMapScale(canvasBounds, width, height);
	}, [canvasBounds, width, height]);

	// Calculate viewport rectangle
	const viewportRect = useMemo(() => {
		return calculateViewportRect(
			minX,
			minY,
			containerWidth,
			containerHeight,
			zoom,
			canvasBounds,
			scale,
			width,
			height,
		);
	}, [
		minX,
		minY,
		containerWidth,
		containerHeight,
		zoom,
		canvasBounds,
		scale,
		width,
		height,
	]);
	// Handle navigation based on click coordinates
	const handleNavigate = useCallback(
		(clientX: number, clientY: number, svgElement: SVGSVGElement) => {
			if (!onNavigate) return;

			const { minX: newMinX, minY: newMinY } = calculateNavigationPosition(
				clientX,
				clientY,
				svgElement,
				canvasBounds,
				scale,
				width,
				height,
				containerWidth,
				containerHeight,
				zoom,
			);

			onNavigate(newMinX, newMinY);
		},
		[
			onNavigate,
			canvasBounds,
			scale,
			width,
			height,
			containerWidth,
			containerHeight,
			zoom,
		],
	);

	// State management for drag operations
	const [isPointerDown, setIsPointerDown] = useState(false);
	const [dragOffsetRatio, setDragOffsetRatio] = useState({ x: 0, y: 0 });
	const [hasDragged, setHasDragged] = useState(false);
	const svgRef = useRef<SVGSVGElement>(null);

	// Click handler for minimap navigation
	const handleClick = useCallback(
		(e: React.MouseEvent<SVGSVGElement>) => {
			// Only navigate on click if no drag operation occurred
			// ViewportIndicator clicks are blocked by stopPropagation in handleViewportClick
			if (!hasDragged) {
				handleNavigate(e.clientX, e.clientY, e.currentTarget);
			}
			// Reset drag state after handling click
			setHasDragged(false);
		},
		[handleNavigate, hasDragged],
	);

	// ViewportIndicator event handlers
	const handleViewportPointerDown = useCallback(
		(e: React.PointerEvent<SVGRectElement>) => {
			e.stopPropagation();
			setIsPointerDown(true);
			setHasDragged(false);
			e.currentTarget.setPointerCapture(e.pointerId);

			// Calculate relative position within viewport using pure function
			const svgElement = e.currentTarget.ownerSVGElement;
			if (!svgElement) return;

			const offsetRatio = calculateDragOffsetRatio(
				e.clientX,
				e.clientY,
				svgElement,
				viewportRect,
			);
			setDragOffsetRatio(offsetRatio);
		},
		[viewportRect],
	);
	const handleViewportPointerMove = useCallback(
		(e: React.PointerEvent<SVGRectElement>) => {
			if (!isPointerDown) return;

			e.stopPropagation();
			setHasDragged(true);

			const svgElement = e.currentTarget.ownerSVGElement;
			if (!svgElement) return;

			// Calculate new navigation position using pure function
			const { minX: newMinX, minY: newMinY } = calculateDragNavigationPosition(
				e.clientX,
				e.clientY,
				svgElement,
				dragOffsetRatio,
				viewportRect,
				canvasBounds,
				scale,
				width,
				height,
				containerWidth,
				containerHeight,
				zoom,
			);

			if (onNavigate) {
				onNavigate(newMinX, newMinY);
			}
		},
		[
			isPointerDown,
			dragOffsetRatio,
			viewportRect,
			canvasBounds,
			scale,
			width,
			height,
			containerWidth,
			containerHeight,
			zoom,
			onNavigate,
		],
	);

	const handleViewportPointerUp = useCallback(
		(e: React.PointerEvent<SVGRectElement>) => {
			e.stopPropagation();
			setIsPointerDown(false);

			// Release pointer capture from the ViewportIndicator element
			e.currentTarget.releasePointerCapture(e.pointerId);

			// Reset drag state after a short delay to allow click handler to check hasDragged
			setTimeout(() => setHasDragged(false), 0);
		},
		[],
	);

	// Prevent click navigation when clicking on ViewportIndicator
	const handleViewportClick = useCallback(
		(e: React.MouseEvent<SVGRectElement>) => {
			e.stopPropagation();
		},
		[],
	);

	// Generate minimap items for rendering
	const miniMapItems = useMemo(() => {
		const itemData = generateMiniMapItems(
			items,
			canvasBounds,
			scale,
			width,
			height,
		);

		return itemData.map((item) => (
			<MiniMapItem
				key={item.id}
				x={item.x}
				y={item.y}
				width={item.width}
				height={item.height}
			/>
		));
	}, [items, canvasBounds, scale, width, height]);

	return (
		<MiniMapContainer width={width} height={height}>
			<MiniMapSvg
				ref={svgRef}
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				onClick={handleClick}
			>
				{/* Background */}
				<MiniMapBackground x={0} y={0} width={width} height={height} />

				{/* Render items */}
				{miniMapItems}

				{/* Viewport indicator */}
				<ViewportIndicator
					x={viewportRect.x}
					y={viewportRect.y}
					width={viewportRect.width}
					height={viewportRect.height}
					onPointerDown={handleViewportPointerDown}
					onPointerMove={handleViewportPointerMove}
					onPointerUp={handleViewportPointerUp}
					onClick={handleViewportClick}
				/>
			</MiniMapSvg>
		</MiniMapContainer>
	);
};

export const MiniMap = memo(MiniMapComponent);
