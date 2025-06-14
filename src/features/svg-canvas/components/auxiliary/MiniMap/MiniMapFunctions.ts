import type { Bounds } from "../../../types/base/Bounds";
import type { Diagram } from "../../../catalog/DiagramTypes";
import { isTransformativeData } from "../../../utils/validation/isTransformativeData";
import { isItemableData } from "../../../utils/validation/isItemableData";
import { calcBoundsOfAllItems } from "../../../canvas/utils/calcBoundsOfAllItems";

/**
 * Calculate the minimap scale factor based on canvas bounds and minimap size
 */
export const calculateMiniMapScale = (
	canvasBounds: Bounds,
	miniMapWidth: number,
	miniMapHeight: number,
): number => {
	const scaleX = miniMapWidth / canvasBounds.width;
	const scaleY = miniMapHeight / canvasBounds.height;

	// Use the smaller scale to ensure everything fits
	return Math.min(scaleX, scaleY, 1);
};

/**
 * Transform canvas coordinates to minimap coordinates
 */
export const transformToMiniMapCoords = (
	x: number,
	y: number,
	canvasBounds: Bounds,
	scale: number,
	miniMapWidth: number,
	miniMapHeight: number,
): { x: number; y: number } => {
	// Translate to canvas origin
	const relativeX = x - canvasBounds.x;
	const relativeY = y - canvasBounds.y;

	// Scale to minimap size
	const scaledX = relativeX * scale;
	const scaledY = relativeY * scale;

	// Center in minimap if canvas is smaller than minimap
	const offsetX = (miniMapWidth - canvasBounds.width * scale) / 2;
	const offsetY = (miniMapHeight - canvasBounds.height * scale) / 2;

	return {
		x: scaledX + Math.max(0, offsetX),
		y: scaledY + Math.max(0, offsetY),
	};
};

/**
 * Transform minimap coordinates back to canvas coordinates
 */
export const transformFromMiniMapCoords = (
	x: number,
	y: number,
	canvasBounds: Bounds,
	scale: number,
	miniMapWidth: number,
	miniMapHeight: number,
): { x: number; y: number } => {
	// Remove centering offset
	const offsetX = (miniMapWidth - canvasBounds.width * scale) / 2;
	const offsetY = (miniMapHeight - canvasBounds.height * scale) / 2;

	const adjustedX = x - Math.max(0, offsetX);
	const adjustedY = y - Math.max(0, offsetY);

	// Scale back to canvas size
	const canvasX = adjustedX / scale + canvasBounds.x;
	const canvasY = adjustedY / scale + canvasBounds.y;

	return {
		x: canvasX,
		y: canvasY,
	};
};

/**
 * Calculate the viewport rectangle in minimap coordinates
 */
export const calculateViewportRect = (
	minX: number,
	minY: number,
	containerWidth: number,
	containerHeight: number,
	zoom: number,
	canvasBounds: Bounds,
	scale: number,
	miniMapWidth: number,
	miniMapHeight: number,
): { x: number; y: number; width: number; height: number } => {
	// Calculate viewport bounds in canvas coordinates
	const viewportX = minX / zoom;
	const viewportY = minY / zoom;
	const viewportWidth = containerWidth / zoom;
	const viewportHeight = containerHeight / zoom;

	// Transform to minimap coordinates
	const topLeft = transformToMiniMapCoords(
		viewportX,
		viewportY,
		canvasBounds,
		scale,
		miniMapWidth,
		miniMapHeight,
	);

	const bottomRight = transformToMiniMapCoords(
		viewportX + viewportWidth,
		viewportY + viewportHeight,
		canvasBounds,
		scale,
		miniMapWidth,
		miniMapHeight,
	);

	return {
		x: topLeft.x,
		y: topLeft.y,
		width: bottomRight.x - topLeft.x,
		height: bottomRight.y - topLeft.y,
	};
};

/**
 * Recursively extract all transformative items from a diagram array,
 * including items inside groups
 */
export const extractTransformativeItemsRecursive = (
	items: Diagram[],
): Diagram[] => {
	const result: Diagram[] = [];

	for (const item of items) {
		if (item.type === "Group" && isItemableData(item)) {
			// For groups, recursively extract items from their children
			const childItems = extractTransformativeItemsRecursive(item.items || []);
			result.push(...childItems);
		} else if (isTransformativeData(item)) {
			// For non-group transformative items, add them directly
			result.push(item);
		}
	}

	return result;
};

/**
 * Calculate combined canvas bounds including both items and viewport.
 * This ensures the minimap shows both content and current view area.
 */
export const calculateCombinedCanvasBounds = (
	items: Diagram[],
	viewportBounds: {
		x: number;
		y: number;
		width: number;
		height: number;
	},
): Bounds => {
	if (items.length === 0) {
		// If no items, use viewport bounds
		return viewportBounds;
	}

	// Calculate bounds of all items
	const itemBounds = calcBoundsOfAllItems(items);

	// Combine item bounds with viewport bounds
	const combinedLeft = Math.min(itemBounds.left, viewportBounds.x);
	const combinedTop = Math.min(itemBounds.top, viewportBounds.y);
	const combinedRight = Math.max(
		itemBounds.right,
		viewportBounds.x + viewportBounds.width,
	);
	const combinedBottom = Math.max(
		itemBounds.bottom,
		viewportBounds.y + viewportBounds.height,
	);

	return {
		x: combinedLeft,
		y: combinedTop,
		width: combinedRight - combinedLeft,
		height: combinedBottom - combinedTop,
	};
};

/**
 * Generate minimap item representations from diagram items.
 * Transforms item coordinates to minimap coordinate system.
 */
export const generateMiniMapItems = (
	items: Diagram[],
	canvasBounds: Bounds,
	scale: number,
	miniMapWidth: number,
	miniMapHeight: number,
): Array<{
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
}> => {
	// Extract all transformative items recursively, including from groups
	const allTransformativeItems = extractTransformativeItemsRecursive(items);

	return allTransformativeItems.map((item) => {
		// At this point, item is guaranteed to be transformative by the extraction function
		const transformativeItem = item as Diagram & {
			x: number;
			y: number;
			width: number;
			height: number;
		};

		// Transform item coordinates to minimap coordinates
		const topLeft = transformToMiniMapCoords(
			transformativeItem.x - transformativeItem.width / 2,
			transformativeItem.y - transformativeItem.height / 2,
			canvasBounds,
			scale,
			miniMapWidth,
			miniMapHeight,
		);

		const itemWidth = transformativeItem.width * scale;
		const itemHeight = transformativeItem.height * scale;

		return {
			id: transformativeItem.id,
			x: topLeft.x,
			y: topLeft.y,
			width: Math.max(1, itemWidth),
			height: Math.max(1, itemHeight),
		};
	});
};

/**
 * Calculate viewport bounds in canvas coordinates based on current view state
 */
export const calculateViewportBounds = (
	minX: number,
	minY: number,
	containerWidth: number,
	containerHeight: number,
	zoom: number,
): { x: number; y: number; width: number; height: number } => {
	const viewportWidth = containerWidth / zoom;
	const viewportHeight = containerHeight / zoom;
	const viewportLeft = minX / zoom;
	const viewportTop = minY / zoom;

	return {
		x: viewportLeft,
		y: viewportTop,
		width: viewportWidth,
		height: viewportHeight,
	};
};
