import type { CreateDataType } from "./CreateDataType";

/**
 * Data type for rectangle shapes.
 * Contains properties specific to rectangular diagram elements.
 */
export type RectangleData = CreateDataType<{
	selectable: true;
	transformative: true;
	connectable: true;
	strokable: true;
	fillable: true;
	textable: true;
}> & {
	radius: number;
};
