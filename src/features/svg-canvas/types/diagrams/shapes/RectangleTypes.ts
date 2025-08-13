import type {
	CreateDataType,
	CreateDiagramProps,
	CreateStateType,
} from "./CreateDiagramTypes";

/**
 * Data type for rectangle shapes.
 * Contains properties specific to rectangular diagram elements.
 */
export type RectangleData = CreateDataType<{
	transformative: true;
	connectable: true;
	strokable: true;
	fillable: true;
	textable: true;
}> & {
	radius: number;
};

/**
 * State type for rectangle shapes.
 * Contains properties specific to rectangular diagram elements.
 */
export type RectangleState = CreateStateType<
	RectangleData,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		strokable: true;
		fillable: true;
		textable: true;
	}
>;

/**
 * Props for Rectangle component
 */
export type RectangleProps = CreateDiagramProps<
	RectangleState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		textable: true;
		fileDroppable: true;
	}
>;
