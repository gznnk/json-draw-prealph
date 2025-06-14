// Import React.
import { memo, useCallback, useMemo } from "react";
import type React from "react";

// Imports related to this component.
import {
	calculateCombinedCanvasBounds,
	calculateMiniMapScale,
	calculateViewportBounds,
	calculateViewportRect,
	generateMiniMapItems,
	transformFromMiniMapCoords,
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

	// Handle click on minimap to navigate
	const handleClick = useCallback(
		(e: React.MouseEvent<SVGSVGElement>) => {
			if (!onNavigate) return;

			const rect = e.currentTarget.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const clickY = e.clientY - rect.top;

			// Transform click coordinates to canvas coordinates
			const canvasCoords = transformFromMiniMapCoords(
				clickX,
				clickY,
				canvasBounds,
				scale,
				width,
				height,
			);

			// Calculate new viewport position to center the clicked point
			const viewportWidth = containerWidth / zoom;
			const viewportHeight = containerHeight / zoom;

			const newViewportX = canvasCoords.x - viewportWidth / 2;
			const newViewportY = canvasCoords.y - viewportHeight / 2;

			// Convert back to minX, minY format
			const newMinX = newViewportX * zoom;
			const newMinY = newViewportY * zoom;

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

	// Render minimap items
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
				/>
			</MiniMapSvg>
		</MiniMapContainer>
	);
};

export const MiniMap = memo(MiniMapComponent);
