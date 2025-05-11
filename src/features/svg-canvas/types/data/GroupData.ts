import type { CreateDataType } from "./CreateDataType";

/**
 * Data type for grouped diagram elements.
 * Implements selectable, transformative, and itemable behaviors to manage collections of elements.
 */
export type GroupData = CreateDataType<{
	selectable: true;
	transformative: true;
	itemable: true;
}>;
