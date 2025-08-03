import type { CreateDataType } from "./CreateDataType";

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
