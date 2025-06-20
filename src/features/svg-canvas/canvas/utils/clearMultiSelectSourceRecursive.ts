import type { Diagram } from "../../types/data/catalog/Diagram";
import { isItemableData } from "../../utils/validation/isItemableData";
import { isSelectableData } from "../../utils/validation/isSelectableData";

/**
 * Clear the hidden state of shapes set as selection sources during multi-selection
 *
 * @param items Shape array
 * @returns Updated shape array
 */
export const clearMultiSelectSourceRecursive = (
	items: Diagram[],
): Diagram[] => {
	return items.map((item) => {
		const newItem = { ...item };
		if (!isSelectableData(newItem)) {
			return item;
		}
		newItem.isMultiSelectSource = false;
		if (isItemableData(newItem)) {
			newItem.items = clearMultiSelectSourceRecursive(newItem.items ?? []);
		}
		return newItem;
	});
};
