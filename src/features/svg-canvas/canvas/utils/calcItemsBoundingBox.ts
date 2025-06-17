// Import types.
import type { Box } from "../../types/base/Box";
import type { Diagram } from "../../types/data/catalog/Diagram";

// Import utils.
import { degreesToRadians } from "../../utils/math/common/degreesToRadians";
import { rotatePoint } from "../../utils/math/points/rotatePoint";
import { calcGroupOrientedBox } from "../../utils/shapes/group/calcGroupOrientedBox";
import { isItemableData } from "../../utils/validation/isItemableData";
import { isTransformativeData } from "../../utils/validation/isTransformativeData";

/**
 * Calculate the bounding box of all provided items.
 *
 * @param items - The list of items to calculate the bounding box for.
 * @returns The bounding box that encompasses all provided items.
 */
export const calcItemsBoundingBox = (items: Diagram[]): Box => {
	const box = {
		top: Number.MAX_VALUE,
		left: Number.MAX_VALUE,
		right: Number.MIN_VALUE,
		bottom: Number.MIN_VALUE,
	};

	for (const item of items) {
		if (isItemableData(item) && item.type === "Group") {
			const groupOrientedBox = calcGroupOrientedBox(item);
			box.top = Math.min(box.top, groupOrientedBox.y);
			box.left = Math.min(box.left, groupOrientedBox.x);
			box.right = Math.max(
				box.right,
				groupOrientedBox.x + groupOrientedBox.width,
			);
			box.bottom = Math.max(
				box.bottom,
				groupOrientedBox.y + groupOrientedBox.height,
			);
		} else if (isTransformativeData(item)) {
			const radians = degreesToRadians(item.rotation);
			const leftTop = rotatePoint(
				item.x - item.width / 2,
				item.y - item.height / 2,
				item.x,
				item.y,
				radians,
			);
			const rightBottom = rotatePoint(
				item.x + item.width / 2,
				item.y + item.height / 2,
				item.x,
				item.y,
				radians,
			);
			box.top = Math.min(box.top, leftTop.y);
			box.left = Math.min(box.left, leftTop.x);
			box.right = Math.max(box.right, rightBottom.x);
			box.bottom = Math.max(box.bottom, rightBottom.y);
		}
	}

	return box;
};
