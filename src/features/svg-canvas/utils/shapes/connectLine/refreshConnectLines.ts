import type { SvgCanvasState } from "../../../canvas/SvgCanvasTypes";
import type { Diagram } from "../../../types/data/catalog/Diagram";
import type { ConnectLineData } from "../../../types/data/shapes/ConnectLineData";
import type { Shape } from "../../../types/base/Shape";
import { createBestConnectPath } from "../connectPoint/createBestConnectPath";
import { newId } from "../common/newId";
import { getDiagramById } from "../../../canvas/utils/getDiagramById";
import { isConnectableData } from "../../validation/isConnectableData";

/**
 * Updates connection lines that are connected to the given updated diagrams.
 * Only updates connection lines with autoRouting enabled.
 *
 * @param updatedDiagrams - Array of diagrams that have been updated/transformed
 * @param updatingCanvasState - Current canvas state with updated shapes (excluding connect lines)
 * @returns Updated canvas state with refreshed connect lines
 */
export const refreshConnectLines = (
	updatedDiagrams: Diagram[],
	updatingCanvasState: SvgCanvasState,
): SvgCanvasState => {
	// Create a set of updated diagram IDs for efficient lookup
	const updatedDiagramIds = new Set(updatedDiagrams.map((d) => d.id));

	// Find all connect lines that need to be updated
	const updatedItems = updatingCanvasState.items.map((item) => {
		// Only process ConnectLine items
		if (item.type !== "ConnectLine") {
			return item;
		}

		const connectLine = item as ConnectLineData;

		// Skip if autoRouting is disabled
		if (!connectLine.autoRouting) {
			return item;
		}

		// Check if either end of the connect line is connected to an updated diagram
		const isStartOwnerUpdated = updatedDiagramIds.has(connectLine.startOwnerId);
		const isEndOwnerUpdated = updatedDiagramIds.has(connectLine.endOwnerId);
		if (!isStartOwnerUpdated && !isEndOwnerUpdated) {
			return item;
		}

		// Find the start and end owner shapes using getDiagramById for recursive search
		const startOwnerShape = getDiagramById(
			updatingCanvasState.items,
			connectLine.startOwnerId,
		) as Shape;
		const endOwnerShape = getDiagramById(
			updatingCanvasState.items,
			connectLine.endOwnerId,
		) as Shape;

		// Skip if either owner shape is not found
		if (!startOwnerShape || !endOwnerShape) {
			return item;
		}

		// Skip if either owner shape doesn't have connect points
		if (
			!isConnectableData(startOwnerShape) ||
			!isConnectableData(endOwnerShape)
		) {
			return item;
		}

		// Get the start and end point IDs from the ConnectLine's items array
		const currentItems = connectLine.items;
		if (currentItems.length < 2) {
			return item;
		}

		const startPointId = currentItems[0].id;
		const endPointId = currentItems[currentItems.length - 1].id;

		// Find the connect points from the owner shapes using the point IDs
		const startConnectPoint = startOwnerShape.connectPoints.find(
			(cp) => cp.id === startPointId,
		);
		const endConnectPoint = endOwnerShape.connectPoints.find(
			(cp) => cp.id === endPointId,
		);

		// Skip if connect points are not found
		if (!startConnectPoint || !endConnectPoint) {
			return item;
		}

		// Calculate the new optimal path using the connect points from owner shapes
		const newPath = createBestConnectPath(
			startConnectPoint.x,
			startConnectPoint.y,
			startOwnerShape,
			endConnectPoint.x,
			endConnectPoint.y,
			endOwnerShape,
		);
		// Create new path point data
		const newItems = newPath.map((p, idx) => ({
			id: newId(),
			name: `cp-${idx}`,
			type: "PathPoint",
			x: p.x,
			y: p.y,
		})) as Diagram[];

		// Maintain IDs of both end points to preserve connection references
		newItems[0].id = startPointId;
		newItems[newItems.length - 1].id = endPointId;

		// Return updated connect line with new path
		return {
			...connectLine,
			items: newItems,
		} as ConnectLineData;
	});

	// Return the updated canvas state with refreshed connect lines
	return {
		...updatingCanvasState,
		items: updatedItems,
	};
};
