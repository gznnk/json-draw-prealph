import type { Diagram } from "../../types/data/catalog/Diagram";
import { isItemableData } from "../../utils/validation/isItemableData";
import { isSelectableData } from "../../utils/validation/isSelectableData";

/**
 * Remove grouped shapes from the shape array
 *
 * @param items Shape array
 * @returns Updated shape array
 */
export const removeGroupedRecursive = (items: Diagram[]) => {
	return items.filter((item) => {
		if (isSelectableData(item) && item.isSelected) {
			return false;
		}
		if (isItemableData(item)) {
			item.items = removeGroupedRecursive(item.items ?? []);
			if (item.type === "Group" && item.items.length === 0) {
				return false;
			}
		}
		return true;
	});
};
