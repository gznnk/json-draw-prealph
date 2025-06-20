import type { Diagram } from "../../../types/data/catalog/Diagram";
import { isItemableData } from "../../validation/isItemableData";
import { isSelectableData } from "../../validation/isSelectableData";

/**
 * Recursively retrieves selected shapes within a group, including shapes in nested groups
 *
 * @param {Diagram[]} diagrams - List of diagrams
 * @returns {string | undefined} - Selected shape within the group
 */
export const getSelectedChildDiagram = (
	diagrams: Diagram[],
): Diagram | undefined => {
	for (const diagram of diagrams) {
		if (isSelectableData(diagram) && diagram.isSelected) {
			return diagram;
		}
		if (isItemableData<Diagram>(diagram)) {
			const ret = getSelectedChildDiagram(diagram.items || []);
			if (ret) {
				return ret;
			}
		}
	}
	return undefined;
};
