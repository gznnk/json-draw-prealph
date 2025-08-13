import type { SelectableState } from "../../../types/diagrams/core/SelectableTypes";

export const DefaultSelectableState = {
	isSelected: false,
	isAncestorSelected: false,
	showOutline: false,
} as const satisfies SelectableState;
