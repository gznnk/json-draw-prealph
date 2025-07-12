import type { Diagram } from "../../types/data/catalog/Diagram";
import { calcGroupOrientedBox } from "../../utils/shapes/group/calcGroupOrientedBox";
import { isItemableData } from "../../utils/validation/isItemableData";

/**
 * Update the outline of a group and its child groups recursively.
 * Calculates the bounding box based on the group's items and updates the group's dimensions.
 *
 * @param group - The group diagram to update.
 * @returns {Diagram} - The updated group diagram with outline updated.
 */
export const updateOutlineOfGroup = (group: Diagram): Diagram => {
	if (!isItemableData(group)) {
		return group;
	}

	// Calculate the bounds of the group.
	const box = calcGroupOrientedBox(group);

	// Update child groups recursively
	let updatedItems = group.items;
	let itemsChanged = false;

	if (group.items) {
		const newItems = group.items.map((item) => {
			if (item.type === "Group") {
				const updatedItem = updateOutlineOfGroup(item);
				if (updatedItem !== item) {
					itemsChanged = true;
				}
				return updatedItem;
			}
			return item;
		});

		if (itemsChanged) {
			updatedItems = newItems;
		}
	}

	// Check if bounds changed
	const boundsChanged =
		group.x !== box.x ||
		group.y !== box.y ||
		group.width !== box.width ||
		group.height !== box.height;

	// If nothing changed, return the original object
	if (!boundsChanged && !itemsChanged) {
		return group;
	}

	// Return the new object with updated bounds and items
	return {
		...group,
		x: box.x,
		y: box.y,
		width: box.width,
		height: box.height,
		items: updatedItems,
	};
};
