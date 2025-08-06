// Import types.
import type { Diagram } from "../../types/state/catalog/Diagram";

// Import utils.
import { updateOutlineOfGroup } from "./updateOutlineOfGroup";

/**
 * Update the outline of all groups in the diagram.
 *
 * @param items - The list of diagrams to update.
 * @returns {Diagram[]} - The updated list of diagrams with the outline of all groups updated.
 */
export const updateOutlineOfAllGroups = (items: Diagram[]): Diagram[] => {
	return items.map((item) => updateOutlineOfGroup(item));
};
