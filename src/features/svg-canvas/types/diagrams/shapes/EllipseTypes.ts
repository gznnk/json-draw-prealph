import type {
	CreateDataType,
	CreateDiagramProps,
	CreateStateType,
} from "./CreateDiagramTypes";

/**
 * Data type for ellipse shapes.
 * Includes properties for styling, text, connections and transformations of elliptical elements.
 */
export type EllipseData = CreateDataType<{
	transformative: true;
	connectable: true;
	strokable: true;
	fillable: true;
	textable: true;
}>;

/**
 * State type for ellipse shapes.
 * Includes properties for styling, text, connections and transformations of elliptical elements.
 */
export type EllipseState = CreateStateType<
	EllipseData,
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
 * Props for Ellipse component
 */
export type EllipseProps = CreateDiagramProps<
	EllipseState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		textable: true;
	}
>;
