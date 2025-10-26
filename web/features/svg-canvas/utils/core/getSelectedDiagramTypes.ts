import type { DiagramType } from "../../types/core/DiagramType";
import type { Diagram } from "../../types/state/core/Diagram";
import { isItemableState } from "../validation/isItemableState";
import { isSelectableState } from "../validation/isSelectableState";

/**
 * Internal recursive function to collect diagram types.
 *
 * @param diagrams - The list of diagrams to search.
 * @param types - The set to populate with collected types.
 * @returns {Set<DiagramType>} - The set with collected types.
 */
const collectSelectedDiagramTypes = (
	diagrams: Diagram[],
	types: Set<DiagramType>,
): Set<DiagramType> => {
	for (const item of diagrams) {
		if (isSelectableState(item)) {
			if (item.isSelected) {
				types.add(item.type);
				if (isItemableState(item)) {
					collectSelectedDiagramTypes(item.items, types);
				}
			} else if (isItemableState(item)) {
				collectSelectedDiagramTypes(item.items, types);
			}
		}
	}
	return types;
};

/**
 * Get the types of selected diagrams and their children recursively.
 *
 * @param diagrams - The list of diagrams to search.
 * @returns {Set<DiagramType>} - A set containing all diagram types found in selected diagrams and their descendants.
 */
export const getSelectedDiagramTypes = (
	diagrams: Diagram[],
): Set<DiagramType> => {
	return collectSelectedDiagramTypes(diagrams, new Set<DiagramType>());
};
