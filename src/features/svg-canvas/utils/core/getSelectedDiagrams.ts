import type { Diagram } from "../../types/data/catalog/Diagram";
import { isItemableData } from "../validation/isItemableData";
import { isSelectableData } from "../validation/isSelectableData";

/**
 * Get the selected diagrams from a list of diagrams.
 *
 * @param diagrams - The list of diagrams to search.
 * @param selectedDiagrams - The list populated with found selected diagrams.
 * @returns {Diagram[]} - The list of selected diagrams.
 */
export const getSelectedDiagrams = (
	diagrams: Diagram[],
	selectedDiagrams: Diagram[] = [],
) => {
	for (const item of diagrams) {
		if (isSelectableData(item)) {
			if (item.isSelected) {
				selectedDiagrams.push(item);
			} else if (isItemableData(item)) {
				getSelectedDiagrams(item.items, selectedDiagrams);
			}
		}
	}
	return selectedDiagrams;
};
