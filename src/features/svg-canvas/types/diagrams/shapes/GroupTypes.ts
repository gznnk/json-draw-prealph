import type {
	CreateDataType,
	CreateDiagramProps,
	CreateStateType,
} from "./CreateDiagramTypes";

/**
 * Data type for grouped diagram elements.
 * Implements selectable, transformative, and itemable behaviors to manage collections of elements.
 */
export type GroupData = CreateDataType<{
	transformative: true;
	itemable: true;
}>;

/**
 * State type for grouped diagram elements.
 * Implements selectable, transformative, and itemable behaviors to manage collections of elements.
 */
export type GroupState = CreateStateType<
	GroupData,
	{
		selectable: true;
		transformative: true;
		itemable: true;
	}
>;

/**
 * Props for Group component.
 */
export type GroupProps = CreateDiagramProps<
	GroupState,
	{
		selectable: true;
		transformative: true;
		itemable: true;
		connectable: true;
		textable: true;
		executable: true;
	}
>;
