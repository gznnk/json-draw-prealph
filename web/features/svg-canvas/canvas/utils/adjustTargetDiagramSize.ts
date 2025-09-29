import type { Diagram } from "../../types/state/core/Diagram";
import { calcUnrotatedItemableBoundingBox } from "../../utils/core/calcUnrotatedItemableBoundingBox";
import { getDiagramById } from "../../utils/core/getDiagramById";
import { drawPoint } from "../../utils/debug/drawPoint";
import { drawRect } from "../../utils/debug/drawRect";
import { degreesToRadians } from "../../utils/math/common/degreesToRadians";
import { rotatePoint } from "../../utils/math/points/rotatePoint";
import { isFrame } from "../../utils/validation/isFrame";
import { isItemableState } from "../../utils/validation/isItemableState";

/**
 * Options for adjusting target diagram size
 */
export type AdjustTargetDiagramSizeOptions = {
	/** Padding to add around children when resizing (default: 0) */
	padding?: number;
};

/**
 * Adjusts target diagram size if its children extend beyond bounds.
 * Returns the updated diagrams array with the target diagram resized if necessary.
 *
 * @param diagrams - Array of diagrams to process
 * @param targetId - ID of the target diagram to potentially resize
 * @param originalTargetDiagram - Original target diagram before append operation
 * @param options - Configuration options for the adjustment
 * @returns Updated diagrams array with resized target diagram if needed
 */
