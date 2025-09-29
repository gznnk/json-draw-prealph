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

	// Step 1: Calculate children bounds in target's coordinate system (unrotated space)
	const childrenBounds = calcUnrotatedItemableBoundingBox(
		updatedTargetDiagram.items,
		updatedTargetDiagram.x,
		updatedTargetDiagram.y,
		updatedTargetDiagram.rotation,
	);

	drawPoint(
		"targetCenter",
		{ x: updatedTargetDiagram.x, y: updatedTargetDiagram.y },
		"blue",
	);

	const leftTop = { x: childrenBounds.left, y: childrenBounds.top };
	const leftBottom = { x: childrenBounds.left, y: childrenBounds.bottom };
	const rightTop = { x: childrenBounds.right, y: childrenBounds.top };
	const rightBottom = {
		x: childrenBounds.right,
		y: childrenBounds.bottom,
	};
	drawPoint("leftTop", leftTop);
	drawPoint("leftBottom", leftBottom);
	drawPoint("rightTop", rightTop);
	drawPoint("rightBottom", rightBottom);
	drawRect("childRect", leftTop, leftBottom, rightBottom, rightTop);

	// const leftTopRotate = rotatePoint(
	// 	childrenBounds.left,
	// 	childrenBounds.top,
	// 	updatedTargetDiagram.x,
	// 	updatedTargetDiagram.y,
	// 	degreesToRadians(updatedTargetDiagram.rotation),
	// );
	// const leftBottomRotate = rotatePoint(
	// 	childrenBounds.left,
	// 	childrenBounds.bottom,
	// 	updatedTargetDiagram.x,
	// 	updatedTargetDiagram.y,
	// 	degreesToRadians(updatedTargetDiagram.rotation),
	// );
	// const rightTopRotate = rotatePoint(
	// 	childrenBounds.right,
	// 	childrenBounds.top,
	// 	updatedTargetDiagram.x,
	// 	updatedTargetDiagram.y,
	// 	degreesToRadians(updatedTargetDiagram.rotation),
	// );
	// const rightBottomRotate = rotatePoint(
	// 	childrenBounds.right,
	// 	childrenBounds.bottom,
	// 	updatedTargetDiagram.x,
	// 	updatedTargetDiagram.y,
	// 	degreesToRadians(updatedTargetDiagram.rotation),
	// );
	// drawPoint("leftTopRotate", leftTopRotate, "black");
	// drawPoint("leftBottomRotate", leftBottomRotate, "black");
	// drawPoint("rightTopRotate", rightTopRotate, "black");
	// drawPoint("rightBottomRotate", rightBottomRotate, "black");
	// drawRect(
	// 	"rotateChildRect",
	// 	leftTopRotate,
	// 	leftBottomRotate,
	// 	rightBottomRotate,
	// 	rightTopRotate,
	// 	"black",
	// );

	// Step 2: Rotate children bounds to align with target's unrotated space
	const targetRotationRadians = degreesToRadians(
		-updatedTargetDiagram.rotation,
	);
	const targetCenterX = updatedTargetDiagram.x;
	const targetCenterY = updatedTargetDiagram.y;

	// Rotate children bounds corners around target center
	const childrenTopLeft = rotatePoint(
		childrenBounds.left,
		childrenBounds.top,
		targetCenterX,
		targetCenterY,
		targetRotationRadians,
	);
	const childrenTopRight = rotatePoint(
		childrenBounds.right,
		childrenBounds.top,
		targetCenterX,
		targetCenterY,
		targetRotationRadians,
	);
	const childrenBottomLeft = rotatePoint(
		childrenBounds.left,
		childrenBounds.bottom,
		targetCenterX,
		targetCenterY,
		targetRotationRadians,
	);
	const childrenBottomRight = rotatePoint(
		childrenBounds.right,
		childrenBounds.bottom,
		targetCenterX,
		targetCenterY,
		targetRotationRadians,
	);

	drawPoint("leftTopRotate", childrenTopLeft, "black");
	drawPoint("leftBottomRotate", childrenTopRight, "black");
	drawPoint("rightTopRotate", childrenBottomLeft, "black");
	drawPoint("rightBottomRotate", childrenBottomRight, "black");
	drawRect(
		"rotateChildRect",
		childrenTopLeft,
		childrenTopRight,
		childrenBottomLeft,
		childrenBottomRight,
		"black",
	);

	// Get rotated children bounds
	const rotatedChildrenBounds = {
		left: Math.min(
			childrenTopLeft.x,
			childrenTopRight.x,
			childrenBottomLeft.x,
			childrenBottomRight.x,
		),
		right: Math.max(
			childrenTopLeft.x,
			childrenTopRight.x,
			childrenBottomLeft.x,
			childrenBottomRight.x,
		),
		top: Math.min(
			childrenTopLeft.y,
			childrenTopRight.y,
			childrenBottomLeft.y,
			childrenBottomRight.y,
		),
		bottom: Math.max(
			childrenTopLeft.y,
			childrenTopRight.y,
			childrenBottomLeft.y,
			childrenBottomRight.y,
		),
	};

	// Step 3: Calculate target bounds in unrotated space
	const halfWidth = updatedTargetDiagram.width / 2;
	const halfHeight = updatedTargetDiagram.height / 2;
	const targetBounds = {
		left: targetCenterX - halfWidth,
		top: targetCenterY - halfHeight,
		right: targetCenterX + halfWidth,
		bottom: targetCenterY + halfHeight,
	};

	drawRect(
		"targetBounds",
		{ x: targetBounds.left, y: targetBounds.top },
		{ x: targetBounds.left, y: targetBounds.bottom },
		{ x: targetBounds.right, y: targetBounds.bottom },
		{ x: targetBounds.right, y: targetBounds.top },
		"blue",
	);

	// Step 4: Check if rotated children extend beyond target bounds
	const needsResize =
		rotatedChildrenBounds.left < targetBounds.left ||
		rotatedChildrenBounds.right > targetBounds.right ||
		rotatedChildrenBounds.top < targetBounds.top ||
		rotatedChildrenBounds.bottom > targetBounds.bottom;

	if (!needsResize) {
		return diagrams;
	}

	// Step 5: Calculate new bounds that contain all children with padding
	const newLeft = Math.min(
		targetBounds.left,
		rotatedChildrenBounds.left - padding,
	);
	const newTop = Math.min(
		targetBounds.top,
		rotatedChildrenBounds.top - padding,
	);
	const newRight = Math.max(
		targetBounds.right,
		rotatedChildrenBounds.right + padding,
	);
	const newBottom = Math.max(
		targetBounds.bottom,
		rotatedChildrenBounds.bottom + padding,
	);

	drawRect(
		"newBounds",
		{ x: newLeft, y: newTop },
		{ x: newLeft, y: newBottom },
		{ x: newRight, y: newBottom },
		{ x: newRight, y: newTop },
		"yellow",
	);

	// Calculate new center, width, and height
	const newCenterX = (newLeft + newRight) / 2;
	const newCenterY = (newTop + newBottom) / 2;
	const newWidth = Math.abs(newRight - newLeft);
	const newHeight = Math.abs(newBottom - newTop);

	// Update target diagram with new dimensions
	return diagrams.map((item) => {
		if (item.id === targetId) {
			return {
				...item,
				x: newCenterX,
				y: newCenterY,
				width: newWidth,
				height: newHeight,
			};
		}
		return item;
	});
};
