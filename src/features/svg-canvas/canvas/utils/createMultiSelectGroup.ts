// Import types.
import type { Diagram } from "../../types/diagrams/catalog/DiagramTypes";
import type { GroupState } from "../../types/diagrams/shapes/GroupTypes";

// Import constants.
import { MULTI_SELECT_GROUP } from "../SvgCanvasConstants";

// Import utils.
import { calcUnrotatedGroupBoundingBox } from "../../utils/shapes/group/calcUnrotatedGroupBoundingBox";

/**
 * Creates a multi-select group from a list of selected items.
 *
 * @param selectedItems - The list of selected items to group
 * @param previousKeepProportion - The previous keepProportion setting to preserve
 * @returns A GroupState object representing the multi-select group
 */
export const createMultiSelectGroup = (
	selectedItems: Diagram[],
	previousKeepProportion = true,
): GroupState => {
	const boundingBox = calcUnrotatedGroupBoundingBox(selectedItems);

	return {
		id: MULTI_SELECT_GROUP,
		x: boundingBox.left + (boundingBox.right - boundingBox.left) / 2,
		y: boundingBox.top + (boundingBox.bottom - boundingBox.top) / 2,
		width: boundingBox.right - boundingBox.left,
		height: boundingBox.bottom - boundingBox.top,
		rotation: 0,
		scaleX: 1,
		scaleY: 1,
		keepProportion: previousKeepProportion,
		isSelected: true,
		showTransformControls: true,
		showOutline: true,
		items: [],
	} as GroupState;
};