export const adjustTargetDiagramSize = (
	diagrams: Diagram[],
	targetId: string,
	originalTargetDiagram: Diagram,
	options: AdjustTargetDiagramSizeOptions = {},
): Diagram[] => {
	const { padding = 0 } = options;

	// Only process Frame type diagrams
	if (!isFrame(originalTargetDiagram)) {
		return diagrams;
	}

	// Get the updated target diagram
	const updatedTargetDiagram = getDiagramById(diagrams, targetId);
	if (
		!updatedTargetDiagram ||
		!isFrame(updatedTargetDiagram) ||
		!isItemableState(updatedTargetDiagram) ||
		!updatedTargetDiagram.items
	) {
		return diagrams;
	}

	// Step 1: Calculate children bounds in unrotated space
	// calcUnrotatedItemableBoundingBox already handles the rotation transformation
	const childrenBounds = calcUnrotatedItemableBoundingBox(
		updatedTargetDiagram.items,
		updatedTargetDiagram.x,
		updatedTargetDiagram.y,
		updatedTargetDiagram.rotation,
	);

	// Debug: Draw target center
	drawPoint(
		"targetCenter",
		{ x: updatedTargetDiagram.x, y: updatedTargetDiagram.y },
		"blue",
	);

	// Debug: Draw childrenBounds (unrotated)
	const childrenTopLeft = { x: childrenBounds.left, y: childrenBounds.top };
	const childrenTopRight = { x: childrenBounds.right, y: childrenBounds.top };
	const childrenBottomLeft = {
		x: childrenBounds.left,
		y: childrenBounds.bottom,
	};
	const childrenBottomRight = {
		x: childrenBounds.right,
		y: childrenBounds.bottom,
	};

	drawPoint("childrenTopLeft", childrenTopLeft, "green");
	drawPoint("childrenTopRight", childrenTopRight, "green");
	drawPoint("childrenBottomLeft", childrenBottomLeft, "green");
	drawPoint("childrenBottomRight", childrenBottomRight, "green");
	drawRect(
		"childrenBounds",
		childrenTopLeft,
		childrenBottomLeft,
		childrenBottomRight,
		childrenTopRight,
		"green",
	);

	// Debug: Draw childrenBounds rotated by updatedTargetDiagram.rotation
	const rotationRadians = degreesToRadians(updatedTargetDiagram.rotation);
	const rotatedTopLeft = rotatePoint(
		childrenBounds.left,
		childrenBounds.top,
		updatedTargetDiagram.x,
		updatedTargetDiagram.y,
		rotationRadians,
	);
	const rotatedTopRight = rotatePoint(
		childrenBounds.right,
		childrenBounds.top,
		updatedTargetDiagram.x,
		updatedTargetDiagram.y,
		rotationRadians,
	);
	const rotatedBottomLeft = rotatePoint(
		childrenBounds.left,
		childrenBounds.bottom,
		updatedTargetDiagram.x,
		updatedTargetDiagram.y,
		rotationRadians,
	);
	const rotatedBottomRight = rotatePoint(
		childrenBounds.right,
		childrenBounds.bottom,
		updatedTargetDiagram.x,
		updatedTargetDiagram.y,
		rotationRadians,
	);

	drawPoint("rotatedTopLeft", rotatedTopLeft, "red");
	drawPoint("rotatedTopRight", rotatedTopRight, "red");
	drawPoint("rotatedBottomLeft", rotatedBottomLeft, "red");
	drawPoint("rotatedBottomRight", rotatedBottomRight, "red");
	drawRect(
		"rotatedChildrenBounds",
		rotatedTopLeft,
		rotatedBottomLeft,
		rotatedBottomRight,
		rotatedTopRight,
		"red",
	);

	// Step 2: Calculate target bounds in unrotated space
	const targetCenterX = updatedTargetDiagram.x;
	const targetCenterY = updatedTargetDiagram.y;
	const halfWidth = updatedTargetDiagram.width / 2;
	const halfHeight = updatedTargetDiagram.height / 2;
	const targetBounds = {
		left: targetCenterX - halfWidth,
		top: targetCenterY - halfHeight,
		right: targetCenterX + halfWidth,
		bottom: targetCenterY + halfHeight,
	};

	// Debug: Draw target bounds
	drawRect(
		"targetBounds",
		{ x: targetBounds.left, y: targetBounds.top },
		{ x: targetBounds.left, y: targetBounds.bottom },
		{ x: targetBounds.right, y: targetBounds.bottom },
		{ x: targetBounds.right, y: targetBounds.top },
		"blue",
	);

	// Step 3: Check if children extend beyond target bounds
	const needsResize =
		childrenBounds.left < targetBounds.left ||
		childrenBounds.right > targetBounds.right ||
		childrenBounds.top < targetBounds.top ||
		childrenBounds.bottom > targetBounds.bottom;

	if (!needsResize) {
		return diagrams;
	}

	// Step 4: Calculate new bounds that contain all children with padding
	const newLeft = Math.min(targetBounds.left, childrenBounds.left - padding);
	const newTop = Math.min(targetBounds.top, childrenBounds.top - padding);
	const newRight = Math.max(targetBounds.right, childrenBounds.right + padding);
	const newBottom = Math.max(
		targetBounds.bottom,
		childrenBounds.bottom + padding,
	);

	// Debug: Draw new bounds
	drawRect(
		"newBounds",
		{ x: newLeft, y: newTop },
		{ x: newLeft, y: newBottom },
		{ x: newRight, y: newBottom },
		{ x: newRight, y: newTop },
		"yellow",
	);

	// Debug: Draw new bounds rotated by updatedTargetDiagram.rotation
	const newBoundsTopLeft = rotatePoint(
		newLeft,
		newTop,
		updatedTargetDiagram.x,
		updatedTargetDiagram.y,
		rotationRadians,
	);
	const newBoundsTopRight = rotatePoint(
		newRight,
		newTop,
		updatedTargetDiagram.x,
		updatedTargetDiagram.y,
		rotationRadians,
	);
	const newBoundsBottomLeft = rotatePoint(
		newLeft,
		newBottom,
		updatedTargetDiagram.x,
		updatedTargetDiagram.y,
		rotationRadians,
	);
	const newBoundsBottomRight = rotatePoint(
		newRight,
		newBottom,
		updatedTargetDiagram.x,
		updatedTargetDiagram.y,
		rotationRadians,
	);

	drawPoint("newBoundsTopLeft", newBoundsTopLeft, "orange");
	drawPoint("newBoundsTopRight", newBoundsTopRight, "orange");
	drawPoint("newBoundsBottomLeft", newBoundsBottomLeft, "orange");
	drawPoint("newBoundsBottomRight", newBoundsBottomRight, "orange");
	drawRect(
		"rotatedNewBounds",
		newBoundsTopLeft,
		newBoundsBottomLeft,
		newBoundsBottomRight,
		newBoundsTopRight,
		"orange",
	);

	// Calculate new center, width, and height
	// First calculate center in unrotated coordinate system
	const unrotatedNewCenterX = (newLeft + newRight) / 2;
	const unrotatedNewCenterY = (newTop + newBottom) / 2;

	// Rotate the new center back to the original coordinate system
	const rotatedNewCenter = rotatePoint(
		unrotatedNewCenterX,
		unrotatedNewCenterY,
		updatedTargetDiagram.x,
		updatedTargetDiagram.y,
		rotationRadians,
	);

	const newCenterX = rotatedNewCenter.x;
	const newCenterY = rotatedNewCenter.y;
	const newWidth = Math.abs(newRight - newLeft);
	const newHeight = Math.abs(newBottom - newTop);

	// Update target diagram with new dimensions
	return diagrams.map((item) => {
		if (item.id === targetId) {
			const newItem = {
				...item,
				x: newCenterX,
				y: newCenterY,
				width: newWidth,
				height: newHeight,
			};

			console.log(newItem);

			return newItem;
		}
		return item;
	});
};
